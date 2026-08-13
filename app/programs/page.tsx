import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "../../lib/supabase/server";
import { seoMetadata } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata("/programs", {
    title: "Online Coaching Programs | Career, Leadership, Family & Mental Fitness",
    description: "Explore online coaching programs for career clarity, leadership wellbeing, family communication and mental fitness. Purchase fixed-price programs directly or request a customized engagement.",
    keywords: ["online coaching programs", "career coaching", "leadership coaching", "family coaching", "mental fitness coaching"],
  });
}

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
    <section className="pageHero compactHero"><p className="eyebrow">PROGRAMS &amp; EXPERIENCES</p><h1>Choose the support that fits—and start directly.</h1><p className="lead">All coaching programs are available online and delivered virtually, so you can participate from anywhere. Fixed-price programs can be purchased securely online; customized engagements can begin with a discovery conversation.</p><div className="actions"><Link href="#program-catalog" className="button primary">Explore programs</Link><Link href="/book" className="button secondary">Need something customized?</Link></div></section>

    <section className="audienceBand"><p className="eyebrow">100% ONLINE COACHING AVAILABLE</p><div><span>Virtual sessions</span><span>Flexible scheduling</span><span>U.S. &amp; international clients</span><span>Zoom or Microsoft Teams</span></div></section>

    <section className="offerings programCatalog" id="program-catalog"><div className="sectionHeading"><p className="eyebrow">CURRENT OFFERINGS</p><h2>Purchase a defined online program—or customize the experience.</h2></div><div className="offeringGrid">
      {(programs || []).map((program, index) => {
        const direct = program.purchase_enabled && program.pricing_mode === "fixed" && (program.price_amount || 0) > 0;
        return <article key={program.slug} className="offeringCard"><span className="cardNumber">{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">{program.audience} · ONLINE</p><h3>{program.title}</h3><p><strong>{program.duration_label}</strong></p><p>{program.description}</p><p><strong>Format:</strong> Virtual coaching via Zoom or Microsoft Teams</p><ul>{(outcomes[program.slug] || []).map(item => <li key={item}>{item}</li>)}</ul>
          {direct ? <><p><strong>${((program.price_amount || 0) / 100).toFixed(2)}</strong></p><Link className="button primary" href={`/checkout/program/${program.slug}`}>Buy &amp; book this online program</Link></> : <Link href={`/book?program=${encodeURIComponent(program.title)}`}>{program.pricing_mode === "custom" ? "Request a customized online program →" : "Ask about this online program →"}</Link>}
        </article>;
      })}
    </div></section>

    <section className="contentTeaser"><div><p className="eyebrow">FOR TEAMS, SCHOOLS &amp; COMMUNITIES</p><h2>Need something designed around your organization?</h2><p>Customized virtual workshops, leadership programs, speaking, and organizational experiences are available online. In-person delivery can be discussed separately when appropriate.</p></div><div className="contentLinks"><Link href="/organizations">Explore organizational solutions →</Link><Link href="/speaking">Speaking and workshops →</Link><Link href="/book">Discuss a custom engagement →</Link></div></section>

    <section className="consultingTeaser"><p className="eyebrow">NEED A CUSTOMIZED OPTION?</p><h2>Tell us what you are trying to achieve.</h2><p>If the listed programs do not quite fit, book a complimentary online discovery call and we can shape the scope, number of sessions, audience, and engagement around your needs.</p><Link href="/book" className="button primary">Book an online discovery call</Link></section>
  </main>;
}
