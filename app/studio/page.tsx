import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import "../dashboard.css";

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio");
  const { data: admin } = await supabase.from("admins").select("role,email").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const [{ count: members }, { count: results }, { count: sessions }, { count: leads }, { count: orders }, { count: books }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }),
    supabase.from("assessment_sessions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("discovery_call_leads").select("id", { count: "exact", head: true }),
    supabase.from("book_orders").select("id", { count: "exact", head: true }),
    supabase.from("books").select("id", { count: "exact", head: true }),
  ]);

  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO</p><h1>Admin workspace.</h1><p className="lead">Manage assessments, members, leads, books, orders, content, resources, and platform operations.</p></section><nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link></nav><section className="memberDashboard"><div className="dashboardGrid"><article className="dashboardCard"><p className="eyebrow">MEMBERS</p><div className="dashboardScore">{members || 0}</div><h2>Registered profiles</h2><Link className="button secondary" href="/studio/members">Manage members</Link></article><article className="dashboardCard"><p className="eyebrow">ASSESSMENTS</p><div className="dashboardScore">{results || 0}</div><h2>Completed results</h2><Link className="button secondary" href="/studio/assessments">Manage assessments</Link></article><article className="dashboardCard"><p className="eyebrow">LEADS</p><div className="dashboardScore">{leads || 0}</div><h2>Discovery requests</h2><Link className="button secondary" href="/studio/leads">Open leads</Link></article><article className="dashboardCard"><p className="eyebrow">BOOK CATALOG</p><div className="dashboardScore">{books || 0}</div><h2>Books for sale</h2><Link className="button secondary" href="/studio/books">Manage books</Link></article><article className="dashboardCard"><p className="eyebrow">BOOK ORDERS</p><div className="dashboardScore">{orders || 0}</div><h2>Direct purchases</h2><Link className="button secondary" href="/studio/book-orders">Manage orders</Link></article><article className="dashboardCard"><p className="eyebrow">IN PROGRESS</p><div className="dashboardScore">{sessions || 0}</div><h2>Saved sessions</h2></article></div></section></main>;
}
