import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../lib/supabase/server";

function normalize(value: unknown, type: string) {
  if (type === "boolean") return Boolean(value);
  if (type === "number") {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error("Value must be a valid number.");
    return number;
  }
  if (type === "json") {
    if (typeof value !== "string") return value;
    try { return JSON.parse(value); } catch { throw new Error("Value must be valid JSON."); }
  }
  return String(value ?? "");
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: adminUser } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return NextResponse.json({ error: "Admin service is not configured." }, { status: 503 });

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: current, error: readError } = await admin.from("platform_settings").select("id,value_type").eq("id", id).single();
  if (readError || !current) return NextResponse.json({ error: readError?.message || "Setting not found." }, { status: 404 });

  let normalized: unknown;
  try { normalized = normalize(body.value, current.value_type); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid value." }, { status: 400 }); }

  const { data, error } = await admin.from("platform_settings").update({
    value: normalized,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select("id,category,key,value,value_type,label,description,is_public,display_order,updated_at").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, setting: data });
}
