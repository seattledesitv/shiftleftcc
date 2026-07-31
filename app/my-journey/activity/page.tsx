import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import ActivityForm from "./ActivityForm";
import "../../dashboard.css";

export default async function MyActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/activity");

  const { data: entries } = await supabase
    .from("activity_entries")
    .select("id,activity_date,activity_type,duration_minutes,steps,sleep_hours,recovery_score,notes,source")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(30);

  const totalMinutes = (entries || []).reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);
  const totalSteps = (entries || []).reduce((sum, entry) => sum + (entry.steps || 0), 0);
  const sleepEntries = (entries || []).filter(entry => entry.sleep_hours != null);
  const averageSleep = sleepEntries.length ? sleepEntries.reduce((sum, entry) => sum + Number(entry.sleep_hours), 0) / sleepEntries.length : 0;

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY ACTIVITY</p><h1>Notice how movement and recovery support your wellbeing.</h1><p className="lead">Track exercise, steps, sleep, and recovery manually today. The data model is ready for future Apple Health, Health Connect, Fitbit, or Google Health synchronization.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link><Link href="/my-journey/activity">My Activity</Link></nav>
    <section className="memberDashboard journalWorkspace">
      <ActivityForm />
      <div className="historyList">
        <div className="progressSummary">
          <article className="dashboardCard"><p className="eyebrow">RECENT ACTIVITY</p><h2>{totalMinutes} minutes</h2><p>{totalSteps.toLocaleString()} steps across the latest {entries?.length || 0} entries.</p></article>
          <article className="dashboardCard"><p className="eyebrow">RECOVERY</p><h2>{averageSleep ? `${averageSleep.toFixed(1)} hours` : "No sleep data"}</h2><p>Average sleep across entries where sleep was recorded.</p></article>
        </div>
        {(entries || []).map(entry => <article className="dashboardCard activityEntry" key={entry.id}>
          <div><p className="eyebrow">{new Date(`${entry.activity_date}T12:00:00`).toLocaleDateString()} · {entry.source.replaceAll("_", " ")}</p><h2>{entry.activity_type.charAt(0).toUpperCase() + entry.activity_type.slice(1)}</h2><p>{entry.notes || "No notes added."}</p></div>
          <div className="activityMetrics">{entry.duration_minutes != null && <span>{entry.duration_minutes} min</span>}{entry.steps != null && <span>{entry.steps.toLocaleString()} steps</span>}{entry.sleep_hours != null && <span>{entry.sleep_hours} h sleep</span>}{entry.recovery_score != null && <span>Recovery {entry.recovery_score}/5</span>}</div>
        </article>)}
        {!entries?.length && <div className="dashboardCard"><h2>No activity entries yet.</h2><p>Add your first manual check-in above.</p></div>}
      </div>
    </section>
  </main>;
}
