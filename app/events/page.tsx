import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("id,slug,title,subtitle,image_url,starts_at,ends_at,event_type,venue_name,status").eq("status","published").gte("starts_at",new Date().toISOString()).order("starts_at");
  return <main>
    <section className="pageHero"><p className="eyebrow">SHIFT LEFT EVENTS</p><h1>Learn, connect and grow.</h1><p className="lead">Workshops, conversations and community experiences from Shift Left Coaching &amp; Consulting.</p></section>
    <section className="contentSection"><div className="cardGrid">
      {(events || []).map(event => <article className="contentCard" key={event.id}>{event.image_url ? <img src={event.image_url} alt="" style={{width:"100%",borderRadius:18,aspectRatio:"16/9",objectFit:"cover"}}/> : null}<p className="eyebrow">{new Date(event.starts_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</p><h2>{event.title}</h2>{event.subtitle && <p>{event.subtitle}</p>}<p>{new Date(event.starts_at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})} · {event.event_type === "online" ? "Online" : event.venue_name || event.event_type.replace("_"," ")}</p><Link className="button" href={`/events/${event.slug}`}>View event &amp; tickets</Link></article>)}
      {!events?.length && <article className="contentCard"><h2>No upcoming events yet.</h2><p>Please check back soon.</p></article>}
    </div></section>
  </main>;
}
