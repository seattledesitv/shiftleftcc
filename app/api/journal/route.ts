import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  try {
    const payload = await request.json();
    const title = String(payload.title || "").trim().slice(0, 120);
    const body = String(payload.content || "").trim().slice(0, 8000);
    const mood = Number(payload.mood || 0);
    const tags = Array.isArray(payload.tags)
      ? payload.tags.map((tag: unknown) => String(tag).trim().slice(0, 40)).filter(Boolean).slice(0, 8)
      : [];

    if (!body) return NextResponse.json({ error: "Write a reflection before saving." }, { status: 400 });
    if (mood && (!Number.isInteger(mood) || mood < 1 || mood > 5)) return NextResponse.json({ error: "Select a valid mood." }, { status: 400 });

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      title: title || null,
      body,
      mood: mood || null,
      tags,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to save your journal entry." }, { status: 500 });
  }
}
