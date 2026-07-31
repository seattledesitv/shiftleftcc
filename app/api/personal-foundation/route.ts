import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  try {
    const body = await request.json();
    const type = String(body.type || "");

    if (type === "mission") {
      const statement = String(body.statement || "").trim().slice(0, 3000);
      const why = String(body.why_it_matters || "").trim().slice(0, 3000);
      if (!statement) return NextResponse.json({ error: "Add your mission statement." }, { status: 400 });
      const { error } = await supabase.from("member_missions").upsert({ user_id: user.id, statement, why_it_matters: why || null, updated_at: new Date().toISOString() });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (type === "vision") {
      const year = Number(body.year);
      const title = String(body.title || "").trim().slice(0, 160);
      const vision = String(body.vision_statement || "").trim().slice(0, 5000);
      const success = String(body.success_definition || "").trim().slice(0, 4000);
      const why = String(body.why_it_matters || "").trim().slice(0, 4000);
      if (!Number.isInteger(year) || year < 2000 || year > 2200 || !vision) return NextResponse.json({ error: "Enter a valid year and vision statement." }, { status: 400 });
      const { error } = await supabase.from("annual_visions").upsert({ user_id: user.id, year, title: title || `${year} Vision`, vision_statement: vision, success_definition: success || null, why_it_matters: why || null, status: "active", updated_at: new Date().toISOString() }, { onConflict: "user_id,year" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported request." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unable to save your personal foundation." }, { status: 500 });
  }
}
