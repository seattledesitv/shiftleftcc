import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const allowedMoods = new Set(["Great", "Good", "Okay", "Low", "Difficult"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  try {
    const body = await request.json();
    const title = String(body.title || "").trim().slice(0, 120);
    const content = String(body.content || "").trim().slice(0, 8000);
    const mood = String(body.mood || "").trim();
    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag: unknown) => String(tag).trim().slice(0, 40)).filter(Boolean).slice(0, 8)
      : [];

    if (!content) return NextResponse.json({ error: "Write a reflection before saving." }, { status: 400 });
    if (mood && !allowedMoods.has(mood)) return NextResponse.json({ error: "Select a valid mood." }, { status: 400 });

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: title || null,
      content,
      mood: mood || null,
      tags,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to save your journal entry." }, { status: 500 });
  }
}
