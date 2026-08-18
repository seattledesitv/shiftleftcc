import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function money(cents: number | null | undefined) { return `$${((cents || 0) / 100).toFixed(2)}`; }
function escapeHtml(value: string) { return value.replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c] || c)); }

async function sendBookOrderEmails(order: Record<string, any>) {
  const apiKey = process.env.RESEND_API_KEY?.trim(); const from = process.env.RESEND_FROM_EMAIL?.trim(); const adminEmail = process.env.DISCOVERY_CALL_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from) return; const resend = new Resend(apiKey);
  const customerEmail = String(order.customer_email || "").trim(); const customerName = String(order.customer_name || order.shipping_name || "Reader").trim();
  const address = order.shipping_address || {}; const addressLines = [address.line1,address.line2,address.city,address.state,address.postal_code].filter(Boolean).map((v:unknown)=>escapeHtml(String(v)));
  const title = String(order.product_name || "your book");
  if (customerEmail) await resend.emails.send({ from, to:[customerEmail], subject:`Your Shift Left order is confirmed · ${title}`, html:`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#112b55"><h1>Thank you for your order.</h1><p>Hi ${escapeHtml(customerName)},</p><p>Your order for <strong>${escapeHtml(title)}</strong> has been received and payment is confirmed.</p><p><strong>Total:</strong> ${money(order.total_amount)}</p><p><strong>Ship to</strong><br/>${addressLines.join("<br/>")}</p><p>Order reference: <strong>${escapeHtml(String(order.id))}</strong></p><p>We will email you again when the order ships.</p></div>` });
  if (adminEmail) await resend.emails.send({ from, to:[adminEmail], subject:`New book order · ${title}`, html:`<h2>New paid book order</h2><p><strong>${escapeHtml(title)}</strong></p><p>Customer: ${escapeHtml(customerName)} · ${escapeHtml(customerEmail || "No email")}</p><p>Total: ${money(order.total_amount)}</p><p>Open Studio → Book Orders to manage fulfillment.</p>` });
}

async function sendCommerceEmails(order: Record<string, any>, product: Record<string, any> | null) {
  const apiKey = process.env.RESEND_API_KEY?.trim(); const from = process.env.RESEND_FROM_EMAIL?.trim(); const adminEmail = process.env.DISCOVERY_CALL_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from) return; const resend = new Resend(apiKey);
  const customerEmail = String(order.customer_email || "").trim(); const customerName = String(order.customer_name || "there").trim();
  const nextStep = product?.scheduling_url ? `<p><a href="${escapeHtml(String(product.scheduling_url))}" style="display:inline-block;padding:12px 18px;background:#178c46;color:white;text-decoration:none;border-radius:999px">Schedule your session</a></p>` : `<p>We will follow up with scheduling and next steps.</p>`;
  if (customerEmail) await resend.emails.send({ from, to:[customerEmail], subject:`Confirmed · ${order.product_name}`, html:`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#112b55"><h1>Your Shift Left program is confirmed.</h1><p>Hi ${escapeHtml(customerName)},</p><p>Payment for <strong>${escapeHtml(String(order.product_name))}</strong> is confirmed.</p><p><strong>Total:</strong> ${money(order.total_amount)}</p>${product?.success_message ? `<p>${escapeHtml(String(product.success_message))}</p>` : ""}${nextStep}<p>Order reference: <strong>${escapeHtml(String(order.id))}</strong></p></div>` });
  if (adminEmail) await resend.emails.send({ from, to:[adminEmail], subject:`New program purchase · ${order.product_name}`, html:`<h2>New paid program purchase</h2><p><strong>${escapeHtml(String(order.product_name))}</strong></p><p>Customer: ${escapeHtml(String(order.customer_name || "Not provided"))}</p><p>Email: ${escapeHtml(customerEmail || "Not provided")}</p><p>Total: ${money(order.total_amount)}</p><p>Open Studio → Commerce to manage the offering.</p>` });
}

