import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const themes = new Set(["calm", "bold", "elegant", "nature", "modern", "celebration"]);
const layouts = new Set(["mosaic", "magazine", "polaroid", "focus"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json();
  const action = String(body.action || "item");

  if (action === "item") {
    const title = String(body.title || "").trim().slice(0, 140);
    const affirmation = String(body.affirmation || "").trim().slice(0, 500) || null;
    const imagePrompt = String(body.imagePrompt || "").trim().slice(0, 600) || null;
    const visionId = String(body.visionId || "").trim() || null;
    const lifeAreaId = String(body.lifeAreaId || "").trim() || null;
    if (!title) return NextResponse.json({ error: "Add a vision-board item." }, { status: 400 });

    const { error } = await supabase.from("vision_board_items").insert({
      user_id: user.id,
      title,
      affirmation,
      image_prompt: imagePrompt,
      vision_id: visionId,
      life_area_id: lifeAreaId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "board") {
    const title = String(body.title || "My Vision Board").trim().slice(0, 140) || "My Vision Board";
    const theme = String(body.theme || "calm");
    const layout = String(body.layout || "mosaic");
    const visionId = String(body.visionId || "").trim() || null;
    if (!themes.has(theme) || !layouts.has(layout)) return NextResponse.json({ error: "Choose a valid theme and layout." }, { status: 400 });

    const { data: items, error: itemError } = await supabase
      .from("vision_board_items")
      .select("id,title,affirmation,image_url,image_prompt,life_area_id")
      .eq("user_id", user.id)
      .order("display_order")
      .order("created_at");
    if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 });
    if (!items?.length) return NextResponse.json({ error: "Add at least one vision-board item first." }, { status: 400 });

    const { error } = await supabase.from("vision_boards").insert({
      user_id: user.id,
      vision_id: visionId,
      title,
      theme,
      layout,
      snapshot: items,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
