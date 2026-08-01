import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import CheckpointForm from "./CheckpointForm";
import "../../../dashboard.css";

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/my-journey/goals/${id}`);

  const [{ data: goal }, { data: checkpoints }, { data: reviews }] = await Promise.all([
    supabase.from("member_goals").select("id,title,progress,status,why_it_matters,success_definition,target_date").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("goal_checkpoints").select("id,title,planned_date,status,confidence,reflection,next_step,completed_at").eq("goal_id", id).eq("user_id", user.id).order("display_order"),
    supabase.from("goal_reviews").select("id,review_type,progress,wins,challenges,lessons,next_actions,achievement_summary,reviewed_at").eq("goal_id", id).eq("user_id", user.id).order("reviewed_at", { ascending: false }),
  ]);

  if (!goal) notFound();

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · GOAL CHECKPOINTS</p><h1>{goal.title}</h1><p className="lead">Keep the goal alive through milestones, reflections, and periodic reviews.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link></nav>
    <section className="memberDashboard goalsWorkspace">
      <CheckpointForm goalId={goal.id} />
      <div className="historyList">
        <article className="dashboardCard"><p className="eyebrow">GOAL OVERVIEW</p><h2>{goal.progress}% complete · {goal.status}</h2>{goal.why_it_matters && <p><strong>Why:</strong> {goal.why_it_matters}</p>}{goal.success_definition && <p><strong>Success means:</strong> {goal.success_definition}</p>}<div className="goalTrack"><span style={{ width: `${goal.progress}%` }} /></div></article>
        {(checkpoints || []).map((checkpoint, index) => <article className="dashboardCard" key={checkpoint.id}><p className="eyebrow">CHECKPOINT {index + 1} · {checkpoint.status}</p><h2>{checkpoint.title}</h2>{checkpoint.planned_date && <p>Planned for {new Date(`${checkpoint.planned_date}T12:00:00`).toLocaleDateString()}</p>}{checkpoint.next_step && <p><strong>Next step:</strong> {checkpoint.next_step}</p>}{checkpoint.reflection && <p><strong>Reflection:</strong> {checkpoint.reflection}</p>}</article>)}
        {!checkpoints?.length && <div className="dashboardCard"><h2>No checkpoints yet.</h2><p>Add the first milestone that will show meaningful progress toward this goal.</p></div>}
        {(reviews || []).length > 0 && <div className="dashboardCard"><p className="eyebrow">GOAL REVIEWS</p><h2>{reviews?.length} recorded review{reviews?.length === 1 ? "" : "s"}</h2></div>}
      </div>
    </section>
  </main>;
}
