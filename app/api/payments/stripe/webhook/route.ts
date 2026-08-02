import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  const rawBody = await request.text();
  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid signature." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { error: eventError } = await admin.from("payment_webhook_events").insert({
    provider: "stripe",
    provider_event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });
  if (eventError?.code === "23505") return NextResponse.json({ received: true });
  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 500 });

  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const shipping = (session as Stripe.Checkout.Session & { shipping_details?: { name?: string | null; address?: unknown } }).shipping_details;
      await admin.from("book_orders").update({
        customer_email: session.customer_details?.email || session.customer_email || null,
        customer_name: session.customer_details?.name || null,
        customer_phone: session.customer_details?.phone || null,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        payment_status: session.payment_status === "paid" ? "paid" : "processing",
        tax_amount: session.total_details?.amount_tax || 0,
        total_amount: session.amount_total || 0,
        shipping_name: shipping?.name || session.customer_details?.name || null,
        shipping_address: shipping?.address || session.customer_details?.address || null,
        paid_at: session.payment_status === "paid" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq("id", orderId);
    }
  }

  if (["checkout.session.async_payment_failed", "checkout.session.expired"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await admin.from("book_orders").update({ payment_status: event.type === "checkout.session.expired" ? "cancelled" : "failed", updated_at: new Date().toISOString() }).eq("id", orderId);
  }

  return NextResponse.json({ received: true });
}
