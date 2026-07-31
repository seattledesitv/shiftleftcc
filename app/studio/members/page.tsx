import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function StudioMembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/members");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: members } = await supabase
    .from("profiles")
    .select("user_id,display_name,email,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · MEMBERS</p><h1>Member overview.</h1><p className="lead">Review registered profiles and platform participation without exposing private journal content.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">REGISTERED MEMBERS</p><h2>{members?.length || 0} member{members?.length === 1 ? "" : "s"}</h2></div>
      {(members || []).map(member => <article className="dashboardCard memberRow" key={member.user_id}>
        <div><p className="eyebrow">MEMBER</p><h2>{member.display_name || member.email || "Unnamed member"}</h2><p>{member.email || "No email stored in profile"}</p></div>
        <p className="finePrint">Joined {new Date(member.created_at).toLocaleDateString()}</p>
      </article>)}
      {!members?.length && <div className="dashboardCard"><h2>No member profiles found.</h2><p>Profiles will appear after users register and the Phase A migration is active.</p></div>}
    </div></section>
  </main>;
}
