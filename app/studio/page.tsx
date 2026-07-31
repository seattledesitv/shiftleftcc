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

  const [{ count: members }, { count: results }, { count: sessions }] = await Promise.all([
    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }),
    supabase.from("assessment_sessions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO</p><h1>Admin workspace.</h1><p className="lead">Manage assessments, members, content, leads, resources, and platform operations. Only approved admins can access this area.</p></section>
    <section className="memberDashboard"><div className="dashboardGrid">
      <article className="dashboardCard"><p className="eyebrow">MEMBERS</p><div className="dashboardScore">{members || 0}</div><h2>Registered profiles</h2></article>
      <article className="dashboardCard"><p className="eyebrow">ASSESSMENTS</p><div className="dashboardScore">{results || 0}</div><h2>Completed results</h2></article>
      <article className="dashboardCard"><p className="eyebrow">IN PROGRESS</p><div className="dashboardScore">{sessions || 0}</div><h2>Saved sessions</h2></article>
      <article className="dashboardCard"><p className="eyebrow">ASSESSMENT MANAGEMENT</p><h2>Questions and templates</h2><p>The database is configurable and ready for an editor interface in the next Studio sprint.</p><Link className="button secondary" href="/wellbeing-assessment">Preview assessment</Link></article>
      <article className="dashboardCard"><p className="eyebrow">OPERATIONS</p><h2>Coming next</h2><p>Discovery-call leads, journal analytics, programs, resources, email activity, and member management.</p></article>
    </div></section>
  </main>;
}
