import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

const outcomes: Record<string, string[]> = {
  "shift-left-foundations": ["Recognize patterns and early signals", "Clarify priorities and next steps", "Create sustainable wellbeing practices"],
  "career-clarity-transition": ["Clarify the decision in front of you", "Identify strengths and constraints", "Develop a realistic transition plan"],
  "executive-wellbeing-coaching": ["Lead with greater awareness", "Reduce reactive patterns", "Build healthier operating rhythms"],
  "stronger-family-conversations": ["Improve listening and communication", "Approach difficult topics earlier", "Create shared practices for connection"],
  "mental-fitness-logical-minds": ["Understand mental fitness through systems thinking", "Use proactive wellbeing practices", "Leave with practical tools and language"],
  "shift-left-strategy-workshop": ["Strengthen psychological safety", "Improve early communication", "Create practical team commitments"],
};

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase.from("commerce_products").select("slug,audience,title,description,duration_label,price_amount,pricing_mode,purchase_enabled").in("product_type", ["program","coaching","workshop"]).eq("status","active").order("display_order");

  return <main>
    <section className="pageHero compactHero"><p className="eyebrow">PROGRAMS &amp; EXPERIENCES</p><h1>Choose the support that fits—and start directly.</h1><p className="lead">Fixed-price programs can be purchased securely online. If you need a customized engagement, use the discovery conversation and we will shape it around your needs.</p><div className="actions"><Link href="#program-catalog" className="button primary">Explore programs</Link><Link href="/book" className="button secondary">Need something customized?</Link></div></section>

    <section className="audienceBand"><p className="eyebrow">CHOOSE YOUR PATH</p><div><Link href="#program-catalog">Individuals</Link><Link href="#program-catalog">Families</Link><Link href="/organizations">Organizations</Link><Link href="/consulting">Consulting</Link></div></section>

    <section className="offerings programCatalog" id="program-catalog"><div className="sectionHeading"><p className="eyebrow">CURRENT OFFERINGS</p><h2>Purchase a defined program—or customize the experience.</h2></div><div className="offeringGrid">
      {(programs || []).map((program, index) => {
        const direct = program.purchase_enabled && program.pricing_mode === "fixed" && (program.price_amount || 0) > 0;
        return <article key={program.slug} className="offeringCard"><span className="cardNumber">{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">{program.audience}</p><h3>{program.title}</h3><p><strong>{program.duration_label}</strong></p><p>{program.description}</p><ul>{(outcomes[program.slug] || []).map(item => <li key={item}>{item}</li>)}</ul>
          {direct ? <><p><strong>${((program.price_amount || 0) / 100).toFixed(2)}</strong></p><Link className="button primary" href={`/checkout/program/${program.slug}`}>Buy &amp; book this program</Link></> : <Link href={`/book?program=${encodeURIComponent(program.title)}`}>{program.pricing_mode === "custom" ? "Request a customized program →" : "Ask about this program →"}</Link>}
        </article>;
      })}
    </div></section>

    <section className="contentTeaser"><div><p className="eyebrow">FOR TEAMS, SCHOOLS &amp; COMMUNITIES</p><h2>Need something designed around your organization?</h2><p>Customized workshops, leadership programs, speaking, and organizational experiences remain available through a discovery conversation.</p></div><div className="contentLinks"><Link href="/organizations">Explore organizational solutions →</Link><Link href="/speaking">Speaking and workshops →</Link><Link href="/book">Discuss a custom engagement →</Link></div></section>

    <section className="consultingTeaser"><p className="eyebrow">NEED A CUSTOMIZED OPTION?</p><h2>Tell us what you are trying to achieve.</h2><p>If the listed programs do not quite fit, book a discovery call and we can shape the scope, number of sessions, audience, and engagement around your needs.</p><Link href="/book" className="button primary">Book a discovery call</Link></section>
  </main>;
}
