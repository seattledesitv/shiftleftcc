import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../lib/supabase/server";

function modeFromKey(key?: string) {
  if (!key) return "missing";
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  return "unknown";
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  let orderId: string | null = null;

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!stripeKey || !supabaseUrl || !serviceKey) {
      console.error("stripe-checkout-config-missing", { requestId, stripeKey: Boolean(stripeKey), supabaseUrl: Boolean(supabaseUrl), serviceKey: Boolean(serviceKey) });
      return NextResponse.json({ error: "Checkout is not configured yet.", requestId, diagnostics: { stripeSecretMode: modeFromKey(stripeKey), supabaseUrlConfigured: Boolean(supabaseUrl), serviceRoleConfigured: Boolean(serviceKey) } }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const quantity = Math.max(1, Math.min(20, Number(body.quantity) || 1));
    const bookSlug = String(body.bookSlug || "ego-and-empathy").trim();
    const origin = new URL(request.url).origin;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: book, error: bookError } = await admin.from("books").select("id,slug,title,subtitle,description,price_amount,shipping_amount,currency,status,inventory_mode,inventory_count").eq("slug", bookSlug).maybeSingle();
    if (bookError) throw new Error(bookError.message);
    if (!book || book.status !== "active") return NextResponse.json({ error: "This book is not currently available for direct purchase.", requestId }, { status: 404 });
    if (book.inventory_mode === "tracked" && (book.inventory_count || 0) < quantity) return NextResponse.json({ error: "The requested quantity is not currently available.", requestId }, { status: 409 });

    const unitAmount = Number(book.price_amount);
    const shippingAmount = Number(book.shipping_amount);
    const total = unitAmount * quantity + shippingAmount;
    const productName = `${book.title} — Regular Paperback`;

    const { data: order, error: orderError } = await admin.from("book_orders").insert({
      user_id: user?.id || null,
      book_id: book.id,
      product_slug: book.slug,
      product_name: productName,
      customer_email: user?.email || null,
      quantity,
      unit_amount: unitAmount,
      shipping_amount: shippingAmount,
      total_amount: total,
      currency: book.currency || "usd",
    }).select("id").single();
    if (orderError || !order) throw new Error(orderError?.message || "Unable to create order.");
    orderId = order.id;

    const stripe = new Stripe(stripeKey);
    const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === "true";
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      return_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: user?.email || undefined,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: shippingAmount, currency: book.currency || "usd" }, display_name: "Standard U.S. shipping", delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 8 } } } }],
      automatic_tax: { enabled: automaticTax },
      line_items: [{ quantity, price_data: { currency: book.currency || "usd", unit_amount: unitAmount, product_data: { name: productName, description: book.subtitle || book.description || "Regular paperback by Bharath Kumar Arekapudi" } } }],
      metadata: { orderId: order.id, bookId: book.id, productSlug: book.slug, requestId },
    });

    if (!session.client_secret) throw new Error("Stripe created a session without an embedded checkout client secret.");

    await admin.from("book_orders").update({ stripe_checkout_session_id: session.id }).eq("id", order.id);
    console.info("stripe-checkout-session-created", { requestId, orderId: order.id, sessionId: session.id, stripeMode: modeFromKey(stripeKey), bookSlug: book.slug, automaticTax, quantity });

    return NextResponse.json({ clientSecret: session.client_secret, requestId, diagnostics: { stripeSecretMode: modeFromKey(stripeKey), supabaseUrlConfigured: true, serviceRoleConfigured: true, sessionMode: session.livemode ? "live" : "test", sessionId: session.id, orderId: order.id } });
  } catch (error) {
    const stripeError = error as Stripe.errors.StripeError;
    console.error("stripe-checkout-failed", { requestId, orderId, name: error instanceof Error ? error.name : "UnknownError", message: error instanceof Error ? error.message : String(error), stripeType: stripeError?.type, stripeCode: stripeError?.code, stripeRequestId: stripeError?.requestId, statusCode: stripeError?.statusCode });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start checkout.", requestId, diagnostics: { stripeSecretMode: modeFromKey(process.env.STRIPE_SECRET_KEY), supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), stripeType: stripeError?.type || null, stripeCode: stripeError?.code || null, stripeRequestId: stripeError?.requestId || null } }, { status: 500 });
  }
}
