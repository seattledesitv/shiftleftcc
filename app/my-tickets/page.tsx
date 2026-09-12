import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../lib/supabase/server";
import "../dashboard.css";

export default async function MyTicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-tickets");
  if (!user.email) return <main><section className="pageHero compactHero"><h1>My Tickets</h1><p className="lead">No account email is available for this profile.</p></section></main>;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return <main><section className="pageHero compactHero"><h1>My Tickets</h1><p className="lead">Ticket history is temporarily unavailable.</p></section></main>;
  const admin = createAdminClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: orders } = await admin.from("event_orders").select("id,event_id,total_amount,payment_status,order_status,created_at").eq("customer_email", user.email.toLowerCase()).order("created_at", { ascending: false });
  const orderIds = (orders || []).map(o => o.id);
  const eventIds = [...new Set((orders || []).map(o => o.event_id))];
  const [{ data: tickets }, { data: events }] = await Promise.all([
    orderIds.length ? admin.from("event_tickets").select("id,order_id,event_id,ticket_type_id,ticket_code,status,checked_in_at,created_at").in("order_id", orderIds) : Promise.resolve({ data: [] as any[] }),
    eventIds.length ? admin.from("events").select("id,title,slug,starts_at,venue_name,event_type").in("id", eventIds) : Promise.resolve({ data: [] as any[] }),
  ]);
  const ticketTypeIds = [...new Set((tickets || []).map(t => t.ticket_type_id))];
  const { data: ticketTypes } = ticketTypeIds.length ? await admin.from("event_ticket_types").select("id,name").in("id", ticketTypeIds) : { data: [] as any[] };
  const eventMap = new Map((events || []).map(e => [e.id, e]));
  const typeMap = new Map((ticketTypes || []).map(t => [t.id, t]));
  const ticketsByOrder = new Map<string, any[]>();
  for (const ticket of tickets || []) ticketsByOrder.set(ticket.order_id, [...(ticketsByOrder.get(ticket.order_id) || []), ticket]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY TICKETS</p><h1>Your event tickets.</h1><p className="lead">Tickets purchased or registered with your account email appear here.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">My Journey</Link><Link href="/my-tickets">My Tickets</Link><Link href="/events">Browse Events</Link></nav>
    <section className="memberDashboard"><div className="dashboardGrid">
      {(orders || []).map(order => { const event = eventMap.get(order.event_id); const orderTickets = ticketsByOrder.get(order.id) || []; return <article className="dashboardCard" key={order.id}>
        <p className="eyebrow">{order.order_status.toUpperCase()}</p><h2>{event?.title || "Event"}</h2>
        {event && <><p>{new Date(event.starts_at).toLocaleString()}</p><p>{event.event_type === "online" ? "Online" : event.venue_name || event.event_type}</p></>}
        <p><strong>Payment:</strong> {order.payment_status}</p>
        {orderTickets.length ? <div>{orderTickets.map(ticket => <div key={ticket.id} style={{padding:"12px 0",borderTop:"1px solid rgba(17,43,85,.12)"}}><strong>{typeMap.get(ticket.ticket_type_id)?.name || "Ticket"}</strong><br/><span>Ticket #{ticket.ticket_code}</span><br/><span>Status: {ticket.status}</span></div>)}</div> : <p>Ticket issuance is still processing. Please check your email and refresh shortly.</p>}
        {event && <Link className="button secondary" href={`/events/${event.slug}`}>View event</Link>}
      </article>})}
      {!orders?.length && <article className="dashboardCard"><h2>No tickets yet.</h2><p>When you register using your account email, your event tickets will appear here.</p><Link className="button" href="/events">Browse events</Link></article>}
    </div></section>
  </main>;
}
