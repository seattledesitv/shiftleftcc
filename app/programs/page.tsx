import Link from "next/link";

const programs = [
  {
    audience: "Individuals",
    title: "Shift Left Foundations",
    duration: "4-session coaching program",
    description: "Build a practical personal framework around continuous awareness, continuous learning, and continuous self-care.",
    outcomes: ["Recognize patterns and early signals", "Clarify priorities and next steps", "Create sustainable wellbeing practices"],
  },
  {
    audience: "Individuals",
    title: "Career Clarity & Transition",
    duration: "Single session or 4-session program",
    description: "Navigate career decisions, leadership transitions, job changes, setbacks, and the search for meaningful forward movement.",
    outcomes: ["Clarify the decision in front of you", "Identify strengths and constraints", "Develop a realistic transition plan"],
  },
  {
    audience: "Leaders",
    title: "Executive Wellbeing Coaching",
    duration: "Customized engagement",
    description: "A systems-thinking approach to leadership, resilience, energy, communication, and sustainable performance.",
    outcomes: ["Lead with greater awareness", "Reduce reactive patterns", "Build healthier operating rhythms"],
  },
  {
    audience: "Families",
    title: "Stronger Family Conversations",
    duration: "Single session or family series",
    description: "Create safer, more meaningful conversations between parents, teens, and family members before disconnection becomes crisis.",
    outcomes: ["Improve listening and communication", "Approach difficult topics earlier", "Create shared practices for connection"],
  },
  {
    audience: "Organizations",
    title: "Mental Fitness for Logical Minds",
    duration: "60–90 minute workshop",
    description: "A practical workshop translating familiar engineering and technology practices into tools for reflection, resilience, and wellbeing.",
    outcomes: ["Understand mental fitness through systems thinking", "Use proactive wellbeing practices", "Leave with practical tools and language"],
  },
  {
    audience: "Organizations",
    title: "The Shift Left Strategy Workshop",
    duration: "Half-day or full-day",
    description: "Help teams notice earlier, learn continuously, and care intentionally through a shared proactive wellbeing framework.",
    outcomes: ["Strengthen psychological safety", "Improve early communication", "Create practical team commitments"],
  },
];

export default function ProgramsPage() {
  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">PROGRAMS &amp; EXPERIENCES</p>
      <h1>Support designed for the moment you are in—and the future you want to build.</h1>
      <p className="lead">Begin with a discovery conversation. Together, we will identify the right coaching program, family experience, workshop, or organizational engagement.</p>
      <div className="actions"><Link href="/book" className="button primary">Book a free discovery call</Link><Link href="/how-it-works" className="button secondary">See how it works</Link></div>
    </section>

    <section className="audienceBand"><p className="eyebrow">CHOOSE YOUR PATH</p><div><Link href="#individuals">Individuals</Link><Link href="#families">Families</Link><Link href="/organizations">Organizations</Link><Link href="/consulting">Consulting</Link></div></section>

    <section className="offerings programCatalog" id="individuals">
      <div className="sectionHeading"><p className="eyebrow">CURRENT OFFERINGS</p><h2>Start with a focused program. Customize as needed.</h2></div>
      <div className="offeringGrid">
        {programs.map((program, index) => <article key={program.title} id={program.audience === "Families" ? "families" : undefined} className="offeringCard">
          <span className="cardNumber">{String(index + 1).padStart(2, "0")}</span>
          <p className="eyebrow">{program.audience}</p>
          <h3>{program.title}</h3>
          <p><strong>{program.duration}</strong></p>
          <p>{program.description}</p>
          <ul>{program.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          <Link href={`/book?program=${encodeURIComponent(program.title)}`}>Explore this program →</Link>
        </article>)}
      </div>
    </section>

    <section className="contentTeaser"><div><p className="eyebrow">FOR TEAMS, SCHOOLS &amp; COMMUNITIES</p><h2>Looking for an organizational engagement?</h2><p>Explore workshops, leadership programs, speaking, and customized experiences designed for companies, schools, universities, nonprofits, and community groups.</p></div><div className="contentLinks"><Link href="/organizations">Explore organizational solutions →</Link><Link href="/speaking">Speaking and workshops →</Link><Link href="/book">Discuss a custom engagement →</Link></div></section>

    <section className="consultingTeaser">
      <p className="eyebrow">NOT SURE WHERE TO BEGIN?</p>
      <h2>One conversation can clarify the next step.</h2>
      <p>The discovery call is a relaxed, no-pressure conversation about what you are navigating, what support may help, and whether Shift Left is the right fit.</p>
      <Link href="/book" className="button primary">Book your discovery call</Link>
    </section>
  </main>;
}
