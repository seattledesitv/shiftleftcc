import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import NavigationEditor from "./NavigationEditor";
import "../../dashboard.css";

export default async function StudioNavigationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/navigation");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: items } = await supabase.from("navigation_items").select("id,location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab").order("location").order("display_order");

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · WEBSITE</p><h1>Navigation Builder</h1><p className="lead">Control the public header and footer without changing code. The menu is prefilled with the visitor-focused structure we designed.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/platform-settings">Platform Settings</Link><Link href="/studio/navigation">Navigation</Link><Link href="/studio/seo">SEO Center</Link></nav>
    <section className="memberDashboard">{items?.length ? <NavigationEditor initialItems={items as any} /> : <div className="dashboardCard"><h2>Navigation migration needed.</h2><p>Run the navigation migration in Supabase to load the prefilled menu.</p></div>}</section>
  </main>;
}
