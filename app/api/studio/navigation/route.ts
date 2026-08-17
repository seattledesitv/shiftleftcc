import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: adminUser } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!adminUser) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { error: NextResponse.json({ error: "Admin service is not configured." }, { status: 503 }) };
  return { admin: createAdminClient(url, key, { auth: { persistSession: false } }) };
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const body = await request.json();
  const location = ["header","footer_discover","footer_explore"].includes(body.location) ? body.location : "header";
  const authVisibility = ["public","authenticated","admin"].includes(body.authVisibility) ? body.authVisibility : "public";
  const { data, error } = await auth.admin!.from("navigation_items").insert({
    location,
    label: String(body.label || "New item").trim(),
    href: String(body.href || "/").trim(),
    parent_id: body.parentId || null,
    display_order: Number(body.displayOrder) || 0,
    is_visible: body.isVisible !== false,
    is_cta: Boolean(body.isCta),
    auth_visibility: authVisibility,
    open_new_tab: Boolean(body.openNewTab),
  }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, item: data });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Navigation item id is required." }, { status: 400 });
  const location = ["header","footer_discover","footer_explore"].includes(body.location) ? body.location : "header";
  const authVisibility = ["public","authenticated","admin"].includes(body.authVisibility) ? body.authVisibility : "public";
  const { data, error } = await auth.admin!.from("navigation_items").update({
    location,
    label: String(body.label || "").trim(),
    href: String(body.href || "/").trim(),
    parent_id: body.parentId || null,
    display_order: Number(body.displayOrder) || 0,
    is_visible: Boolean(body.isVisible),
    is_cta: Boolean(body.isCta),
    auth_visibility: authVisibility,
    open_new_tab: Boolean(body.openNewTab),
    updated_at: new Date().toISOString(),
  }).eq("id", body.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Navigation item id is required." }, { status: 400 });
  const { error } = await auth.admin!.from("navigation_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
