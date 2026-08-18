import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function escapeHtml(value:string){return value.replace(/[&<>'\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]||c));}

async function sendFreeTicketEmail(order:any,event:any,ticketType:any,codes:string[]){
  const apiKey=process.env.RESEND_API_KEY?.trim(); const from=process.env.RESEND_FROM_EMAIL?.trim(); if(!apiKey||!from)return;
  const resend=new Resend(apiKey); const adminEmail=process.env.DISCOVERY_CALL_TO_EMAIL?.trim()||process.env.ADMIN_EMAIL?.trim();
  const date=new Date(event.starts_at).toLocaleString("en-US",{dateStyle:"full",timeStyle:"short",timeZone:event.timezone||"America/Los_Angeles"});
  const ticketList=codes.map(c=>`<li style="margin:6px 0"><strong>${escapeHtml(c)}</strong> · ${escapeHtml(ticketType.name)}</li>`).join("");
  const result=await resend.emails.send({from,to:[order.customer_email],subject:`Your ticket${codes.length>1?"s":""} · ${event.title}`,html:`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#112b55"><h1>You’re registered.</h1><p>Hi ${escapeHtml(order.customer_name)},</p><p>Your registration for <strong>${escapeHtml(event.title)}</strong> is confirmed.</p><p><strong>${escapeHtml(date)}</strong></p>${event.venue_name?`<p><strong>Venue:</strong> ${escapeHtml(event.venue_name)}${event.venue_address?`<br/>${escapeHtml(event.venue_address)}`:""}</p>`:""}<h3>Your ticket${codes.length>1?"s":""}</h3><ul>${ticketList}</ul>${event.confirmation_message?`<p>${escapeHtml(event.confirmation_message)}</p>`:""}<p>Order reference: <strong>${escapeHtml(order.id)}</strong></p></div>`});
  if(adminEmail) await resend.emails.send({from,to:[adminEmail],subject:`New event registration · ${event.title}`,html:`<h2>New event registration</h2><p><strong>${escapeHtml(event.title)}</strong></p><p>${escapeHtml(order.customer_name)} · ${escapeHtml(order.customer_email)}</p><p>${codes.length} × ${escapeHtml(ticketType.name)}</p>`});
  return (result as any)?.data?.id || null;
}

export async function POST(request:Request){
  const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!supabaseUrl||!serviceKey) return NextResponse.json({error:"Registration is not configured."},{status:503});
  const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false}});
  let body:any; try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
  const eventId=String(body.eventId||""); const ticketTypeId=String(body.ticketTypeId||""); const name=String(body.name||"").trim(); const email=String(body.email||"").trim().toLowerCase(); const phone=String(body.phone||"").trim()||null; const quantity=Math.max(1,Math.floor(Number(body.quantity||1)));
  if(!eventId||!ticketTypeId||!name||!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:"Please provide a valid name, email and ticket selection."},{status:400});

  const [{data:event},{data:ticketType}] = await Promise.all([
    admin.from("events").select("*").eq("id",eventId).eq("status","published").maybeSingle(),
    admin.from("event_ticket_types").select("*").eq("id",ticketTypeId).eq("event_id",eventId).eq("is_active",true).maybeSingle(),
  ]);
  if(!event||!ticketType) return NextResponse.json({error:"This event or ticket is unavailable."},{status:404});
  const now=Date.now();
  if(event.registration_opens_at && now < new Date(event.registration_opens_at).getTime()) return NextResponse.json({error:"Registration has not opened yet."},{status:409});
  if(event.registration_closes_at && now > new Date(event.registration_closes_at).getTime()) return NextResponse.json({error:"Registration is closed."},{status:409});
  if(quantity > ticketType.max_per_order) return NextResponse.json({error:`Maximum ${ticketType.max_per_order} tickets per order.`},{status:400});

  const {count:eventIssued}=await admin.from("event_tickets").select("id",{count:"exact",head:true}).eq("event_id",eventId).in("status",["valid","used"]);
  if(event.capacity!=null && (eventIssued||0)+quantity>event.capacity) return NextResponse.json({error:"Not enough event capacity remains for this quantity."},{status:409});
  if(ticketType.quantity_available!=null){
    const {count:typeIssued}=await admin.from("event_tickets").select("id",{count:"exact",head:true}).eq("ticket_type_id",ticketTypeId).in("status",["valid","used"]);
    if((typeIssued||0)+quantity>ticketType.quantity_available) return NextResponse.json({error:"Not enough tickets remain for this ticket type."},{status:409});
  }

  const subtotal=ticketType.price_amount*quantity; const free=subtotal===0;
  const {data:order,error:orderError}=await admin.from("event_orders").insert({event_id:eventId,customer_name:name,customer_email:email,customer_phone:phone,subtotal_amount:subtotal,total_amount:subtotal,currency:ticketType.currency||"usd",payment_status:free?"not_required":"pending",order_status:free?"confirmed":"pending",confirmed_at:free?new Date().toISOString():null}).select("*").single();
  if(orderError||!order) return NextResponse.json({error:orderError?.message||"Could not create registration."},{status:500});
  const {error:itemError}=await admin.from("event_order_items").insert({order_id:order.id,ticket_type_id:ticketTypeId,quantity,unit_price:ticketType.price_amount,line_total:subtotal});
  if(itemError) return NextResponse.json({error:itemError.message},{status:500});

  if(free){
    const rows=Array.from({length:quantity},()=>({event_id:eventId,order_id:order.id,ticket_type_id:ticketTypeId,attendee_name:name,attendee_email:email,status:"valid"}));
    const {data:tickets,error:ticketError}=await admin.from("event_tickets").insert(rows).select("ticket_code");
    if(ticketError) return NextResponse.json({error:ticketError.message},{status:500});
    const codes=(tickets||[]).map(t=>t.ticket_code);
    try{const providerId=await sendFreeTicketEmail(order,event,ticketType,codes); await admin.from("event_email_log").insert({event_id:eventId,order_id:order.id,recipient_email:email,email_type:"registration_confirmation",provider_message_id:providerId,status:"sent"});}catch(err){console.error("event-ticket-email-failed",err); await admin.from("event_email_log").insert({event_id:eventId,order_id:order.id,recipient_email:email,email_type:"registration_confirmation",status:"failed",error_message:err instanceof Error?err.message:"Unknown email error"});}
    return NextResponse.json({ok:true,orderId:order.id,ticketCodes:codes});
  }

  const stripeKey=process.env.STRIPE_SECRET_KEY; if(!stripeKey) return NextResponse.json({error:"Paid event checkout is not configured."},{status:503});
  const stripe=new Stripe(stripeKey); const origin=new URL(request.url).origin;
  try{
    const session=await stripe.checkout.sessions.create({mode:"payment",customer_email:email,line_items:[{quantity,price_data:{currency:ticketType.currency||"usd",unit_amount:ticketType.price_amount,product_data:{name:`${event.title} · ${ticketType.name}`,description:ticketType.description||undefined}}}],success_url:`${origin}/events/${event.slug}?payment=success&order=${order.id}`,cancel_url:`${origin}/events/${event.slug}?payment=cancelled`,metadata:{eventOrderId:order.id,eventId:event.id,ticketTypeId,quantity:String(quantity)}});
    await admin.from("event_orders").update({stripe_checkout_session_id:session.id,updated_at:new Date().toISOString()}).eq("id",order.id);
    return NextResponse.json({ok:true,orderId:order.id,checkoutUrl:session.url});
  }catch(err){await admin.from("event_orders").update({payment_status:"failed",order_status:"cancelled"}).eq("id",order.id); return NextResponse.json({error:err instanceof Error?err.message:"Could not start payment."},{status:500});}
}
