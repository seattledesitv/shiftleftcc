import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function MyJournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/journal");

  const { data: entries } = await supabase.from("journal_entries").select("id,mood,title,content,tags,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · MY JOURNAL</p><h1>Your private reflection space.</h1><p className="lead">Capture moments, moods, patterns, and lessons you want to notice earlier. The entry editor is the next Phase A feature.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">JOURNAL</p><h2>Private by design.</h2><p>Your entries are protected by Supabase row-level security and visible only to your account.</p></div>
      {(entries || []).map(entry => <article className="dashboardCard" key={entry.id}><p className="eyebrow">{new Date(entry.created_at).toLocaleDateString()} {entry.mood ? `· ${entry.mood}` : ""}</p><h2>{entry.title || "Reflection"}</h2><p>{entry.content}</p></article>)}
      {!entries?.length && <div className="dashboardCard"><h2>No journal entries yet.</h2><p>The journal writing form will be added next without changing this private history page.</p></div>}
    </div></section>
  </main>;
}
