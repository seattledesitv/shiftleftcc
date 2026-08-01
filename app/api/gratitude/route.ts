import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json();
  const entryDate = String(body.entryDate || "").trim() || new Date().toISOString().slice(0, 10);
  const gratitudeOne = String(body.gratitudeOne || "").trim().slice(0, 1000);
  const gratitudeTwo = String(body.gratitudeTwo || "").trim().slice(0, 1000) || null;
  const gratitudeThree = String(body.gratitudeThree || "").trim().slice(0, 1000) || null;
  const highlight = String(body.highlight || "").trim().slice(0, 1500) || null;
  const appreciatedPerson = String(body.appreciatedPerson || "").trim().slice(0, 300) || null;

  if (!gratitudeOne) return NextResponse.json({ error: "Add at least one gratitude note." }, { status: 400 });

  const { error } = await supabase.from("gratitude_entries").upsert({
    user_id: user.id,
    entry_date: entryDate,
    gratitude_one: gratitudeOne,
    gratitude_two: gratitudeTwo,
    gratitude_three: gratitudeThree,
    highlight,
    appreciated_person: appreciatedPerson,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,entry_date" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
