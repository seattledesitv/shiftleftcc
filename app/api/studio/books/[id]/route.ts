import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../lib/supabase/server";

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
  const priceAmount = Math.round(Number(body.price) * 100);
  const shippingAmount = Math.round(Number(body.shipping) * 100);
  const status = ["active", "draft", "inactive"].includes(body.status) ? body.status : "draft";
  if (!Number.isFinite(priceAmount) || priceAmount < 0 || !Number.isFinite(shippingAmount) || shippingAmount < 0) return NextResponse.json({ error: "Price and shipping must be valid positive amounts." }, { status: 400 });

  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.from("books").update({
    title: String(body.title || "").trim(),
    subtitle: String(body.subtitle || "").trim() || null,
    description: String(body.description || "").trim() || null,
    price_amount: priceAmount,
    shipping_amount: shippingAmount,
    status,
    featured: Boolean(body.featured),
    display_order: Number(body.displayOrder) || 0,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select("id,slug,title,price_amount,shipping_amount,status,featured,display_order").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, book: data });
}
