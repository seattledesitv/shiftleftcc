import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import SeoEditor from "./SeoEditor";
import "../../dashboard.css";

export default async function StudioSeoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/seo");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: pages } = await supabase.from("seo_pages").select("id,path,page_name,seo_title,meta_description,keywords,canonical_url,og_image,schema_type,index_page,sitemap_enabled,sitemap_priority,change_frequency,notes").order("path");

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · SEO CENTER</p><h1>Search visibility, prefilled and editable.</h1><p className="lead">The important public pages are pre-populated with useful SEO titles, descriptions, keywords, canonical URLs and schema guidance. Adjust them here as positioning evolves.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/commerce">Commerce</Link><Link href="/studio/commerce-orders">Commerce Orders</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link><Link href="/studio/seo">SEO Center</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">SEO FOUNDATION</p><h2>{pages?.length || 0} configured pages</h2><p>Titles and descriptions are intentionally prefilled rather than blank. Editing this registry gives us a single source for ongoing optimization; technical metadata can be progressively connected page-by-page without changing the admin workflow.</p></div>
      {(pages || []).map(page => <SeoEditor key={page.id} page={page as any} />)}
      {!pages?.length && <div className="dashboardCard"><h2>SEO migration needed.</h2><p>Run the SEO Center migration in Supabase to load the prefilled page configuration.</p></div>}
    </div></section>
  </main>;
}
