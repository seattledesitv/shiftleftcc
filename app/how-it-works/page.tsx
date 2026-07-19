import Link from "next/link";

const steps = [
  ["01", "Reach out and connect", "Begin with a conversation about what you, your team, or your organization is navigating and what meaningful progress would look like."],
  ["02", "Assessment and focus agreement", "We explore needs, challenges, audience, context, and goals, then agree on the areas where coaching, consulting, or workshops can create the greatest value."],
  ["03", "Enrollment and planning", "Together we confirm participants, format, timing, logistics, and any customization required so the experience fits naturally into your environment."],
  ["04", "Delivery and practice", "Interactive sessions translate the Shift Left Strategy into practical tools, reflection, conversation, and action—not information that disappears when the workshop ends."],
  ["05", "Evaluation and feedback", "We review the experience, gather feedback, identify next steps, and strengthen the practices that can support continuous improvement over time."],
];

export default function HowItWorksPage() {
  return <main>
    <section className="pageHero">
      <p className="eyebrow">HOW IT WORKS</p>
      <h1>A thoughtful process, customized around real people.</h1>
      <p className="lead">What if the next step toward stronger wellbeing, performance, and connection was not another generic program—but a plan designed around your actual needs?</p>
      <div className="actions"><Link className="button primary" href="/#contact">Start the conversation</Link><Link className="button secondary" href="/for-who">See who it is for</Link></div>
    </section>

    <section className="processSection">
      <div className="sectionHeading"><p className="eyebrow">THE FIVE-STEP PROCESS</p><h2>From first conversation to practical follow-through.</h2></div>
      <div className="processGrid">{steps.map(([number,title,copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="consultingCta">
      <p className="eyebrow">CUSTOMIZED, PRACTICAL, HUMAN</p>
      <h2>Every engagement begins by listening.</h2>
      <p>The method stays consistent—notice earlier, learn continuously, and care intentionally—but the experience is shaped around your audience, goals, culture, and context.</p>
      <div className="actions"><Link className="button primary" href="/#contact">Book a discovery call</Link><Link className="button secondary" href="/why-shift-left">Explore the strategy</Link></div>
    </section>
  </main>;
}
