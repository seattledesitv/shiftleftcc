import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import "../dashboard.css";

export default async function MyJourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey");

  const [{ data: latestResult }, { data: activeSession }, { count: completedCount }, { count: activityCount }, { count: goalCount }, { count: gratitudeCount }, { count: visionBoardCount }, { data: mission }, { data: vision }] = await Promise.all([
    supabase.from("assessment_results").select("total_score,category_scores,interpretation,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("assessment_sessions").select("id,current_question,answers,updated_at").eq("user_id", user.id).eq("status", "in_progress").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("activity_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("member_goals").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
    supabase.from("gratitude_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("vision_boards").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("member_missions").select("statement").eq("user_id", user.id).maybeSingle(),
    supabase.from("annual_visions").select("title,vision_statement,year").eq("user_id", user.id).eq("year", new Date().getFullYear()).maybeSingle(),
  ]);

  const scores = (latestResult?.category_scores || {}) as { mind_fitness?: number; physical_wellbeing?: number };
  const answered = Array.isArray(activeSession?.answers) ? activeSession.answers.filter(Boolean).length : 0;

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY</p><h1>Welcome back.</h1><p className="lead">Your private space for mission, vision, life goals, gratitude, assessments, activity, progress, and reflection.</p></section>
    <nav className="journeyNav" aria-label="My Journey navigation"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/vision-board">Vision Board</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link><Link href="/my-journey/assessments">Assessments</Link><Link href="/my-journey/progress">Progress</Link><Link href="/my-journey/journal">Journal</Link><Link href="/my-journey/activity">Activity</Link><Link href="/resources">Resources</Link><Link href="/book">Coaching</Link></nav>
    <section className="memberDashboard"><div className="dashboardGrid">
      <article className="dashboardCard"><p className="eyebrow">MY PERSONAL FOUNDATION</p><h2>{mission ? "Your mission is guiding the journey." : "Begin with your mission."}</h2><p>{mission?.statement || "Define the larger purpose and values that should guide your choices."}</p>{vision && <p><strong>{vision.title || `${vision.year} Vision`}:</strong> {vision.vision_statement}</p>}<Link className="button primary" href="/my-journey/foundation">{mission ? "Review mission & vision" : "Create mission & vision"}</Link></article>
      <article className="dashboardCard dashboardScoreCard"><p className="eyebrow">LATEST WELLBEING SCORE</p>{latestResult ? <><div className="dashboardScore">{latestResult.total_score}%</div><h2>{latestResult.interpretation}</h2><p>Compared with the current educational benchmark of 80%.</p><div className="miniScoreGrid"><div><span>Mind Fitness</span><strong>{scores.mind_fitness ?? 0}/50</strong></div><div><span>Physical</span><strong>{scores.physical_wellbeing ?? 0}/50</strong></div></div><Link className="button secondary" href="/my-journey/progress">View my progress</Link></> : <><h2>Start with a baseline.</h2><p>Complete the wellbeing assessment to establish your first score.</p><Link className="button primary" href="/wellbeing-assessment">Take the assessment</Link></>}</article>
      <article className="dashboardCard"><p className="eyebrow">MY VISION BOARD</p><h2>{visionBoardCount || 0} saved board{visionBoardCount === 1 ? "" : "s"}</h2><p>Turn annual aspirations into a visual board with themes and layouts that match the feeling you want to create.</p><Link className="button secondary" href="/my-journey/vision-board">Build my vision board</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY ASSESSMENT</p><h2>{activeSession ? "Continue where you left off." : "Ready for your next check-in?"}</h2><p>{activeSession ? `${answered} answers saved. Resume from question ${activeSession.current_question + 1}.` : "Your answers are saved securely to your member account."}</p><Link className="button primary" href="/wellbeing-assessment">{activeSession ? "Resume assessment" : "Start assessment"}</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY LIFE GOALS</p><h2>{goalCount || 0} active goal{goalCount === 1 ? "" : "s"}</h2><p>Track meaningful annual goals with success definitions and checkpoints.</p><Link className="button secondary" href="/my-journey/goals">Open life goals</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY GRATITUDE</p><h2>{gratitudeCount || 0} grateful day{gratitudeCount === 1 ? "" : "s"} recorded</h2><p>Notice meaningful moments and people you appreciate.</p><Link className="button secondary" href="/my-journey/gratitude">Add gratitude</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY HISTORY</p><h2>{completedCount || 0} completed assessment{completedCount === 1 ? "" : "s"}</h2><Link className="button secondary" href="/my-journey/assessments">Assessment history</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY ACTIVITY</p><h2>{activityCount || 0} saved entr{activityCount === 1 ? "y" : "ies"}</h2><Link className="button secondary" href="/my-journey/activity">Open activity</Link></article>
      <article className="dashboardCard"><p className="eyebrow">MY REFLECTION</p><h2>Capture what is happening now.</h2><Link className="button secondary" href="/my-journey/journal">Open journal</Link></article>
    </div></section>
  </main>;
}
