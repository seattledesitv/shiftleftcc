import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function MyProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/progress");

  const { data: results } = await supabase.from("assessment_results").select("id,total_score,category_scores,created_at").eq("user_id", user.id).order("created_at", { ascending: true });
  const latest = results?.at(-1);
  const previous = results && results.length > 1 ? results.at(-2) : null;
  const change = latest && previous ? latest.total_score - previous.total_score : null;

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY PROGRESS</p><h1>Notice meaningful change over time.</h1><p className="lead">Your wellbeing trend compares each completed assessment with your earlier results and the 80% educational benchmark.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link></nav>
    <section className="memberDashboard">
      <div className="progressSummary">
        <article className="dashboardCard"><p className="eyebrow">LATEST SCORE</p><div className="dashboardScore">{latest?.total_score ?? "—"}{latest ? "%" : ""}</div><p>{change === null ? "Complete at least two assessments to see change." : change > 0 ? `Up ${change} points from your previous assessment.` : change < 0 ? `Down ${Math.abs(change)} points from your previous assessment.` : "No change from your previous assessment."}</p></article>
        <article className="dashboardCard"><p className="eyebrow">BENCHMARK</p><div className="dashboardScore">80%</div><p>This is the general educational benchmark used by the assessment, not a medical threshold.</p></article>
      </div>
      <div className="trendChart" aria-label="Assessment score trend">
        <div className="trendBenchmark"><span>80% benchmark</span></div>
        {(results || []).map((result) => <div className="trendPoint" key={result.id} style={{ height: `${result.total_score}%` }} title={`${new Date(result.created_at).toLocaleDateString()}: ${result.total_score}%`}><span>{result.total_score}%</span><small>{new Date(result.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small></div>)}
      </div>
      {!results?.length && <div className="dashboardCard"><h2>Your trend starts with one assessment.</h2><Link className="button primary" href="/wellbeing-assessment">Take assessment</Link></div>}
    </section>
  </main>;
}
