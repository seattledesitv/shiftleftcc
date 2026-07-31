import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [{ data: latestResult }, { data: activeSession }, { count: completedCount }] = await Promise.all([
    supabase
      .from("assessment_results")
      .select("total_score,category_scores,interpretation,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("assessment_sessions")
      .select("id,current_question,answers,updated_at")
      .eq("user_id", user.id)
      .eq("status", "in_progress")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("assessment_results")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const scores = (latestResult?.category_scores || {}) as { mind_fitness?: number; physical_wellbeing?: number };
  const answered = Array.isArray(activeSession?.answers) ? activeSession.answers.filter(Boolean).length : 0;

  return <main>
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">MEMBER DASHBOARD</p>
      <h1>Welcome back.</h1>
      <p className="lead">Your private home for assessments, progress, reflections, resources, and the next practical step in your Shift Left journey.</p>
    </section>

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
            <Link className="button secondary" href="/progress">View progress</Link>
          </> : <>
            <h2>Start with a baseline.</h2>
            <p>Complete the native wellbeing assessment to establish your first score and unlock progress tracking.</p>
            <Link className="button primary" href="/wellbeing-assessment">Take the assessment</Link>
          </>}
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">ASSESSMENT</p>
          <h2>{activeSession ? "Continue where you left off." : "Ready for your next check-in?"}</h2>
          <p>{activeSession ? `${answered} answers saved. Resume from question ${activeSession.current_question + 1}.` : "Your answers can now be saved securely to your member account."}</p>
          <Link className="button primary" href="/wellbeing-assessment">{activeSession ? "Resume assessment" : "Start assessment"}</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">MY HISTORY</p>
          <h2>{completedCount || 0} completed assessment{completedCount === 1 ? "" : "s"}</h2>
          <p>Future assessments will build a trend view so you can see meaningful changes over time.</p>
          <Link className="button secondary" href="/progress">Open assessment history</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">REFLECT</p>
          <h2>Capture what is happening now.</h2>
          <p>The Phase A journal foundation is ready for private mood check-ins, reflections, and tags.</p>
          <Link className="button secondary" href="/journal-entry">Write a journal entry</Link>
        </article>

        <article className="dashboardCard">
          <p className="eyebrow">NEXT STEP</p>
          <h2>Use support intentionally.</h2>
          <p>Explore practical resources or start a conversation about your current results and goals.</p>
          <div className="actions"><Link className="button secondary" href="/resources">Resources</Link><Link className="button primary" href="/book">Book a call</Link></div>
        </article>
      </div>
    </section>
  </main>;
}
