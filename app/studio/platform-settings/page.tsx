import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import SettingsEditor from "./SettingsEditor";
import "../../dashboard.css";

const categoryLabels: Record<string, string> = {
  general: "General",
  branding: "Branding",
  contact: "Contact",
  social: "Social Media",
  seo: "SEO Defaults",
  commerce: "Commerce",
  email: "Email",
  scheduling: "Scheduling",
  analytics: "Analytics",
  features: "Feature Flags",
};

export default async function PlatformSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/platform-settings");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: settings } = await supabase.from("platform_settings").select("id,category,key,value,value_type,label,description,is_public,display_order").order("category").order("display_order");
  const grouped = (settings || []).reduce<Record<string, any[]>>((acc, setting) => {
    (acc[setting.category] ||= []).push(setting);
    return acc;
  }, {});

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · PLATFORM SETTINGS</p><h1>One place for the settings that run the platform.</h1><p className="lead">These values are prefilled with the current Shift Left configuration. Update only what you need; future website, navigation, SEO, commerce, email and scheduling features can reuse the same source of truth.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/platform-settings">Platform</Link><Link href="/studio/commerce">Commerce</Link><Link href="/studio/commerce-orders">Orders</Link><Link href="/studio/seo">SEO Center</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link></nav>
    <section className="memberDashboard">
      {!settings?.length && <div className="dashboardCard"><h2>Platform Settings migration needed.</h2><p>Run the 20260814 platform settings migration in Supabase to load the prefilled configuration.</p></div>}
      {Object.entries(grouped).map(([category, rows]) => <section key={category} className="settingsCategory"><div className="sectionHeading"><p className="eyebrow">PLATFORM</p><h2>{categoryLabels[category] || category}</h2></div><div className="dashboardGrid">{rows.map(setting => <SettingsEditor key={setting.id} setting={setting as any} />)}</div></section>)}
    </section>
  </main>;
}
