import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import "../dashboard.css";

export default async function MyJourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey");

  const [{ data: latestResult }, { data: activeSession }, { count: completedCount }, { count: activityCount }] = await Promise.all([
    supabase.from("assessment_results").select("total_score,category_scores,interpretation,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("assessment_sessions").select("id,current_question,answers,updated_at").eq("user_id", user.id).eq("status", "in_progress").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("activity_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const scores = (latestResult?.category_scores || {}) as { mind_fitness?: number; physical_wellbeing?: number };
  const answered = Array.isArray(activeSession?.answers) ? activeSession.answers.filter(Boolean).length : 0;

  return <main>
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">MY JOURNEY</p>
      <h1>Welcome back.</h1>
      <p className="lead">Your private space for assessments, activity, progress, reflections, resources, and the next practical step in your Shift Left journey.</p>
    </section>

    <nav className="journeyNav" aria-label="My Journey navigation">
      <Link href="/my-journey">Home</Link>
      <Link href="/my-journey/assessments">My Assessments</Link>
      <Link href="/my-journey/progress">My Progress</Link>
      <Link href="/my-journey/journal">My Journal</Link>
      <Link href="/my-journey/activity">My Activity</Link>
      <Link href="/resources">My Resources</Link>
      <Link href="/book">My Coaching</Link>
    </nav>

    <section className="memberDashboard">
      <div className="dashboardGrid">
        <article className="dashboardCard dashboardScoreCard">
          <p className="eyebrow">LATEST WELLBEING SCORE</p>
          {latestResult ? <>
            <div className="dashboardScore">{latestResult.total_score}%</div>
            <h2>{latestResult.interpretation}</h2>
            <p>Compared with the current educational benchmark of 80%.</p>
            <div className="miniScoreGrid">
              <div><span>Mind Fitness</span><strong>{scores.mind_fitness ?? 0}/50</strong></div>
              <div><span>Physical</span><strong>{scores.physical_wellbeing ?? 0}/50</strong></div>
            </div>
            <Link className="button secondary" href="/my-journey/progress">View my progress</Link>
          </> : <>
            <h2>Start with a baseline.</h2>
            <p>Complete the wellbeing assessment to establish your first score and unlock progress tracking.</p>
            <Link className="button primary" href="/wellbeing-assessment">Take the assessment</Link>
          </>}
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">MY ASSESSMENT</p>
          <h2>{activeSession ? "Continue where you left off." : "Ready for your next check-in?"}</h2>
          <p>{activeSession ? `${answered} answers saved. Resume from question ${activeSession.current_question + 1}.` : "Your answers are saved securely to your member account."}</p>
          <Link className="button primary" href="/wellbeing-assessment">{activeSession ? "Resume assessment" : "Start assessment"}</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">MY HISTORY</p>
          <h2>{completedCount || 0} completed assessment{completedCount === 1 ? "" : "s"}</h2>
          <p>Each completed assessment builds your personal trend view.</p>
          <Link className="button secondary" href="/my-journey/assessments">Open my assessment history</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">MY ACTIVITY</p>
          <h2>{activityCount || 0} saved activity entr{activityCount === 1 ? "y" : "ies"}</h2>
          <p>Track movement, steps, sleep, and recovery so you can notice patterns alongside assessment scores.</p>
          <Link className="button secondary" href="/my-journey/activity">Open my activity</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">MY REFLECTION</p>
          <h2>Capture what is happening now.</h2>
          <p>Use your private journal for mood check-ins, reflections, and patterns you want to notice earlier.</p>
          <Link className="button secondary" href="/my-journey/journal">Open my journal</Link>
        </article>
      </div>
    </section>
  </main>;
}
