import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import RegisterForm from "./RegisterForm";

export default async function EventPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ payment?: string; order?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: event } = await supabase.from("events").select("*").eq("slug",slug).eq("status","published").maybeSingle();
  if (!event) notFound();
  const { data: ticketTypes } = await supabase.from("event_ticket_types").select("id,name,description,price_amount,quantity_available,max_per_order,is_active,display_order").eq("event_id",event.id).eq("is_active",true).order("display_order");
  const paymentSuccess = query.payment === "success";
  const paymentCancelled = query.payment === "cancelled";

  return <main>
    <section className="pageHero"><p className="eyebrow">SHIFT LEFT EVENT</p><h1>{event.title}</h1>{event.subtitle && <p className="lead">{event.subtitle}</p>}</section>
    <section className="contentSection">
      {paymentSuccess && <article className="contentCard" style={{marginBottom:24,border:"1px solid rgba(47,143,45,.25)",background:"rgba(47,143,45,.06)"}}><p className="eyebrow">REGISTRATION CONFIRMED</p><h2>Thank you for buying your ticket.</h2>{user ? <p>Your ticket will also be emailed to you, and you can view it anytime in <Link href="/my-tickets"><strong>My Tickets</strong></Link>.</p> : <p>A confirmation email with your ticket has been sent to the email address used during registration.</p>}</article>}
      {paymentCancelled && <article className="contentCard" style={{marginBottom:24}}><h2>Payment was not completed.</h2><p>Your ticket has not been confirmed. You can try again below.</p></article>}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.25fr) minmax(320px,.75fr)",gap:28,alignItems:"start"}}>
      <div>{event.image_url && <img src={event.image_url} alt="" style={{width:"100%",borderRadius:24,marginBottom:24}}/>}<article className="contentCard"><h2>Event details</h2><p><strong>Date:</strong> {new Date(event.starts_at).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p><p><strong>Time:</strong> {new Date(event.starts_at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}{event.ends_at?` – ${new Date(event.ends_at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}`:""}</p><p><strong>Format:</strong> {event.event_type.replace("_"," ")}</p>{event.venue_name && <p><strong>Venue:</strong> {event.venue_name}</p>}{event.venue_address && <p>{event.venue_address}</p>}{event.description && <div style={{whiteSpace:"pre-wrap"}}>{event.description}</div>}</article></div>
      <RegisterForm eventId={event.id} ticketTypes={(ticketTypes || []) as any} isAuthenticated={Boolean(user)}/>
    </div></section>
  </main>;
}
