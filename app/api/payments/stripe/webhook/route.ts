import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function money(cents: number | null | undefined) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '\"': "&quot;" }[character] || character));
}

async function sendOrderEmails(order: Record<string, any>) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const adminEmail = process.env.DISCOVERY_CALL_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from) return;

  const resend = new Resend(apiKey);
  const customerEmail = String(order.customer_email || "").trim();
  const customerName = String(order.customer_name || order.shipping_name || "Reader").trim();
  const address = order.shipping_address || {};
  const addressLines = [address.line1, address.line2, address.city, address.state, address.postal_code].filter(Boolean).map((value: unknown) => escapeHtml(String(value)));
  const orderId = String(order.id || "");
  const total = money(order.total_amount);

  if (customerEmail) {
    await resend.emails.send({
      from,
      to: [customerEmail],
      subject: "Your Shift Left book order is confirmed",
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#112b55"><h1>Thank you for your order.</h1><p>Hi ${escapeHtml(customerName)},</p><p>Your order for <strong>Ego and Empathy</strong> has been received and payment is confirmed.</p><table style="width:100%;border-collapse:collapse;margin:24px 0"><tr><td>Quantity</td><td style="text-align:right"><strong>${order.quantity}</strong></td></tr><tr><td>Book subtotal</td><td style="text-align:right"><strong>${money((order.unit_amount || 0) * (order.quantity || 1))}</strong></td></tr><tr><td>Shipping</td><td style="text-align:right"><strong>${money(order.shipping_amount)}</strong></td></tr><tr><td>Total</td><td style="text-align:right"><strong>${total}</strong></td></tr></table><p><strong>Ship to</strong><br/>${addressLines.join("<br/>")}</p><p>Order reference: <strong>${escapeHtml(orderId)}</strong></p><p>We will email you again when the order ships.</p><p>Shift Left Coaching & Consulting</p></div>`,
    });
  }

  if (adminEmail) {
    await resend.emails.send({
      from,
      to: [adminEmail],
      subject: `New book order · ${order.quantity} cop${order.quantity === 1 ? "y" : "ies"}`,
      html: `<h2>New paid book order</h2><p><strong>Order:</strong> ${escapeHtml(orderId)}</p><p><strong>Customer:</strong> ${escapeHtml(customerName)}</p><p><strong>Email:</strong> ${escapeHtml(customerEmail || "Not provided")}</p><p><strong>Quantity:</strong> ${order.quantity}</p><p><strong>Total:</strong> ${total}</p><p><strong>Ship to:</strong><br/>${addressLines.join("<br/>")}</p><p>Open Shift Left Studio → Book Orders to manage fulfillment.</p>`,
    });
  }
}

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
      const paid = session.payment_status === "paid";
      const { data: updatedOrder, error: updateError } = await admin.from("book_orders").update({
        customer_email: session.customer_details?.email || session.customer_email || null,
        customer_name: session.customer_details?.name || null,
        customer_phone: session.customer_details?.phone || null,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        payment_status: paid ? "paid" : "processing",
        tax_amount: session.total_details?.amount_tax || 0,
        total_amount: session.amount_total || 0,
        shipping_name: shipping?.name || session.customer_details?.name || null,
        shipping_address: shipping?.address || session.customer_details?.address || null,
        paid_at: paid ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq("id", orderId).select("*").single();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      if (paid && updatedOrder) {
        try {
          await sendOrderEmails(updatedOrder as Record<string, any>);
        } catch (emailError) {
          console.error("book-order-email-failed", { orderId, message: emailError instanceof Error ? emailError.message : String(emailError) });
        }
      }
    }
  }

  if (["checkout.session.async_payment_failed", "checkout.session.expired"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await admin.from("book_orders").update({ payment_status: event.type === "checkout.session.expired" ? "cancelled" : "failed", updated_at: new Date().toISOString() }).eq("id", orderId);
  }

  return NextResponse.json({ received: true });
}
