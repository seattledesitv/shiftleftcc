import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import RegisterForm from "./RegisterForm";

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("slug",slug).eq("status","published").maybeSingle();
  if (!event) notFound();
  const { data: ticketTypes } = await supabase.from("event_ticket_types").select("id,name,description,price_amount,quantity_available,max_per_order,is_active,display_order").eq("event_id",event.id).eq("is_active",true).order("display_order");

  return <main>
    <section className="pageHero"><p className="eyebrow">SHIFT LEFT EVENT</p><h1>{event.title}</h1>{event.subtitle && <p className="lead">{event.subtitle}</p>}</section>
    <section className="contentSection"><div style={{display:"grid",gridTemplateColumns:"minmax(0,1.25fr) minmax(320px,.75fr)",gap:28,alignItems:"start"}}>
      <div>{event.image_url && <img src={event.image_url} alt="" style={{width:"100%",borderRadius:24,marginBottom:24}}/>}<article className="contentCard"><h2>Event details</h2><p><strong>Date:</strong> {new Date(event.starts_at).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p><p><strong>Time:</strong> {new Date(event.starts_at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}{event.ends_at?` – ${new Date(event.ends_at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}`:""}</p><p><strong>Format:</strong> {event.event_type.replace("_"," ")}</p>{event.venue_name && <p><strong>Venue:</strong> {event.venue_name}</p>}{event.venue_address && <p>{event.venue_address}</p>}{event.description && <div style={{whiteSpace:"pre-wrap"}}>{event.description}</div>}</article></div>
      <RegisterForm eventId={event.id} ticketTypes={(ticketTypes || []) as any}/>
    </div></section>
  </main>;
}
