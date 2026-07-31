import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function MyAssessmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/assessments");

  const [{ data: results }, { data: templates }] = await Promise.all([
    supabase.from("assessment_results").select("id,total_score,category_scores,interpretation,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("assessment_templates").select("id,slug,title,description,is_active,version").eq("is_active", true).order("created_at", { ascending: true }),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY ASSESSMENTS</p><h1>Your assessments and history.</h1><p className="lead">Start with the live Wellbeing Foundations assessment. Additional Shift Left check-ins are being prepared as educational self-reflection tools.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link><Link href="/my-journey/activity">My Activity</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="assessmentCatalog">
        {(templates || []).map(template => {
          const isLive = template.slug === "wellbeing-foundations";
          return <article className="dashboardCard" key={template.id}>
            <p className="eyebrow">{isLive ? "AVAILABLE NOW" : "COMING NEXT"} · VERSION {template.version}</p>
            <h2>{template.title}</h2>
            <p>{template.description}</p>
            {isLive ? <Link className="button primary" href="/wellbeing-assessment">Take assessment</Link> : <span className="assessmentStatus">Question set in development</span>}
          </article>;
        })}
      </div>
      <div className="dashboardCard"><p className="eyebrow">MY COMPLETED HISTORY</p><h2>{results?.length || 0} completed assessment{results?.length === 1 ? "" : "s"}</h2><p>Completed results remain private to your member account.</p></div>
      {(results || []).map((result) => { const scores = (result.category_scores || {}) as { mind_fitness?: number; physical_wellbeing?: number }; return <article className="historyRow" key={result.id}><div><p className="eyebrow">{new Date(result.created_at).toLocaleDateString()}</p><h2>{result.total_score}%</h2><p>{result.interpretation}</p></div><div className="historyScores"><span>Mind {scores.mind_fitness ?? 0}/50</span><span>Physical {scores.physical_wellbeing ?? 0}/50</span></div></article>; })}
      {!results?.length && <div className="dashboardCard"><h2>No completed assessments yet.</h2><p>Your first completed assessment will appear here.</p></div>}
    </div></section>
  </main>;
}
