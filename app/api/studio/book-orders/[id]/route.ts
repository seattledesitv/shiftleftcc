import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "../../../../../lib/supabase/server";

function escapeHtml(value: string) {
  return value.replace(/[&<>'\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '\"': "&quot;" }[character] || character));
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const fulfillmentStatus = String(body.fulfillmentStatus || "").trim();
  const allowed = new Set(["unfulfilled", "preparing", "shipped", "delivered", "cancelled"]);
  if (!allowed.has(fulfillmentStatus)) return NextResponse.json({ error: "Invalid fulfillment status." }, { status: 400 });

  const shippingCarrier = String(body.shippingCarrier || "").trim() || null;
  const trackingNumber = String(body.trackingNumber || "").trim() || null;
  const internalNotes = String(body.internalNotes || "").trim() || null;

  const { data: existing, error: readError } = await supabase.from("book_orders")
    .select("id,customer_email,customer_name,product_name,quantity,fulfillment_status,tracking_number,shipping_carrier")
    .eq("id", id).maybeSingle();
  if (readError || !existing) return NextResponse.json({ error: readError?.message || "Order not found." }, { status: 404 });

  const now = new Date().toISOString();
  const update: Record<string, unknown> = {
    fulfillment_status: fulfillmentStatus,
    shipping_carrier: shippingCarrier,
    tracking_number: trackingNumber,
    internal_notes: internalNotes,
    updated_at: now,
  };
  if (fulfillmentStatus === "shipped" && existing.fulfillment_status !== "shipped") update.shipped_at = now;
  if (fulfillmentStatus === "delivered" && existing.fulfillment_status !== "delivered") update.delivered_at = now;

  const { error: updateError } = await supabase.from("book_orders").update(update).eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  let emailStatus: "not_sent" | "sent" | "failed" = "not_sent";
  let emailError: string | null = null;
  const transitionedToShipped = fulfillmentStatus === "shipped" && existing.fulfillment_status !== "shipped";
  if (transitionedToShipped && existing.customer_email) {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (apiKey && from) {
      const resend = new Resend(apiKey);
      const trackingLine = trackingNumber
        ? `<p><strong>Tracking:</strong> ${escapeHtml(trackingNumber)}${shippingCarrier ? ` (${escapeHtml(shippingCarrier)})` : ""}</p>`
        : "";
      const { error } = await resend.emails.send({
        from,
        to: [existing.customer_email],
        subject: `Your ${existing.product_name} order has shipped`,
        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#12305f"><p style="letter-spacing:.15em;font-size:12px;color:#17826d">SHIFT LEFT ORDER UPDATE</p><h1>Your book is on the way.</h1><p>Hi ${escapeHtml(existing.customer_name || "there")},</p><p>Your order for <strong>${escapeHtml(existing.product_name)}</strong> (Qty ${existing.quantity}) has been marked as shipped.</p>${trackingLine}<p>Thank you for your order.</p><p>Shift Left Coaching &amp; Consulting</p></div>`,
      });
      if (error) { emailStatus = "failed"; emailError = error.message; }
      else emailStatus = "sent";
    } else {
      emailStatus = "failed";
      emailError = "Resend is not configured.";
    }
  }

  return NextResponse.json({ success: true, emailStatus, emailError });
}
