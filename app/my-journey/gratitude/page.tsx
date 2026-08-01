import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import GratitudeForm from "./GratitudeForm";
import "../../dashboard.css";

export default async function GratitudePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/gratitude");

  const { data: entries } = await supabase.from("gratitude_entries")
    .select("id,entry_date,gratitude_one,gratitude_two,gratitude_three,highlight,appreciated_person")
    .eq("user_id", user.id).order("entry_date", { ascending: false }).limit(30);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · GRATITUDE</p><h1>Build a record of what matters.</h1><p className="lead">Capture gratitude, meaningful moments, and people you appreciate. Entries remain private to your account.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link><Link href="/my-journey/journal">Journal</Link><Link href="/my-journey/activity">Activity</Link></nav>
    <section className="memberDashboard goalsWorkspace">
      <GratitudeForm />
      <div className="historyList">
        <div className="dashboardCard"><p className="eyebrow">GRATITUDE HISTORY</p><h2>{entries?.length || 0} saved day{entries?.length === 1 ? "" : "s"}</h2></div>
        {(entries || []).map(entry => <article className="dashboardCard" key={entry.id}><p className="eyebrow">{new Date(`${entry.entry_date}T12:00:00`).toLocaleDateString()}</p><h2>{entry.highlight || "A grateful day"}</h2><p>• {entry.gratitude_one}</p>{entry.gratitude_two && <p>• {entry.gratitude_two}</p>}{entry.gratitude_three && <p>• {entry.gratitude_three}</p>}{entry.appreciated_person && <p><strong>Appreciating:</strong> {entry.appreciated_person}</p>}</article>)}
        {!entries?.length && <div className="dashboardCard"><h2>No gratitude entries yet.</h2><p>Save today’s first gratitude note.</p></div>}
      </div>
    </section>
  </main>;
}
