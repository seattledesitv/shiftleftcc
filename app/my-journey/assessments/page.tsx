import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function MyAssessmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/assessments");

  const { data: results } = await supabase.from("assessment_results").select("id,total_score,category_scores,interpretation,created_at").eq("user_id", user.id).order("created_at", { ascending: false });

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY ASSESSMENTS</p><h1>Your assessment history.</h1><p className="lead">Review completed assessments and retake the wellbeing assessment whenever you want a fresh check-in.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><h2>Wellbeing Self-Assessment</h2><p>Mind Fitness + Physical Wellbeing with an 80% educational benchmark.</p><Link className="button primary" href="/wellbeing-assessment">Take assessment</Link></div>
      {(results || []).map((result) => { const scores = (result.category_scores || {}) as { mind_fitness?: number; physical_wellbeing?: number }; return <article className="historyRow" key={result.id}><div><p className="eyebrow">{new Date(result.created_at).toLocaleDateString()}</p><h2>{result.total_score}%</h2><p>{result.interpretation}</p></div><div className="historyScores"><span>Mind {scores.mind_fitness ?? 0}/50</span><span>Physical {scores.physical_wellbeing ?? 0}/50</span></div></article>; })}
      {!results?.length && <div className="dashboardCard"><h2>No completed assessments yet.</h2><p>Your first completed assessment will appear here.</p></div>}
    </div></section>
  </main>;
}
