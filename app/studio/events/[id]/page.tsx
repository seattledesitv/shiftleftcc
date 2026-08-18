import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../../lib/supabase/server";
import "../../../dashboard.css";

async function requireAdmin(next: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");
  return supabase;
}

async function uploadEventImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File, slug: string) {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Event image must be 5 MB or smaller.");
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${slug}/${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("event-images").upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("event-images").getPublicUrl(path).data.publicUrl;
}

export default async function StudioEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin(`/studio/events/${id}`);

  async function updateEvent(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    const { data: current } = await db.from("events").select("slug,image_url").eq("id", id).maybeSingle();
    const imageFile = formData.get("event_image") as File | null;
    const uploadedImageUrl = imageFile?.size ? await uploadEventImage(db, imageFile, current?.slug || id) : null;
    const manualImageUrl = String(formData.get("image_url") || "").trim();
    const removeImage = formData.get("remove_image") === "on";
    const imageUrl = removeImage ? null : (uploadedImageUrl || manualImageUrl || current?.image_url || null);

    await db.from("events").update({
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
    revalidatePath(`/studio/events/${id}`); revalidatePath("/events");
  }

  async function addTicketType(formData: FormData) {
    "use server";
    const db = await requireAdmin(`/studio/events/${id}`);
    await db.from("event_ticket_types").insert({
      event_id: id,
      name: String(formData.get("name") || "General Admission").trim(),
      description: String(formData.get("description") || "").trim() || null,
      price_amount: Math.round(Number(formData.get("price") || 0) * 100),
      quantity_available: formData.get("quantity_available") ? Number(formData.get("quantity_available")) : null,
      max_per_order: Number(formData.get("max_per_order") || 10),
      display_order: Number(formData.get("display_order") || 10),
      is_active: true,
    });
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

  const [{ data: event }, { data: ticketTypes }, { data: orders }, { data: tickets }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_ticket_types").select("*").eq("event_id", id).order("display_order"),
    supabase.from("event_orders").select("id,customer_name,customer_email,total_amount,payment_status,order_status,created_at").eq("event_id", id).order("created_at", { ascending:false }),
    supabase.from("event_tickets").select("id,status,checked_in_at").eq("event_id", id),
  ]);
  if (!event) notFound();
  const paid = (orders || []).filter(o => o.payment_status === "paid").reduce((s,o)=>s+(o.total_amount||0),0);
  const dt = (value: string | null) => value ? new Date(value).toISOString().slice(0,16) : "";

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">EVENT MANAGEMENT</p><h1>{event.title}</h1><p className="lead">Configure event details, artwork, free or paid ticket types, capacity, and review registrations.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/events">Events</Link><Link href={`/events/${event.slug}`}>Public page</Link></nav>
    <section className="memberDashboard">
      <div className="dashboardGrid">
        <article className="dashboardCard"><p className="eyebrow">ORDERS</p><div className="dashboardScore">{orders?.length || 0}</div><h2>Registrations</h2></article>
        <article className="dashboardCard"><p className="eyebrow">TICKETS</p><div className="dashboardScore">{tickets?.length || 0}</div><h2>Tickets issued</h2></article>
        <article className="dashboardCard"><p className="eyebrow">REVENUE</p><div className="dashboardScore">${(paid/100).toFixed(2)}</div><h2>Paid revenue</h2></article>
      </div>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Event details</h2>{event.image_url && <img src={event.image_url} alt={`${event.title} event`} style={{width:"100%",maxWidth:720,aspectRatio:"16/9",objectFit:"cover",borderRadius:18,margin:"8px 0 20px"}} />}<form action={updateEvent} className="settingsForm"><div className="settingsGrid">
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
        <label>Upload / replace event image<input name="event_image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /><small>JPG, PNG, WEBP or GIF · max 5 MB</small></label>
        <label>Or image URL<input name="image_url" defaultValue={event.image_url || ""} /></label>
        <label style={{display:"flex",alignItems:"center",gap:8}}>Remove current image<input name="remove_image" type="checkbox" /></label>
      </div><label>Description<textarea name="description" rows={5} defaultValue={event.description || ""} /></label><label>Confirmation message<textarea name="confirmation_message" rows={3} defaultValue={event.confirmation_message || ""} /></label><button className="button">Save event</button></form></article>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Ticket types</h2><p>Add free tickets with price $0 or paid tickets with any price.</p><form action={addTicketType} className="settingsForm"><div className="settingsGrid">
        <label>Name<input name="name" required defaultValue="General Admission" /></label>
        <label>Price (USD)<input name="price" type="number" min="0" step="0.01" defaultValue="0" /></label>
        <label>Quantity available<input name="quantity_available" type="number" min="0" placeholder="Unlimited" /></label>
        <label>Max per order<input name="max_per_order" type="number" min="1" defaultValue="10" /></label>
        <label>Order<input name="display_order" type="number" defaultValue="10" /></label>
        <label>Description<input name="description" /></label>
      </div><button className="button">Add ticket type</button></form>
      <div className="dashboardGrid" style={{marginTop:20}}>{(ticketTypes || []).map(t => <article className="dashboardCard" key={t.id}><p className="eyebrow">{t.is_active ? "ACTIVE" : "HIDDEN"}</p><h2>{t.name}</h2><p>{t.price_amount === 0 ? "FREE" : `$${(t.price_amount/100).toFixed(2)}`} · {t.quantity_available ?? "Unlimited"} available</p><form action={toggleTicket}><input type="hidden" name="ticket_id" value={t.id}/><input type="hidden" name="active" value={String(t.is_active)}/><button className="button secondary">{t.is_active ? "Hide" : "Activate"}</button></form></article>)}</div></article>

      <article className="dashboardCard" style={{marginTop:24}}><h2>Registrations &amp; orders</h2><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><th align="left">Customer</th><th align="left">Email</th><th align="left">Payment</th><th align="left">Order</th><th align="right">Total</th><th align="left">Created</th></tr></thead><tbody>{(orders || []).map(o => <tr key={o.id}><td>{o.customer_name}</td><td>{o.customer_email}</td><td>{o.payment_status}</td><td>{o.order_status}</td><td align="right">${((o.total_amount||0)/100).toFixed(2)}</td><td>{new Date(o.created_at).toLocaleString()}</td></tr>)}</tbody></table>{!orders?.length && <p>No registrations yet.</p>}</div></article>
    </section>
  </main>;
}
