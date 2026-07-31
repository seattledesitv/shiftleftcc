import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function StudioLeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/leads");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: leads } = await supabase.from("discovery_call_leads").select("id,name,email,phone,audience,organization,interest,message,availability,status,email_status,created_at").order("created_at", { ascending: false }).limit(100);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · LEADS</p><h1>Discovery call requests.</h1><p className="lead">Review website inquiries, email-delivery status, and the context needed for follow-up.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">DISCOVERY CALL PIPELINE</p><h2>{leads?.length || 0} request{leads?.length === 1 ? "" : "s"}</h2></div>
      {(leads || []).map(lead => <article className="dashboardCard leadCard" key={lead.id}>
        <div className="leadHeader"><div><p className="eyebrow">{new Date(lead.created_at).toLocaleString()}</p><h2>{lead.name}</h2><p><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.phone ? ` · ${lead.phone}` : ""}</p></div><div className="leadBadges"><span>{lead.status}</span><span>Email {lead.email_status}</span></div></div>
        <p><strong>Interest:</strong> {lead.interest || "Discovery call"}</p>
        <p><strong>Audience:</strong> {lead.audience || "Not specified"}{lead.organization ? ` · ${lead.organization}` : ""}</p>
        {lead.availability && <p><strong>Availability:</strong> {lead.availability}</p>}
        <p>{lead.message}</p>
      </article>)}
      {!leads?.length && <div className="dashboardCard"><h2>No discovery call requests yet.</h2><p>New website submissions will appear here after the goals-and-leads migration is active.</p></div>}
    </div></section>
  </main>;
}