async function sendEventTicketEmails(order: Record<string, any>, eventRecord: Record<string, any>, ticketType: Record<string, any>, codes: string[]) {
  const apiKey = process.env.RESEND_API_KEY?.trim(); const from = process.env.RESEND_FROM_EMAIL?.trim(); const adminEmail = process.env.DISCOVERY_CALL_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !from) return null; const resend = new Resend(apiKey);
  const customerEmail = String(order.customer_email || "").trim(); const customerName = String(order.customer_name || "Guest").trim();
  const date = new Date(eventRecord.starts_at).toLocaleString("en-US", { dateStyle:"full", timeStyle:"short", timeZone:eventRecord.timezone || "America/Los_Angeles" });
  const ticketList = codes.map(code => `<li style="margin:6px 0"><strong>${escapeHtml(code)}</strong> · ${escapeHtml(String(ticketType.name))}</li>`).join("");
  let providerId:string|null = null;
  if (customerEmail) {
    const result = await resend.emails.send({ from, to:[customerEmail], subject:`Your ticket${codes.length>1?"s":""} · ${eventRecord.title}`, html:`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#112b55"><h1>Your event registration is confirmed.</h1><p>Hi ${escapeHtml(customerName)},</p><p>Payment for <strong>${escapeHtml(String(eventRecord.title))}</strong> is confirmed.</p><p><strong>${escapeHtml(date)}</strong></p>${eventRecord.venue_name ? `<p><strong>Venue:</strong> ${escapeHtml(String(eventRecord.venue_name))}${eventRecord.venue_address ? `<br/>${escapeHtml(String(eventRecord.venue_address))}` : ""}</p>` : ""}<p><strong>Total:</strong> ${money(order.total_amount)}</p><h3>Your ticket${codes.length>1?"s":""}</h3><ul>${ticketList}</ul>${eventRecord.confirmation_message ? `<p>${escapeHtml(String(eventRecord.confirmation_message))}</p>` : ""}<p>Order reference: <strong>${escapeHtml(String(order.id))}</strong></p></div>` });
    providerId = (result as any)?.data?.id || null;
  }
  if (adminEmail) await resend.emails.send({ from, to:[adminEmail], subject:`New paid event registration · ${eventRecord.title}`, html:`<h2>New paid event registration</h2><p><strong>${escapeHtml(String(eventRecord.title))}</strong></p><p>${escapeHtml(customerName)} · ${escapeHtml(customerEmail || "No email")}</p><p>${codes.length} × ${escapeHtml(String(ticketType.name))}</p><p>Total: ${money(order.total_amount)}</p><p>Open Studio → Events to review registrations.</p>` });
  return providerId;
}

