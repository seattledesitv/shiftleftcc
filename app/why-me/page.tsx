import Image from "next/image";
import Link from "next/link";

const strengths = [
  ["Lived resilience", "Personal transitions, setbacks, relocation, and career disruption shaped an approach grounded in reality—not theory alone."],
  ["Corporate leadership", "More than two decades across technology and program leadership bring practical understanding of modern work, change, teams, and organizational systems."],
  ["Analytical foundation", "Engineering, project management, and strategy education support a structured approach to goals, obstacles, patterns, and measurable progress."],
  ["Human-centered practice", "Training in NLP, life coaching, Reiki, mental-health first aid, mindfulness, stress management, and empathy informs a holistic coaching style."],
  ["Community builder", "Years of mentoring and community leadership reinforce the belief that wellbeing grows through belonging, shared purpose, and meaningful connection."],
  ["Author and speaker", "Bharath translates complex ideas into accessible frameworks through books, workshops, speaking, and practical tools for individuals and organizations."],
];

export default function WhyMePage(){return <main>
<section className="whyMeHero"><div><p className="eyebrow">WHY WORK WITH ME?</p><h1>Systems thinking, lived experience, and human connection.</h1><p className="lead">I created the Shift Left Strategy by bringing together what life taught me, what technology taught me, and what years of coaching, leadership, research, and community work continue to teach me.</p><div className="actions"><Link className="button primary" href="/programs">Explore programs</Link><Link className="button secondary" href="/book">Book a discovery call</Link></div></div><Image src="/f2ofujurrbr95cdsjtghjkqlu8._SY600_.jpg" alt="Bharath Kumar Arekapudi" width={430} height={430} priority /></section>
<section className="trustGrid">{strengths.map(([title,copy])=><article key={title}><h2>{title}</h2><p>{copy}</p></article>)}</section>
<section className="supportSplit"><div><p className="eyebrow">HOW I WORK</p><h2>Personalized guidance. Honest reflection. Practical movement.</h2></div><div><h3>Empathy and understanding</h3><p>Every person’s circumstances are different. I listen for the story beneath the problem and create a safe, respectful space for reflection without judgment.</p><h3>Structured and analytical</h3><p>We clarify what matters, identify patterns and obstacles, define realistic goals, and translate insight into actions that fit your life or organization.</p><h3>Future-focused and empowering</h3><p>The goal is not dependence on a coach. It is helping you build awareness, confidence, tools, and practices you can continue using.</p></div></section>
<section className="offerBand"><p className="eyebrow">WHAT I CAN OFFER</p><h2>Coaching for wellbeing, life transitions, career clarity, leadership, and organizational growth.</h2><p>Sessions and programs can cultivate self-awareness, balance ego and empathy, strengthen a growth mindset, improve communication, and support proactive mental fitness.</p><div className="actions"><Link className="button primary" href="/programs">Explore programs</Link><Link className="button secondary" href="/consulting">Explore consulting</Link></div></section>
</main>}