import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: adminUser } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: "Admin service is not configured." }, { status: 503 });
  const { id } = await params;
  const body = await request.json();
  const pricingMode = ["fixed","starting_at","custom"].includes(body.pricingMode) ? body.pricingMode : "fixed";
  const price = body.price === "" || body.price === null ? null : Math.round(Number(body.price) * 100);
  if (price !== null && (!Number.isFinite(price) || price < 0)) return NextResponse.json({ error: "Price must be valid." }, { status: 400 });

  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.from("commerce_products").update({
    title: String(body.title || "").trim(),
    subtitle: String(body.subtitle || "").trim() || null,
    description: String(body.description || "").trim() || null,
    duration_label: String(body.durationLabel || "").trim() || null,
    price_amount: price,
    pricing_mode: pricingMode,
    purchase_enabled: pricingMode === "fixed" ? Boolean(body.purchaseEnabled) : false,
    status: ["active","draft","inactive"].includes(body.status) ? body.status : "draft",
    featured: Boolean(body.featured),
    scheduling_url: String(body.schedulingUrl || "").trim() || null,
    display_order: Number(body.displayOrder) || 0,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, product: data });
}
