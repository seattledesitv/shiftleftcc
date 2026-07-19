import Link from "next/link";

const audiences = [
  ["People who value a proactive approach", "You want to notice patterns and address challenges before they become major roadblocks. Shift Left helps you build capacity earlier rather than waiting for a breaking point."],
  ["People seeking holistic development", "You understand that growth involves more than a single skill. The framework connects continuous awareness, continuous learning, and continuous self-care."],
  ["Families ready for earlier conversations", "You want to create safer, more meaningful conversations, especially with teens, before silence, misunderstanding, or stress becomes harder to repair."],
  ["Leaders building healthier teams", "You want to strengthen empathy, communication, psychological safety, adaptability, and sustainable performance—not simply respond after burnout appears."],
  ["Organizations navigating change", "Your people are experiencing stress, isolation, work-life imbalance, perfectionism, impostor feelings, or change fatigue, and you want a practical shared framework."],
  ["Logical and systems-oriented minds", "Traditional wellbeing language may not always resonate. Shift Left uses familiar ideas such as early detection, feedback loops, continuous improvement, and preventive maintenance."],
];

export default function ForWhoPage() {
  return <main>
    <section className="pageHero">
      <p className="eyebrow">WHO IT IS FOR</p>
      <h1>For people and systems that believe earlier is better.</h1>
      <p className="lead">Shift Left Coaching &amp; Consulting is designed for individuals, families, schools, technology professionals, leaders, and organizations ready to move from reactive support toward proactive wellbeing.</p>
    </section>

    <section className="contentPage">
      <div className="sectionHeading"><p className="eyebrow">A STRONG FIT WHEN...</p><h2>You want practical growth before preventable challenges escalate.</h2></div>
      <div className="contentGrid">{audiences.map(([title,copy]) => <article className="contentCard" key={title}><span className="tag">SHIFT LEFT FIT</span><h2>{title}</h2><p>{copy}</p></article>)}</div>
    </section>

    <section className="strategyPrinciple">
      <p className="eyebrow">NOT A ONE-SIZE-FITS-ALL PROGRAM</p>
      <h2>The framework is shared. The path is personal.</h2>
      <p>Every person, family, team, and organization has a different starting point. The work begins with listening, understanding context, and selecting practices that are realistic, respectful, and useful.</p>
    </section>

    <section className="consultingCta">
      <p className="eyebrow">EXPLORE THE NEXT STEP</p>
      <h2>See how the Shift Left process can be shaped around your needs.</h2>
      <div className="actions"><Link className="button primary" href="/how-it-works">How it works</Link><Link className="button secondary" href="/#contact">Start a conversation</Link></div>
    </section>
  </main>;
}
