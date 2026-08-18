import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/events");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");
  return { supabase, user };
}

async function createEvent(formData: FormData) {
  "use server";
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const startsAt = String(formData.get("starts_at") || "");
  if (!title || !slug || !startsAt) return;
  const { data: event, error } = await supabase.from("events").insert({
    title,
    slug,
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    event_type: String(formData.get("event_type") || "in_person"),
    venue_name: String(formData.get("venue_name") || "").trim() || null,
    venue_address: String(formData.get("venue_address") || "").trim() || null,
    online_url: String(formData.get("online_url") || "").trim() || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: formData.get("ends_at") ? new Date(String(formData.get("ends_at"))).toISOString() : null,
    timezone: String(formData.get("timezone") || "America/Los_Angeles"),
    capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
    status: String(formData.get("status") || "draft"),
    created_by: user.id,
  }).select("id").single();
  if (!error && event) redirect(`/studio/events/${event.id}`);
}

export default async function StudioEventsPage() {
  const { supabase } = await requireAdmin();
  const { data: events } = await supabase.from("events").select("id,title,slug,starts_at,status,capacity,event_type").order("starts_at", { ascending: false });

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · EVENTS</p><h1>Events &amp; ticketing.</h1><p className="lead">Create free or paid events, configure ticket types, publish registration pages, and track orders per event.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/events">Events</Link><Link href="/studio/commerce-orders">Commerce Orders</Link></nav>
    <section className="memberDashboard">
      <div className="dashboardGrid">
        <article className="dashboardCard" style={{gridColumn:"1 / -1"}}><p className="eyebrow">CREATE EVENT</p><h2>New event</h2>
          <form action={createEvent} className="settingsForm">
            <div className="settingsGrid">
              <label>Event title<input name="title" required placeholder="Shift Left Leadership Workshop" /></label>
              <label>URL slug<input name="slug" required placeholder="leadership-workshop" /></label>
              <label>Subtitle<input name="subtitle" placeholder="A practical online workshop" /></label>
              <label>Image URL<input name="image_url" placeholder="https://..." /></label>
              <label>Event type<select name="event_type" defaultValue="in_person"><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label>
              <label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <label>Starts<input name="starts_at" type="datetime-local" required /></label>
              <label>Ends<input name="ends_at" type="datetime-local" /></label>
              <label>Timezone<input name="timezone" defaultValue="America/Los_Angeles" /></label>
              <label>Capacity<input name="capacity" type="number" min="0" placeholder="Leave blank for unlimited" /></label>
              <label>Venue name<input name="venue_name" /></label>
              <label>Venue address<input name="venue_address" /></label>
              <label>Online meeting URL<input name="online_url" /></label>
            </div>
            <label>Description<textarea name="description" rows={5} /></label>
            <button className="button" type="submit">Create event</button>
          </form>
        </article>
      </div>
      <div className="dashboardGrid" style={{marginTop:24}}>
        {(events || []).map(event => <article className="dashboardCard" key={event.id}><p className="eyebrow">{event.status.toUpperCase()}</p><h2>{event.title}</h2><p>{new Date(event.starts_at).toLocaleString()}</p><p>{event.event_type.replace("_"," ")} · Capacity {event.capacity ?? "Unlimited"}</p><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="button secondary" href={`/studio/events/${event.id}`}>Manage event</Link><Link className="button secondary" href={`/events/${event.slug}`}>Public page</Link></div></article>)}
        {!events?.length && <article className="dashboardCard"><h2>No events yet.</h2><p>Create your first event above.</p></article>}
      </div>
    </section>
  </main>;
}
