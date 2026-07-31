import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("assessment_sessions")
    .select("id,status,current_question,answers,updated_at,template_id,assessment_templates(slug,title)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const slug = String(body.slug || "wellbeing-foundations");
  const answers = Array.isArray(body.answers) ? body.answers.map(Number) : [];
  const currentQuestion = Math.max(0, Number(body.currentQuestion || 0));
  const complete = Boolean(body.complete);

  const { data: template, error: templateError } = await supabase
    .from("assessment_templates")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (templateError || !template) {
    return NextResponse.json({ error: "Assessment template is unavailable. Run the Phase A migration first." }, { status: 500 });
  }

  const { data: existing } = await supabase
    .from("assessment_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("template_id", template.id)
    .eq("status", "in_progress")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sessionPayload = {
    user_id: user.id,
    template_id: template.id,
    answers,
    current_question: currentQuestion,
    status: complete ? "completed" : "in_progress",
    completed_at: complete ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const sessionQuery = existing
    ? supabase.from("assessment_sessions").update(sessionPayload).eq("id", existing.id).select("id").single()
    : supabase.from("assessment_sessions").insert(sessionPayload).select("id").single();

  const { data: session, error: sessionError } = await sessionQuery;
  if (sessionError || !session) return NextResponse.json({ error: sessionError?.message || "Unable to save assessment." }, { status: 500 });

  if (complete) {
    const mindFitness = Math.round((answers.slice(0, 5).reduce((sum: number, value: number) => sum + value, 0) / 30) * 50);
    const physical = Math.round((answers.slice(5, 10).reduce((sum: number, value: number) => sum + value, 0) / 30) * 50);
    const total = Math.min(100, mindFitness + physical);
    const interpretation = total >= 80 ? "Healthy wellbeing range" : total >= 60 ? "A developing foundation" : "An opportunity to shift earlier";

    const { error: resultError } = await supabase.from("assessment_results").upsert({
      session_id: session.id,
      user_id: user.id,
      template_id: template.id,
      total_score: total,
      category_scores: { mind_fitness: mindFitness, physical_wellbeing: physical },
      benchmark: 80,
      interpretation,
    }, { onConflict: "session_id" });

    if (resultError) return NextResponse.json({ error: resultError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, sessionId: session.id });
}
