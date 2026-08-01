import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json();
  const goalId = String(body.goalId || "").trim();
  const title = String(body.title || "").trim().slice(0, 180);
  const plannedDate = String(body.plannedDate || "").trim() || null;
  const nextStep = String(body.nextStep || "").trim().slice(0, 1500) || null;

  if (!goalId || !title) return NextResponse.json({ error: "Goal and checkpoint title are required." }, { status: 400 });

  const { data: goal } = await supabase.from("member_goals").select("id").eq("id", goalId).eq("user_id", user.id).maybeSingle();
  if (!goal) return NextResponse.json({ error: "Goal not found." }, { status: 404 });

  const { count } = await supabase.from("goal_checkpoints").select("id", { count: "exact", head: true }).eq("goal_id", goalId);
  const { error } = await supabase.from("goal_checkpoints").insert({
    goal_id: goalId,
    user_id: user.id,
    title,
    planned_date: plannedDate,
    next_step: nextStep,
    display_order: count || 0,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
