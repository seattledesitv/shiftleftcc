import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import GoalForm from "./GoalForm";
import "../../dashboard.css";

export default async function MyGoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/goals");

  const { data: goals } = await supabase.from("member_goals").select("id,title,category,target_date,status,progress,notes,created_at").eq("user_id", user.id).order("created_at", { ascending: false });

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY GOALS</p><h1>Small shifts, tracked intentionally.</h1><p className="lead">Create practical goals, notice progress, and focus on repeatable actions rather than changing everything at once.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link><Link href="/my-journey/activity">My Activity</Link><Link href="/my-journey/goals">My Goals</Link></nav>
    <section className="memberDashboard goalsWorkspace">
      <GoalForm />
      <div className="historyList">
        <div className="dashboardCard"><p className="eyebrow">ACTIVE GOALS</p><h2>{goals?.filter(goal => goal.status === "active").length || 0} goal{goals?.filter(goal => goal.status === "active").length === 1 ? "" : "s"} in progress</h2></div>
        {(goals || []).map(goal => <article className="dashboardCard" key={goal.id}><p className="eyebrow">{goal.category} · {goal.status}</p><h2>{goal.title}</h2><div className="goalTrack"><span style={{ width: `${goal.progress}%` }} /></div><p><strong>{goal.progress}% complete</strong>{goal.target_date ? ` · Target ${new Date(goal.target_date).toLocaleDateString()}` : ""}</p>{goal.notes && <p>{goal.notes}</p>}</article>)}
        {!goals?.length && <div className="dashboardCard"><h2>No goals yet.</h2><p>Create one focused goal to begin tracking your next practical shift.</p></div>}
      </div>
    </section>
  </main>;
}