async function fulfillEventOrder(admin:any, session:Stripe.Checkout.Session, orderId:string) {
  const paid = session.payment_status === "paid";
  const { data:order, error:updateError } = await admin.from("event_orders").update({
    customer_email:session.customer_details?.email || session.customer_email || undefined,
    customer_name:session.customer_details?.name || undefined,
    customer_phone:session.customer_details?.phone || undefined,
    stripe_payment_intent_id:typeof session.payment_intent === "string" ? session.payment_intent : null,
    payment_status:paid ? "paid" : "processing",
    order_status:paid ? "confirmed" : "pending",
    tax_amount:session.total_details?.amount_tax || 0,
    total_amount:session.amount_total || 0,
    paid_at:paid ? new Date().toISOString() : null,
    confirmed_at:paid ? new Date().toISOString() : null,
    updated_at:new Date().toISOString(),
  }).eq("id",orderId).select("*").single();
  if (updateError) throw updateError;
  if (!paid || !order) return;

  const { data:existing } = await admin.from("event_tickets").select("ticket_code").eq("order_id",orderId);
  if (existing?.length) return;

  const { data:item } = await admin.from("event_order_items").select("ticket_type_id,quantity").eq("order_id",orderId).single();
  if (!item) throw new Error("Event order item not found.");
  const [{data:eventRecord},{data:ticketType}] = await Promise.all([
    admin.from("events").select("*").eq("id",order.event_id).single(),
    admin.from("event_ticket_types").select("*").eq("id",item.ticket_type_id).single(),
  ]);
  if (!eventRecord || !ticketType) throw new Error("Event or ticket type not found.");
  const rows = Array.from({length:item.quantity},()=>({event_id:order.event_id,order_id:orderId,ticket_type_id:item.ticket_type_id,attendee_name:order.customer_name,attendee_email:order.customer_email,status:"valid"}));
  const { data:tickets, error:ticketError } = await admin.from("event_tickets").insert(rows).select("ticket_code");
  if (ticketError) throw ticketError;
  const codes = (tickets || []).map((t:any)=>t.ticket_code);
  try {
    const providerId = await sendEventTicketEmails(order,eventRecord,ticketType,codes);
    await admin.from("event_email_log").insert({event_id:order.event_id,order_id:order.id,recipient_email:order.customer_email,email_type:"registration_confirmation",provider_message_id:providerId,status:"sent"});
  } catch (error) {
    console.error("event-order-email-failed",error);
    await admin.from("event_email_log").insert({event_id:order.event_id,order_id:order.id,recipient_email:order.customer_email,email_type:"registration_confirmation",status:"failed",error_message:error instanceof Error?error.message:"Unknown email error"});
  }
}

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY; const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceKey) return NextResponse.json({error:"Webhook is not configured."},{status:503});
  const signature = request.headers.get("stripe-signature"); if (!signature) return NextResponse.json({error:"Missing Stripe signature."},{status:400});
  const rawBody = await request.text(); const stripe = new Stripe(stripeKey); let event:Stripe.Event;
  try { event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret); } catch (error) { return NextResponse.json({error:error instanceof Error ? error.message : "Invalid signature."},{status:400}); }
  const admin = createClient(supabaseUrl, serviceKey, {auth:{persistSession:false}});
  const { error:eventError } = await admin.from("payment_webhook_events").insert({provider:"stripe",provider_event_id:event.id,event_type:event.type,payload:event as unknown as Record<string,unknown>});
  if (eventError?.code === "23505") return NextResponse.json({received:true}); if (eventError) return NextResponse.json({error:eventError.message},{status:500});

  if (["checkout.session.completed","checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session; const paid = session.payment_status === "paid";
    const eventOrderId = session.metadata?.eventOrderId;
    const commerceOrderId = session.metadata?.commerceOrderId;
    if (eventOrderId) {
      try { await fulfillEventOrder(admin,session,eventOrderId); } catch(error) { console.error("event-order-fulfillment-failed",error); return NextResponse.json({error:error instanceof Error?error.message:"Event fulfillment failed."},{status:500}); }
    } else if (commerceOrderId) {
      const { data:updatedOrder, error:updateError } = await admin.from("commerce_orders").update({ customer_email:session.customer_details?.email || session.customer_email || null, customer_name:session.customer_details?.name || null, customer_phone:session.customer_details?.phone || null, stripe_payment_intent_id:typeof session.payment_intent === "string" ? session.payment_intent : null, payment_status:paid ? "paid" : "processing", tax_amount:session.total_details?.amount_tax || 0, total_amount:session.amount_total || 0, paid_at:paid ? new Date().toISOString() : null, updated_at:new Date().toISOString() }).eq("id",commerceOrderId).select("*").single();
      if (updateError) return NextResponse.json({error:updateError.message},{status:500});
      if (paid && updatedOrder) { const { data:product } = await admin.from("commerce_products").select("success_message,scheduling_url").eq("id",updatedOrder.product_id).maybeSingle(); try { await sendCommerceEmails(updatedOrder, product); } catch(e){ console.error("commerce-order-email-failed",e); } }
    } else {
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const shipping = (session as Stripe.Checkout.Session & {shipping_details?:{name?:string|null;address?:unknown}}).shipping_details;
        const { data:updatedOrder, error:updateError } = await admin.from("book_orders").update({ customer_email:session.customer_details?.email || session.customer_email || null, customer_name:session.customer_details?.name || null, customer_phone:session.customer_details?.phone || null, stripe_payment_intent_id:typeof session.payment_intent === "string" ? session.payment_intent : null, payment_status:paid ? "paid" : "processing", tax_amount:session.total_details?.amount_tax || 0, total_amount:session.amount_total || 0, shipping_name:shipping?.name || session.customer_details?.name || null, shipping_address:shipping?.address || session.customer_details?.address || null, paid_at:paid ? new Date().toISOString() : null, updated_at:new Date().toISOString() }).eq("id",orderId).select("*").single();
        if (updateError) return NextResponse.json({error:updateError.message},{status:500}); if (paid && updatedOrder) try { await sendBookOrderEmails(updatedOrder); } catch(e){ console.error("book-order-email-failed",e); }
      }
    }
  }

  if (["checkout.session.async_payment_failed","checkout.session.expired"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session; const status = event.type === "checkout.session.expired" ? "cancelled" : "failed";
    if (session.metadata?.eventOrderId) await admin.from("event_orders").update({payment_status:status,order_status:"cancelled",updated_at:new Date().toISOString()}).eq("id",session.metadata.eventOrderId);
    else if (session.metadata?.commerceOrderId) await admin.from("commerce_orders").update({payment_status:status,updated_at:new Date().toISOString()}).eq("id",session.metadata.commerceOrderId);
    else if (session.metadata?.orderId) await admin.from("book_orders").update({payment_status:status,updated_at:new Date().toISOString()}).eq("id",session.metadata.orderId);
  }
  return NextResponse.json({received:true});
}
