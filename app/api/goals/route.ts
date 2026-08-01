import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const allowedStatuses = new Set(["active", "completed", "paused"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json();
  const title = String(body.title || "").trim().slice(0, 140);
  const category = String(body.category || "Life Goal").trim().slice(0, 50);
  const targetDate = String(body.targetDate || "").trim() || null;
  const notes = String(body.notes || "").trim().slice(0, 2000) || null;
  const whyItMatters = String(body.whyItMatters || "").trim().slice(0, 2500) || null;
  const successDefinition = String(body.successDefinition || "").trim().slice(0, 2500) || null;
  const lifeAreaId = String(body.lifeAreaId || "").trim() || null;
  const visionId = String(body.visionId || "").trim() || null;
  const priority = Math.max(1, Math.min(5, Number(body.priority) || 3));

  if (!title) return NextResponse.json({ error: "Add a goal title." }, { status: 400 });

  const { error } = await supabase.from("member_goals").insert({
    user_id: user.id,
    title,
    category,
    target_date: targetDate,
    notes,
    why_it_matters: whyItMatters,
    success_definition: successDefinition,
    life_area_id: lifeAreaId,
    vision_id: visionId,
    priority,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json();
  const id = String(body.id || "");
  const status = String(body.status || "active");
  const progress = Math.max(0, Math.min(100, Number(body.progress) || 0));
  if (!id || !allowedStatuses.has(status)) return NextResponse.json({ error: "Invalid goal update." }, { status: 400 });

  const { error } = await supabase.from("member_goals").update({ status, progress, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
