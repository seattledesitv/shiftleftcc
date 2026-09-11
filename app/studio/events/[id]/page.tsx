import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../../lib/supabase/server";
import CloudinaryImageUpload from "../CloudinaryImageUpload";
import "../../../dashboard.css";

async function requireAdmin(next: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");
  return supabase;
}

export default async function StudioEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin(`/studio/events/${id}`);

  async function updateEvent(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const imageUrl = String(formData.get("image_url") || "").trim() || null;
    const { error } = await db.from("events").update({
      title: String(formData.get("title") || "").trim(),
      subtitle: String(formData.get("subtitle") || "").trim() || null,
      description: String(formData.get("description") || "").trim() || null,
      image_url: imageUrl,
      event_type: String(formData.get("event_type") || "in_person"),
      venue_name: String(formData.get("venue_name") || "").trim() || null,
      venue_address: String(formData.get("venue_address") || "").trim() || null,
      online_url: String(formData.get("online_url") || "").trim() || null,
      starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
      ends_at: formData.get("ends_at") ? new Date(String(formData.get("ends_at"))).toISOString() : null,
      timezone: String(formData.get("timezone") || "America/Los_Angeles"),
      capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
      registration_opens_at: formData.get("registration_opens_at") ? new Date(String(formData.get("registration_opens_at"))).toISOString() : null,
      registration_closes_at: formData.get("registration_closes_at") ? new Date(String(formData.get("registration_closes_at"))).toISOString() : null,
      status: String(formData.get("status") || "draft"),
      confirmation_message: String(formData.get("confirmation_message") || "").trim() || null,
    }).eq("id", id);
    if (error) throw new Error(`Could not save event: ${error.message}`);
    revalidatePath(`/studio/events/${id}`); revalidatePath("/events");
  }

  async function addTicketType(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const { error } = await db.from("event_ticket_types").insert({
      event_id: id,
      name: String(formData.get("name") || "General Admission").trim(),
      description: String(formData.get("description") || "").trim() || null,
      price_amount: Math.round(Number(formData.get("price") || 0) * 100),
      quantity_available: formData.get("quantity_available") ? Number(formData.get("quantity_available")) : null,
      max_per_order: Number(formData.get("max_per_order") || 10),
      sale_starts_at: formData.get("sale_starts_at") ? new Date(String(formData.get("sale_starts_at"))).toISOString() : null,
      sale_ends_at: formData.get("sale_ends_at") ? new Date(String(formData.get("sale_ends_at"))).toISOString() : null,
      display_order: Number(formData.get("display_order") || 10),
      is_active: true,
    });
    if (error) throw new Error(`Could not add ticket type: ${error.message}`);
    revalidatePath(`/studio/events/${id}`); revalidatePath("/events");
  }

  async function updateTicketType(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const ticketId = String(formData.get("ticket_id") || "");
    const { error } = await db.from("event_ticket_types").update({
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "").trim() || null,
      price_amount: Math.round(Number(formData.get("price") || 0) * 100),
      quantity_available: formData.get("quantity_available") ? Number(formData.get("quantity_available")) : null,
      max_per_order: Number(formData.get("max_per_order") || 10),
      sale_starts_at: formData.get("sale_starts_at") ? new Date(String(formData.get("sale_starts_at"))).toISOString() : null,
      sale_ends_at: formData.get("sale_ends_at") ? new Date(String(formData.get("sale_ends_at"))).toISOString() : null,
      display_order: Number(formData.get("display_order") || 10),
    }).eq("id", ticketId).eq("event_id", id);
    if (error) throw new Error(`Could not update ticket type: ${error.message}`);
    revalidatePath(`/studio/events/${id}`); revalidatePath("/events");
  }

  async function toggleTicket(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const ticketId = String(formData.get("ticket_id"));
    const active = String(formData.get("active")) === "true";
    await db.from("event_ticket_types").update({ is_active: !active }).eq("id", ticketId).eq("event_id", id);
    revalidatePath(`/studio/events/${id}`); revalidatePath("/events");
  }

  async function addDiscount(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const type = String(formData.get("discount_type") || "percent");
    const rawValue = Number(formData.get("discount_value") || 0);
    const value = type === "percent" ? Math.round(rawValue) : Math.round(rawValue * 100);
    const code = String(formData.get("code") || "").trim().toUpperCase();
    if (!code || value <= 0) return;
    const { error } = await db.from("event_discounts").insert({
      event_id: id,
      code,
      discount_type: type,
      discount_value: value,
      usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : null,
      starts_at: formData.get("starts_at") ? new Date(String(formData.get("starts_at"))).toISOString() : null,
      ends_at: formData.get("ends_at") ? new Date(String(formData.get("ends_at"))).toISOString() : null,
      is_active: true,
    });
    if (error) throw new Error(`Could not add discount: ${error.message}`);
    revalidatePath(`/studio/events/${id}`);
  }

  async function toggleDiscount(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const discountId = String(formData.get("discount_id") || "");
    const active = String(formData.get("active")) === "true";
    await db.from("event_discounts").update({ is_active: !active }).eq("id", discountId).eq("event_id", id);
    revalidatePath(`/studio/events/${id}`);
  }

  const [{ data: event }, { data: ticketTypes }, { data: orders }, { data: tickets }, { data: discounts }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_ticket_types").select("*").eq("event_id", id).order("display_order"),
    supabase.from("event_orders").select("id,customer_name,customer_email,subtotal_amount,discount_code,discount_amount,total_amount,payment_status,order_status,created_at").eq("event_id", id).order("created_at", { ascending:false }),
    supabase.from("event_tickets").select("id,status,checked_in_at").eq("event_id", id),
    supabase.from("event_discounts").select("*").eq("event_id", id).order("created_at", { ascending:false }),
  ]);
  if (!event) notFound();
  const paid = (orders || []).filter(o => o.payment_status === "paid").reduce((s,o)=>s+(o.total_amount||0),0);
  const dt = (value: string | null) => value ? new Date(value).toISOString().slice(0,16) : "";

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">EVENT MANAGEMENT</p><h1>{event.title}</h1><p className="lead">Configure event details, artwork, ticket types, discounts, payments, capacity, and registrations.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/events">Events</Link><Link href={`/events/${event.slug}`}>Public page</Link></nav>
    <section className="memberDashboard">
      <div className="dashboardGrid">
        <article className="dashboardCard"><p className="eyebrow">ORDERS</p><div className="dashboardScore">{orders?.length || 0}</div><h2>Registrations</h2></article>
        <article className="dashboardCard"><p className="eyebrow">TICKETS</p><div className="dashboardScore">{tickets?.length || 0}</div><h2>Tickets issued</h2></article>
        <article className="dashboardCard"><p className="eyebrow">REVENUE</p><div className="dashboardScore">${(paid/100).toFixed(2)}</div><h2>Paid revenue</h2></article>
      </div>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Event details</h2><form action={updateEvent} className="settingsForm"><div className="settingsGrid">
        <label>Title<input name="title" defaultValue={event.title} required /></label>
        <label>Subtitle<input name="subtitle" defaultValue={event.subtitle || ""} /></label>
        <label>Status<select name="status" defaultValue={event.status}><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
        <label>Event type<select name="event_type" defaultValue={event.event_type}><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label>
        <label>Starts<input type="datetime-local" name="starts_at" defaultValue={dt(event.starts_at)} required /></label>
        <label>Ends<input type="datetime-local" name="ends_at" defaultValue={dt(event.ends_at)} /></label>
        <label>Registration opens<input type="datetime-local" name="registration_opens_at" defaultValue={dt(event.registration_opens_at)} /></label>
        <label>Registration closes<input type="datetime-local" name="registration_closes_at" defaultValue={dt(event.registration_closes_at)} /></label>
        <label>Timezone<input name="timezone" defaultValue={event.timezone} /></label>
        <label>Capacity<input name="capacity" type="number" min="0" defaultValue={event.capacity ?? ""} /></label>
        <label>Venue<input name="venue_name" defaultValue={event.venue_name || ""} /></label>
        <label>Venue address<input name="venue_address" defaultValue={event.venue_address || ""} /></label>
        <label>Online URL<input name="online_url" defaultValue={event.online_url || ""} /></label>
        <CloudinaryImageUpload initialUrl={event.image_url || ""} label="Upload / replace event image" />
      </div><label>Description<textarea name="description" rows={5} defaultValue={event.description || ""} /></label><label>Confirmation message<textarea name="confirmation_message" rows={3} defaultValue={event.confirmation_message || ""} /></label><button className="button">Save event</button></form></article>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Ticket types</h2><p>Add free or paid ticket types. Existing ticket types can be edited at any time.</p><form action={addTicketType} className="settingsForm"><div className="settingsGrid">
        <label>Name<input name="name" required defaultValue="General Admission" /></label><label>Price (USD)<input name="price" type="number" min="0" step="0.01" defaultValue="0" /></label><label>Quantity available<input name="quantity_available" type="number" min="0" placeholder="Unlimited" /></label><label>Max per order<input name="max_per_order" type="number" min="1" defaultValue="10" /></label><label>Sale starts<input name="sale_starts_at" type="datetime-local" /></label><label>Sale ends<input name="sale_ends_at" type="datetime-local" /></label><label>Display order<input name="display_order" type="number" defaultValue="10" /></label><label>Description<input name="description" /></label>
      </div><button className="button">Add ticket type</button></form>
      <div className="dashboardGrid" style={{marginTop:20}}>{(ticketTypes || []).map(t => <article className="dashboardCard" key={t.id}><p className="eyebrow">{t.is_active ? "ACTIVE" : "HIDDEN"}</p><form action={updateTicketType} className="settingsForm"><input type="hidden" name="ticket_id" value={t.id}/><label>Name<input name="name" required defaultValue={t.name}/></label><label>Price (USD)<input name="price" type="number" min="0" step="0.01" defaultValue={(t.price_amount/100).toFixed(2)}/></label><label>Quantity available<input name="quantity_available" type="number" min="0" defaultValue={t.quantity_available ?? ""} placeholder="Unlimited"/></label><label>Max per order<input name="max_per_order" type="number" min="1" defaultValue={t.max_per_order}/></label><label>Sale starts<input name="sale_starts_at" type="datetime-local" defaultValue={dt(t.sale_starts_at)}/></label><label>Sale ends<input name="sale_ends_at" type="datetime-local" defaultValue={dt(t.sale_ends_at)}/></label><label>Display order<input name="display_order" type="number" defaultValue={t.display_order}/></label><label>Description<input name="description" defaultValue={t.description || ""}/></label><button className="button secondary">Save ticket type</button></form><form action={toggleTicket} style={{marginTop:10}}><input type="hidden" name="ticket_id" value={t.id}/><input type="hidden" name="active" value={String(t.is_active)}/><button className="button secondary">{t.is_active ? "Hide ticket" : "Activate ticket"}</button></form></article>)}</div></article>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Discount codes</h2><p>Create percentage or fixed-dollar discounts for this event.</p><form action={addDiscount} className="settingsForm"><div className="settingsGrid"><label>Code<input name="code" required placeholder="SDTV15" /></label><label>Type<select name="discount_type" defaultValue="percent"><option value="percent">Percentage</option><option value="fixed">Fixed amount (USD)</option></select></label><label>Value<input name="discount_value" type="number" min="0.01" step="0.01" required placeholder="15" /></label><label>Usage limit<input name="usage_limit" type="number" min="1" placeholder="Unlimited" /></label><label>Starts<input name="starts_at" type="datetime-local" /></label><label>Ends<input name="ends_at" type="datetime-local" /></label></div><button className="button">Add discount code</button></form><div className="dashboardGrid" style={{marginTop:20}}>{(discounts || []).map(d => <article className="dashboardCard" key={d.id}><p className="eyebrow">{d.is_active ? "ACTIVE" : "INACTIVE"}</p><h2>{d.code}</h2><p>{d.discount_type === "percent" ? `${d.discount_value}% off` : `$${(d.discount_value/100).toFixed(2)} off`} · {d.usage_limit ? `${d.usage_limit} uses max` : "Unlimited uses"}</p><form action={toggleDiscount}><input type="hidden" name="discount_id" value={d.id}/><input type="hidden" name="active" value={String(d.is_active)}/><button className="button secondary">{d.is_active ? "Disable" : "Activate"}</button></form></article>)}{!discounts?.length && <article className="dashboardCard"><p>No discount codes yet.</p></article>}</div></article>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Registrations &amp; orders</h2><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th align="left">Customer</th><th align="left">Email</th><th align="left">Discount</th><th align="left">Payment</th><th align="left">Order</th><th align="right">Total</th><th align="left">Created</th></tr></thead><tbody>{(orders || []).map(o => <tr key={o.id}><td>{o.customer_name}</td><td>{o.customer_email}</td><td>{o.discount_code ? `${o.discount_code} (-$${((o.discount_amount||0)/100).toFixed(2)})` : "—"}</td><td>{o.payment_status}</td><td>{o.order_status}</td><td align="right">${((o.total_amount||0)/100).toFixed(2)}</td><td>{new Date(o.created_at).toLocaleString()}</td></tr>)}</tbody></table>{!orders?.length && <p>No registrations yet.</p>}</div></article>
    </section>
  </main>;
}
