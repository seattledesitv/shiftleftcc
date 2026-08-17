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

  const [{ count: members }, { count: results }, { count: sessions }, { count: leads }, { count: bookOrders }, { count: books }, { count: products }, { count: commerceOrders }, { count: seoPages }, { count: platformSettings }, { count: navigationItems }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }),
    supabase.from("assessment_sessions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("discovery_call_leads").select("id", { count: "exact", head: true }),
    supabase.from("book_orders").select("id", { count: "exact", head: true }),
    supabase.from("books").select("id", { count: "exact", head: true }),
    supabase.from("commerce_products").select("id", { count: "exact", head: true }),
    supabase.from("commerce_orders").select("id", { count: "exact", head: true }),
    supabase.from("seo_pages").select("id", { count: "exact", head: true }),
    supabase.from("platform_settings").select("id", { count: "exact", head: true }),
    supabase.from("navigation_items").select("id", { count: "exact", head: true }),
  ]);

  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO</p><h1>Admin workspace.</h1><p className="lead">Manage website configuration, navigation, commerce, programs, SEO, assessments, members, leads, books, orders, content, resources, and operations.</p></section><nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/platform-settings">Platform</Link><Link href="/studio/navigation">Navigation</Link><Link href="/studio/commerce">Commerce</Link><Link href="/studio/commerce-orders">Orders</Link><Link href="/studio/seo">SEO Center</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link></nav><section className="memberDashboard"><div className="dashboardGrid">
    <article className="dashboardCard"><p className="eyebrow">PLATFORM SETTINGS</p><div className="dashboardScore">{platformSettings || 0}</div><h2>Central configuration</h2><p>Brand, contact, SEO defaults, commerce, email, scheduling, analytics and feature flags.</p><Link className="button secondary" href="/studio/platform-settings">Open platform settings</Link></article>
    <article className="dashboardCard"><p className="eyebrow">NAVIGATION BUILDER</p><div className="dashboardScore">{navigationItems || 0}</div><h2>Header &amp; footer menu</h2><p>Rename, reorder, hide, add and nest navigation links without deploying code.</p><Link className="button secondary" href="/studio/navigation">Manage navigation</Link></article>
    <article className="dashboardCard"><p className="eyebrow">COMMERCE CATALOG</p><div className="dashboardScore">{products || 0}</div><h2>Programs &amp; services</h2><Link className="button secondary" href="/studio/commerce">Manage pricing</Link></article>
    <article className="dashboardCard"><p className="eyebrow">COMMERCE ORDERS</p><div className="dashboardScore">{commerceOrders || 0}</div><h2>Program purchases</h2><Link className="button secondary" href="/studio/commerce-orders">View orders</Link></article>
    <article className="dashboardCard"><p className="eyebrow">SEO CENTER</p><div className="dashboardScore">{seoPages || 0}</div><h2>Search-optimized pages</h2><Link className="button secondary" href="/studio/seo">Manage SEO</Link></article>
    <article className="dashboardCard"><p className="eyebrow">MEMBERS</p><div className="dashboardScore">{members || 0}</div><h2>Registered profiles</h2><Link className="button secondary" href="/studio/members">Manage members</Link></article>
    <article className="dashboardCard"><p className="eyebrow">ASSESSMENTS</p><div className="dashboardScore">{results || 0}</div><h2>Completed results</h2><Link className="button secondary" href="/studio/assessments">Manage assessments</Link></article>
    <article className="dashboardCard"><p className="eyebrow">LEADS</p><div className="dashboardScore">{leads || 0}</div><h2>Discovery requests</h2><Link className="button secondary" href="/studio/leads">Open leads</Link></article>
    <article className="dashboardCard"><p className="eyebrow">BOOK CATALOG</p><div className="dashboardScore">{books || 0}</div><h2>Books for sale</h2><Link className="button secondary" href="/studio/books">Manage books</Link></article>
    <article className="dashboardCard"><p className="eyebrow">BOOK ORDERS</p><div className="dashboardScore">{bookOrders || 0}</div><h2>Direct purchases</h2><Link className="button secondary" href="/studio/book-orders">Manage orders</Link></article>
    <article className="dashboardCard"><p className="eyebrow">IN PROGRESS</p><div className="dashboardScore">{sessions || 0}</div><h2>Saved sessions</h2></article>
  </div></section></main>;
}
