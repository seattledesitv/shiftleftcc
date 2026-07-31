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
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }),
    supabase.from("assessment_sessions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO</p><h1>Admin workspace.</h1><p className="lead">Manage assessments, members, content, leads, resources, and platform operations. Only approved admins can access this area.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link></nav>
    <section className="memberDashboard"><div className="dashboardGrid">
      <article className="dashboardCard"><p className="eyebrow">MEMBERS</p><div className="dashboardScore">{members || 0}</div><h2>Registered profiles</h2><Link className="button secondary" href="/studio/members">Manage members</Link></article>
      <article className="dashboardCard"><p className="eyebrow">ASSESSMENTS</p><div className="dashboardScore">{results || 0}</div><h2>Completed results</h2><Link className="button secondary" href="/studio/assessments">Manage assessments</Link></article>
      <article className="dashboardCard"><p className="eyebrow">IN PROGRESS</p><div className="dashboardScore">{sessions || 0}</div><h2>Saved sessions</h2></article>
      <article className="dashboardCard"><p className="eyebrow">ASSESSMENT MANAGEMENT</p><h2>Questions and templates</h2><p>Review the configurable assessment structure and preview the current member experience.</p><div className="actions"><Link className="button secondary" href="/studio/assessments">Open management</Link><Link className="button secondary" href="/wellbeing-assessment">Preview</Link></div></article>
      <article className="dashboardCard"><p className="eyebrow">PRIVACY</p><h2>Journal content stays private.</h2><p>Studio does not expose member journal entries. Future analytics will use aggregate counts and trends without displaying private reflection text.</p></article>
      <article className="dashboardCard"><p className="eyebrow">OPERATIONS</p><h2>Coming next</h2><p>Discovery-call leads, programs, resources, email activity, and member engagement analytics.</p></article>
    </div></section>
  </main>;
}
