import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeKey || !supabaseUrl || !serviceKey) return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug || "").trim();
  const quantity = Math.max(1, Math.min(20, Number(body.quantity) || 1));
  if (!slug) return NextResponse.json({ error: "Product is required." }, { status: 400 });

  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: product, error: productError } = await admin.from("commerce_products").select("*").eq("slug", slug).eq("status", "active").single();
  if (productError || !product) return NextResponse.json({ error: "This offering is not available." }, { status: 404 });
  if (!product.purchase_enabled || product.pricing_mode !== "fixed" || !product.price_amount || product.price_amount <= 0) return NextResponse.json({ error: "Direct purchase is not enabled for this offering yet." }, { status: 409 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const total = product.price_amount * quantity + (product.shipping_amount || 0);
  const { data: order, error: orderError } = await admin.from("commerce_orders").insert({
    user_id: user?.id || null,
    product_id: product.id,
    product_slug: product.slug,
    product_name: product.title,
    product_type: product.product_type,
    fulfillment_type: product.fulfillment_type,
    customer_email: user?.email || null,
    quantity,
    unit_amount: product.price_amount,
    shipping_amount: product.shipping_amount || 0,
    total_amount: total,
    currency: product.currency || "usd",
  }).select("id").single();
  if (orderError || !order) return NextResponse.json({ error: orderError?.message || "Unable to create order." }, { status: 500 });

  const origin = new URL(request.url).origin;
  const stripe = new Stripe(stripeKey);
  const sessionOptions: Stripe.Checkout.SessionCreateParams = {
    ui_mode: "embedded",
    mode: "payment",
    return_url: `${origin}/order/program-success?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: user?.email || undefined,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
    line_items: [{
      quantity,
      price_data: {
        currency: product.currency || "usd",
        unit_amount: product.price_amount,
        product_data: { name: product.title, description: product.duration_label || product.subtitle || undefined },
      },
    }],
    metadata: { commerceOrderId: order.id, productSlug: product.slug, fulfillmentType: product.fulfillment_type },
  };

  if (product.fulfillment_type === "shipping") {
    sessionOptions.shipping_address_collection = { allowed_countries: ["US"] };
    if ((product.shipping_amount || 0) > 0) sessionOptions.shipping_options = [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: product.shipping_amount, currency: product.currency || "usd" }, display_name: "Standard U.S. shipping" } }];
  }

  const session = await stripe.checkout.sessions.create(sessionOptions);
  if (!session.client_secret) return NextResponse.json({ error: "Unable to initialize secure checkout." }, { status: 500 });
  await admin.from("commerce_orders").update({ stripe_checkout_session_id: session.id }).eq("id", order.id);
  return NextResponse.json({ clientSecret: session.client_secret, product: { title: product.title, priceAmount: product.price_amount, shippingAmount: product.shipping_amount || 0 } });
}
