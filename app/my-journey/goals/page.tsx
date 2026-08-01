import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import GoalForm from "./GoalForm";
import "../../dashboard.css";

export default async function MyGoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/goals");

  const [{ data: goals }, { data: lifeAreas }, { data: visions }] = await Promise.all([
    supabase.from("member_goals")
      .select("id,title,category,target_date,status,progress,notes,why_it_matters,success_definition,priority,life_area_id,vision_id,created_at")
      .eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("life_areas").select("id,name,icon").eq("is_active", true).order("display_order"),
    supabase.from("annual_visions").select("id,year,title").eq("user_id", user.id).order("year", { ascending: false }),
  ]);

  const areaMap = new Map((lifeAreas || []).map(area => [area.id, `${area.icon || ""} ${area.name}`.trim()]));
  const visionMap = new Map((visions || []).map(vision => [vision.id, `${vision.year} · ${vision.title || "Annual Vision"}`]));

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · LIFE GOALS</p><h1>Turn your annual vision into meaningful outcomes.</h1><p className="lead">Create goals for the life you want to build—not only habits. Define why each goal matters, what success means, and the checkpoints that will keep it alive through the year.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link><Link href="/my-journey/journal">Journal</Link><Link href="/my-journey/activity">Activity</Link></nav>
    <section className="memberDashboard goalsWorkspace">
      <GoalForm lifeAreas={(lifeAreas || []).map(area => ({ id: area.id, label: `${area.icon || ""} ${area.name}`.trim() }))} visions={(visions || []).map(vision => ({ id: vision.id, label: `${vision.year} · ${vision.title || "Annual Vision"}` }))} />
      <div className="historyList">
        <div className="dashboardCard"><p className="eyebrow">ACTIVE LIFE GOALS</p><h2>{goals?.filter(goal => goal.status === "active").length || 0} goal{goals?.filter(goal => goal.status === "active").length === 1 ? "" : "s"} in progress</h2></div>
        {(goals || []).map(goal => <article className="dashboardCard" key={goal.id}>
          <p className="eyebrow">{goal.life_area_id ? areaMap.get(goal.life_area_id) : goal.category} · Priority {goal.priority} · {goal.status}</p>
          <h2>{goal.title}</h2>
          {goal.vision_id && <p><strong>Vision:</strong> {visionMap.get(goal.vision_id)}</p>}
          {goal.why_it_matters && <p><strong>Why it matters:</strong> {goal.why_it_matters}</p>}
          {goal.success_definition && <p><strong>Success means:</strong> {goal.success_definition}</p>}
          <div className="goalTrack"><span style={{ width: `${goal.progress}%` }} /></div>
          <p><strong>{goal.progress}% complete</strong>{goal.target_date ? ` · Target ${new Date(`${goal.target_date}T12:00:00`).toLocaleDateString()}` : ""}</p>
          {goal.notes && <p>{goal.notes}</p>}
          <Link className="button secondary" href={`/my-journey/goals/${goal.id}`}>Open checkpoints & reviews</Link>
        </article>)}
        {!goals?.length && <div className="dashboardCard"><h2>No life goals yet.</h2><p>Create a meaningful annual outcome and connect it to your vision.</p></div>}
      </div>
    </section>
  </main>;
}
