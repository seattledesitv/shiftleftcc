import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import JournalForm from "./JournalForm";
import "../../dashboard.css";

export default async function MyJournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/journal");

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id,mood,title,content,tags,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return <main>
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">MY JOURNEY · MY JOURNAL</p>
      <h1>Your private reflection space.</h1>
      <p className="lead">Capture moments, moods, patterns, and lessons you want to notice earlier. Your journal is visible only to your account.</p>
    </section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/assessments">My Assessments</Link><Link href="/my-journey/progress">My Progress</Link><Link href="/my-journey/journal">My Journal</Link></nav>
    <section className="memberDashboard journalWorkspace">
      <JournalForm />
      <div className="historyList">
        <div className="dashboardCard"><p className="eyebrow">MY REFLECTION HISTORY</p><h2>{entries?.length || 0} saved entr{entries?.length === 1 ? "y" : "ies"}</h2><p>Return over time to notice recurring signals, strengths, and opportunities to shift earlier.</p></div>
        {(entries || []).map(entry => <article className="dashboardCard journalEntry" key={entry.id}>
          <p className="eyebrow">{new Date(entry.created_at).toLocaleDateString()} {entry.mood ? `· ${entry.mood}` : ""}</p>
          <h2>{entry.title || "Reflection"}</h2>
          <p>{entry.content}</p>
          {Array.isArray(entry.tags) && entry.tags.length > 0 && <div className="entryTags">{entry.tags.map((tag: string) => <span key={tag}>{tag}</span>)}</div>}
        </article>)}
        {!entries?.length && <div className="dashboardCard"><h2>No journal entries yet.</h2><p>Use the check-in form to save your first private reflection.</p></div>}
      </div>
    </section>
  </main>;
}
