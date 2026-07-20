import Image from "next/image";
import Link from "next/link";

const chapters = [
  ["01", "Early life and challenges", "Born in Andhra Pradesh, India, Bharath grew up surrounded by familiar friendships before relocating within South India. Adapting to a new language, school system, and changing homes taught him resilience, curiosity, and the ability to build connection wherever life placed him."],
  ["02", "Change and overcoming struggles", "His journey later moved through Pune and Dublin. Financial strain, personal setbacks, cultural transitions, and emotional struggles tested him repeatedly. Rather than resist change, he learned to work with it, rebuild, and create community initiatives that brought thousands of people together."],
  ["03", "Building the foundation", "More than two decades in technology, leadership, and program management gave Bharath a systems mindset. An engineering degree, a master’s in project management, an MBA in strategy, and training in NLP, Reiki, coaching, and mental-health first aid helped him connect analytical thinking with human wellbeing."],
  ["04", "Setbacks and personal growth", "Career disruptions and layoffs challenged his sense of security, but they also created space for reflection. Those experiences strengthened his conviction that people need practical tools before a crisis—not only after life becomes overwhelming."],
  ["05", "The birth of Shift Left", "In technology, shifting left means identifying and addressing problems earlier. Bharath asked a simple question: why not apply the same thinking to wellbeing? That question became the Shift Left Strategy—a proactive approach built around continuous awareness, continuous learning, and continuous self-care."],
  ["06", "Passion, belief, and drive", "Bharath is driven by helping people discover strengths and possibilities they may not yet see. He brings empathy, intuitive listening, structured problem-solving, and lived experience to coaching, consulting, speaking, and community work."],
];

export default function MyStoryPage() {
  return <main>
    <section className="storyHero">
      <div><p className="eyebrow">THE STORY OF THE SHIFT LEFT COACH</p><h1>Every strategy begins with a story.</h1><p className="lead">A journey through change, technology, leadership, community, and the belief that support should begin before the breaking point.</p><div className="actions"><Link className="button primary" href="/why-shift-left">Discover the strategy</Link><Link className="button secondary" href="/book">Book a discovery call</Link></div></div>
      <figure><Image src="/f2ofujurrbr95cdsjtghjkqlu8._SY600_.jpg" alt="Bharath Kumar Arekapudi" width={520} height={520} priority /><figcaption><strong>Bharath Kumar Arekapudi</strong><span>Founder, Shift Left Coaching &amp; Consulting</span></figcaption></figure>
    </section>
    <section className="storyIntro"><p className="eyebrow">FROM EXPERIENCE TO METHOD</p><h2>Resilience was not a concept I studied. It was something life kept asking me to practice.</h2></section>
    <section className="storyTimeline">{chapters.map(([number,title,copy]) => <article key={title}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</section>
    <section className="founderEquation"><p className="eyebrow">THE FOUNDATION</p><h2>Engineering + Leadership + Coaching + Community</h2><p>Shift Left brings systems thinking and human connection together—so individuals and organizations can notice earlier, learn continuously, and care intentionally.</p><Link className="button primary" href="/why-me">Why work with me</Link></section>
  </main>;
}
