import Link from "next/link";

const solutions = [
  {
    title: "Mental Fitness for Logical Minds",
    format: "60–90 minute keynote or workshop",
    body: "Translate familiar engineering and technology practices into practical tools for resilience, reflection, communication, and proactive wellbeing.",
    items: ["Shift-left thinking for wellbeing", "Feedback loops and early signals", "Practical tools for logical minds"],
  },
  {
    title: "The Shift Left Strategy Workshop",
    format: "Half-day or full-day experience",
    body: "Create a shared language for noticing earlier, learning continuously, and caring intentionally across teams and leadership groups.",
    items: ["Psychological safety", "Earlier communication", "Team commitments and operating rhythms"],
  },
  {
    title: "Leadership & Team Wellbeing",
    format: "Workshop series or coaching engagement",
    body: "Help leaders strengthen empathy, reduce reactive patterns, and build healthier systems for performance, communication, and sustainable growth.",
    items: ["Leader awareness", "Healthy accountability", "Resilient team culture"],
  },
  {
    title: "Custom School & Community Programs",
    format: "Customized talks, workshops, and facilitated conversations",
    body: "Design age-appropriate, culturally responsive experiences for schools, universities, nonprofits, and community organizations.",
    items: ["Mental-health awareness", "Parent and youth conversations", "Community resilience"],
  },
];

export default function OrganizationsPage() {
  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">FOR ORGANIZATIONS</p>
      <h1>Build healthier people, stronger teams, and more proactive systems.</h1>
      <p className="lead">Shift Left brings systems thinking and human wellbeing together through keynotes, workshops, leadership coaching, and customized programs for companies, schools, nonprofits, and communities.</p>
      <div className="actions"><Link href="/book" className="button primary">Discuss an organizational engagement</Link><Link href="/speaking" className="button secondary">Explore speaking topics</Link></div>
    </section>

    <section className="intro"><p className="eyebrow">WHY SHIFT LEFT AT WORK?</p><div><h2>Do not wait for burnout, conflict, or disengagement to become a crisis.</h2><p>Organizations often respond after people are already overwhelmed. The Shift Left approach helps teams recognize early signals, strengthen communication, build psychological safety, and create practical habits that support sustainable performance.</p></div></section>

    <section className="offerings programCatalog">
      <div className="sectionHeading"><p className="eyebrow">ORGANIZATIONAL SOLUTIONS</p><h2>Flexible experiences shaped around your audience and goals.</h2></div>
      <div className="offeringGrid">{solutions.map((solution, index) => <article key={solution.title} className="offeringCard"><span className="cardNumber">{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">ORGANIZATIONS</p><h3>{solution.title}</h3><p><strong>{solution.format}</strong></p><p>{solution.body}</p><ul>{solution.items.map((item) => <li key={item}>{item}</li>)}</ul><Link href={`/book?program=${encodeURIComponent(solution.title)}`}>Discuss this option →</Link></article>)}</div>
    </section>

    <section className="audienceBand"><p className="eyebrow">DESIGNED FOR</p><div><span>Technology teams</span><span>Corporate leaders</span><span>Schools</span><span>Universities</span><span>Nonprofits</span><span>Community organizations</span></div></section>

    <section className="supportSplit"><div><p className="eyebrow">A PRACTICAL PROCESS</p><h2>Start with the outcome—not a prepackaged presentation.</h2></div><div><h3>1. Discovery</h3><p>Clarify your audience, goals, current challenges, timing, and the change you want the experience to support.</p><h3>2. Design</h3><p>Select or customize the right keynote, workshop, coaching series, or consulting engagement.</p><h3>3. Delivery</h3><p>Create an engaging, practical experience with relevant stories, frameworks, reflection, and action.</p><h3>4. Continuity</h3><p>Support the learning with follow-up tools, leadership conversations, or a longer-term program when useful.</p></div></section>

    <section className="consultingTeaser"><p className="eyebrow">START THE CONVERSATION</p><h2>Let us design the right experience for your people.</h2><p>Share your audience, goals, and timing. We will recommend a practical format and next step.</p><Link href="/book" className="button primary">Book an organizational discovery call</Link></section>
  </main>;
}
