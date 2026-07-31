import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const activityTypes = new Set(["walking", "running", "cycling", "strength", "yoga", "sports", "other"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  try {
    const body = await request.json();
    const activityType = String(body.activityType || "").trim();
    const activityDate = String(body.activityDate || "").trim();
    const durationMinutes = body.durationMinutes === "" || body.durationMinutes == null ? null : Number(body.durationMinutes);
    const steps = body.steps === "" || body.steps == null ? null : Number(body.steps);
    const sleepHours = body.sleepHours === "" || body.sleepHours == null ? null : Number(body.sleepHours);
    const recoveryScore = body.recoveryScore === "" || body.recoveryScore == null ? null : Number(body.recoveryScore);
    const notes = String(body.notes || "").trim().slice(0, 2000);

    if (!activityTypes.has(activityType)) return NextResponse.json({ error: "Select a valid activity type." }, { status: 400 });
    if (!activityDate) return NextResponse.json({ error: "Choose the activity date." }, { status: 400 });
    if (durationMinutes != null && (!Number.isFinite(durationMinutes) || durationMinutes < 0 || durationMinutes > 1440)) return NextResponse.json({ error: "Enter a valid duration." }, { status: 400 });
    if (steps != null && (!Number.isFinite(steps) || steps < 0)) return NextResponse.json({ error: "Enter a valid step count." }, { status: 400 });
    if (sleepHours != null && (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24)) return NextResponse.json({ error: "Enter valid sleep hours." }, { status: 400 });
    if (recoveryScore != null && ![1,2,3,4,5].includes(recoveryScore)) return NextResponse.json({ error: "Select a recovery score from 1 to 5." }, { status: 400 });

    const { error } = await supabase.from("activity_entries").insert({
      user_id: user.id,
      activity_date: activityDate,
      activity_type: activityType,
      duration_minutes: durationMinutes,
      steps,
      sleep_hours: sleepHours,
      recovery_score: recoveryScore,
      notes: notes || null,
      source: "manual",
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to save this activity entry." }, { status: 500 });
  }
}
