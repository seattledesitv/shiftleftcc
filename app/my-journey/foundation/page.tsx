import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import FoundationForms from "./FoundationForms";
import "../../dashboard.css";

export default async function FoundationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/foundation");

  const year = new Date().getFullYear();
  const [{ data: mission }, { data: vision }, { data: areas }] = await Promise.all([
    supabase.from("member_missions").select("statement,why_it_matters").eq("user_id", user.id).maybeSingle(),
    supabase.from("annual_visions").select("year,title,vision_statement,success_definition,why_it_matters").eq("user_id", user.id).eq("year", year).maybeSingle(),
    supabase.from("life_areas").select("id,name,description,icon").eq("is_active", true).order("display_order"),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">MY JOURNEY · PERSONAL FOUNDATION</p><h1>Mission first. Vision next. Goals with meaning.</h1><p className="lead">Define the direction that should guide your life decisions, then describe what meaningful progress looks like this year.</p></section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/vision-board">Vision Board</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link><Link href="/my-journey/progress">Progress</Link><Link href="/my-journey/journal">Journal</Link><Link href="/my-journey/activity">Activity</Link></nav>
    <section className="memberDashboard">
      <FoundationForms mission={mission} vision={vision} />
      <div className="dashboardCard" style={{maxWidth:"1250px",margin:"0 auto 36px"}}><p className="eyebrow">MAKE IT VISUAL</p><h2>Build a vision board from your annual vision.</h2><p>Add the life outcomes, experiences, relationships, and aspirations you want to keep visible. Then select from multiple themes and layouts to generate your board.</p><Link className="button primary" href="/my-journey/vision-board">Create my vision board</Link></div>
      <div className="lifeAreaSection">
        <p className="eyebrow">LIFE AREAS</p><h2>Use these areas as a balanced lens—not a rigid checklist.</h2>
        <div className="lifeAreaGrid">{(areas || []).map(area => <article className="dashboardCard" key={area.id}><div className="lifeAreaIcon">{area.icon || "•"}</div><h3>{area.name}</h3><p>{area.description}</p></article>)}</div>
      </div>
    </section>
  </main>;
}
