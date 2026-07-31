import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

export default async function StudioAssessmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/assessments");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const [{ data: templates }, { data: questions }, { count: resultCount }] = await Promise.all([
    supabase.from("assessment_templates").select("id,slug,title,description,version,is_active,updated_at").order("created_at", { ascending: true }),
    supabase.from("assessment_questions").select("id,template_id,question_text,display_order,is_active").order("display_order", { ascending: true }),
    supabase.from("assessment_results").select("id", { count: "exact", head: true }),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · ASSESSMENTS</p><h1>Assessment management.</h1><p className="lead">Review active templates and questions. Editing controls will build on this configurable foundation without hardcoding assessment content.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">PLATFORM TOTALS</p><h2>{templates?.length || 0} template{templates?.length === 1 ? "" : "s"} · {questions?.length || 0} questions · {resultCount || 0} completed results</h2></div>
      {(templates || []).map(template => {
        const templateQuestions = (questions || []).filter(question => question.template_id === template.id);
        return <article className="dashboardCard" key={template.id}>
          <p className="eyebrow">{template.is_active ? "ACTIVE" : "INACTIVE"} · VERSION {template.version}</p>
          <h2>{template.title}</h2>
          <p>{template.description}</p>
          <div className="questionAdminList">
            {templateQuestions.map(question => <div key={question.id}><strong>{question.display_order}.</strong><span>{question.question_text}</span><small>{question.is_active ? "Active" : "Inactive"}</small></div>)}
          </div>
          <div className="actions"><Link className="button secondary" href="/wellbeing-assessment">Preview assessment</Link></div>
        </article>;
      })}
      {!templates?.length && <div className="dashboardCard"><h2>No assessment templates found.</h2><p>Run the Phase A migrations in Supabase to seed the first configurable assessment.</p></div>}
    </div></section>
  </main>;
}
