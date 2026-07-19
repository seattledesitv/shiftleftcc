import Link from "next/link";

const practices = [
  ["01", "Continuous Awareness", "Notice earlier.", "Develop emotional, somatic, and situational awareness. Recognize patterns, stress signals, needs, and choices before they become harder to manage."],
  ["02", "Continuous Learning", "Grow continuously.", "Treat challenges as information. Build a growth mindset, balance ego and empathy, invite feedback, and keep developing the skills needed for change."],
  ["03", "Continuous Self-Care", "Maintain before repair.", "Create sustainable habits for energy, boundaries, sleep, relationships, reflection, and recovery. Self-care becomes routine maintenance—not an emergency response."],
];

const applications = [
  ["Individuals", "Build practical mental fitness, self-awareness, resilience, and confidence before life demands them."],
  ["Families", "Create earlier, safer conversations and stronger patterns of listening, empathy, and connection."],
  ["Schools", "Equip students, educators, and families with proactive wellbeing practices and shared language."],
  ["Organizations", "Reduce preventable friction and strengthen psychological safety, engagement, adaptability, and wellbeing."],
];

export default function WhyShiftLeftPage(){return <main>
  <section className="strategyHero"><p className="eyebrow">THE SHIFT LEFT STRATEGY</p><h1>Why wait until people break before we help them?</h1><p className="lead">Technology teams shift left to detect and resolve issues earlier. Shift Left Coaching applies the same proactive principle to human wellbeing.</p><div className="actions"><a className="button primary" href="#framework">Explore the framework</a><Link className="button secondary" href="/my-story">Read the founder story</Link></div></section>
  <section className="shiftComparison"><article><span>Reactive model</span><h2>Pressure → Crisis → Recovery</h2><p>Support often begins only after stress, disconnection, burnout, or conflict has intensified.</p></article><strong>SHIFT LEFT</strong><article><span>Proactive model</span><h2>Notice → Learn → Care</h2><p>Practical habits and support begin earlier, strengthening resilience and widening the range of healthy choices.</p></article></section>
  <section className="framework" id="framework"><div className="sectionHeading"><p className="eyebrow">THREE CONTINUOUS PRACTICES</p><h2>The Shift Left framework for lifelong wellbeing.</h2></div><div className="practiceGrid">{practices.map(([n,title,line,copy])=><article key={title}><span>{n}</span><h3>{title}</h3><strong>{line}</strong><p>{copy}</p></article>)}</div></section>
  <section className="strategyPrinciple"><p className="eyebrow">THE CORE IDEA</p><h2>Prevention is not the absence of difficulty. It is the presence of capacity.</h2><p>Shift Left does not promise a life without challenges. It helps people and systems build awareness, language, skills, support, and recovery practices before those challenges become crises.</p></section>
  <section className="applicationSection"><div className="sectionHeading"><p className="eyebrow">WHERE IT APPLIES</p><h2>One strategy. Different human systems.</h2></div><div className="applicationGrid">{applications.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="consultingCta"><p className="eyebrow">NOTICE EARLIER. LEARN CONTINUOUSLY. CARE INTENTIONALLY.</p><h2>Bring the Shift Left Strategy into your life or organization.</h2><div className="actions"><Link className="button primary" href="/#contact">Book a discovery call</Link><Link className="button secondary" href="/speaking">Explore speaking</Link></div></section>
</main>}