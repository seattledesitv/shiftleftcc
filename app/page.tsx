import Image from "next/image";
import Link from "next/link";

const offerings = [
  { number: "01", title: "Individual", heading: "Clarity, confidence, and forward movement.", body: "Personal coaching for transitions, career decisions, emotional wellbeing, purpose, mindset, and sustainable growth.", items: ["Life and wellness coaching", "Career clarity", "Resilience and habits", "Purpose and transitions"] },
  { number: "02", title: "Family", heading: "Create space for conversations that matter.", body: "Guided support for families who want to connect earlier, listen better, and spark meaningful conversations with teens.", items: ["Sparking teen conversations", "Parent–teen communication", "Family reflection sessions", "Tools for difficult moments"] },
  { number: "03", title: "Organizations", heading: "Healthier people. Stronger teams. Better systems.", body: "Workshops, coaching, and consulting that strengthen empathy, communication, psychological safety, and resilience.", items: ["Leadership and team coaching", "Mental wellness workshops", "Empathy programs", "Culture consulting"] },
];

const logoDetails = [
  ["green", "The green figure", "Represents a person equipped with self-awareness, resilience, empathy, and practical mental-wellness strategies."],
  ["blue", "The blue figure", "Represents a person still discovering tools, support, and possibility on their wellbeing journey."],
  ["infinity", "The infinity loop", "Symbolizes continuous growth, healing, learning, and the movement between giving and receiving support."],
  ["shift", "Shift left", "Represents noticing, preparing, and acting earlier—before challenges intensify into crises."],
  ["connection", "The connection", "Coaching and consulting begin with human connection, empathy, listening, and walking alongside people and communities."],
  ["balance", "The balance", "Brings wellbeing, practical action, creativity, and community impact together in a meaningful way."],
];

export default function HomePage() {
  return <main>
    <section className="hero">
      <div className="heroCopy"><p className="eyebrow">THE SHIFT LEFT STRATEGY</p><h1>Wellbeing <em>before</em> challenges become crises<span>.</span></h1><p className="lead">Helping people, families, schools, and organizations build the capacity today for a healthier, stronger tomorrow.</p><div className="actions"><Link href="/why-shift-left" className="button primary">Discover the Strategy <span>→</span></Link><Link href="/book" className="button secondary">Book a discovery call</Link></div></div>
      <div className="heroRight" aria-label="The three continuous Shift Left practices">
        <div className="pillar"><span className="pillarIcon">◉</span><strong>Continuous Awareness</strong><p>Notice patterns, signals, needs, and choices earlier.</p><i /></div>
        <div className="pillar"><span className="pillarIcon">↻</span><strong>Continuous Learning</strong><p>Use reflection, feedback, and growth to keep adapting.</p><i /></div>
        <div className="pillar"><span className="pillarIcon">♡</span><strong>Continuous Self-Care</strong><p>Maintain wellbeing intentionally—before repair is required.</p><i /></div>
      </div>
      <Image className="heroJourney" src="/hero-journey.svg" alt="Two people connecting on green and blue paths that represent the Shift Left journey" width={1400} height={360} priority />
    </section>

    <section className="logoStory" id="logo-story"><div className="logoStoryHeader"><p className="eyebrow">WHY THIS LOGO?</p><h2>A visual story of the Shift Left philosophy.</h2><p>The connected green and blue figures form an infinity loop, reflecting continuous growth, human connection, balance, and early action.</p></div><div className="logoStoryBody"><div className="logoVisual"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting infinity logo with green and blue figures" width={760} height={330} priority /></div><div className="logoDetailGrid">{logoDetails.map(([kind, title, copy]) => <article key={title}><span className={`storyIcon ${kind}`}>{kind === "infinity" ? "∞" : kind === "shift" ? "←" : kind === "connection" ? "◉" : kind === "balance" ? "◐" : "☺"}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div><div className="brandPromise"><span>❧</span><p><strong>Shift Left Coaching &amp; Consulting</strong> helps people and organizations <em>notice earlier, learn continuously, and care intentionally.</em></p><div><b>Notice.<small>Be aware.</small></b><b>Learn.<small>Keep growing.</small></b><b>Care.<small>Maintain wellbeing.</small></b></div></div></section>

    <section className="intro" id="about"><p className="eyebrow">THE SHIFT LEFT PHILOSOPHY</p><div><h2>Support should begin before the breaking point.</h2><p>In engineering, shifting left means identifying and addressing issues earlier. We bring that same proactive thinking into human wellbeing: building awareness, skills, habits, connection, and resilience before challenges intensify.</p></div></section>

    <section className="founderPreview"><Image src="/bharath-portrait.svg" alt="Bharath Kumar Arekapudi" width={360} height={360} /><div><p className="eyebrow">BUILT BY AN ENGINEER. SHAPED BY LIFE.</p><h2>Meet Bharath Kumar Arekapudi.</h2><p>Technology leader, coach, author, speaker, and community builder. Bharath created the Shift Left Strategy by combining systems thinking with lived resilience and human connection.</p><div className="actions"><Link href="/my-story" className="button primary">Read my story</Link><Link href="/why-me" className="button secondary">Why work with me</Link></div></div></section>

    <section className="offerings" id="offerings"><div className="sectionHeading"><p className="eyebrow">HOW WE HELP</p><h2>Support designed around people and the systems around them.</h2></div><div className="offeringGrid">{offerings.map((offering) => <article key={offering.title} className={`offeringCard ${offering.title.toLowerCase()}`}><span className="cardNumber">{offering.number}</span><p className="eyebrow">{offering.title}</p><h3>{offering.heading}</h3><p>{offering.body}</p><ul>{offering.items.map((item) => <li key={item}>{item}</li>)}</ul><Link href="/programs">Explore programs →</Link></article>)}</div><div className="actions"><Link href="/programs" className="button primary">View all programs</Link><Link href="/book" className="button secondary">Book a discovery call</Link></div></section>

    <section className="consultingTeaser"><p className="eyebrow">SHIFT LEFT CONSULTING</p><h2>Build the idea. Shape the story. Reach the community.</h2><p>Practical support for digital transformation, websites, AI strategy, media, marketing, community building, product launches, thought leadership, and publishing.</p><Link href="/consulting" className="button primary">Explore consulting</Link></section>

    <section className="contentTeaser"><div><p className="eyebrow">THE SHIFT LEFT JOURNAL</p><h2>Ideas for logical minds and human lives.</h2><p>Explore proactive wellbeing, leadership, family conversations, resilience, technology, and mental fitness through practical frameworks.</p></div><div className="contentLinks"><Link href="/journal/mind-fitness-through-it-strategies">Featured: Mind Fitness Through IT Strategies →</Link><Link href="/blog">Explore the Journal →</Link><Link href="/speaking">Speaking &amp; workshops →</Link></div></section>

    <section className="contact" id="contact"><div><p className="eyebrow">LET&apos;S CONNECT</p><h2>Your next shift can start with one conversation.</h2><p>Share what you are navigating or building. We will explore whether coaching, consulting, or speaking is the right fit and identify a practical next step.</p><Link href="/book" className="button primary">Book a discovery call</Link><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a></div><form action="mailto:info@shiftleftcc.com" method="post" encType="text/plain"><label>Full name<input name="name" required /></label><label>Email<input type="email" name="email" required /></label><label>I am interested in<select name="interest"><option>Individual coaching</option><option>Family coaching</option><option>Organizational coaching</option><option>Consulting services</option><option>Speaking or workshops</option><option>Books and publishing</option></select></label><label>How can we help?<textarea name="message" rows={4} required /></label><button className="button primary" type="submit">Request a discovery call</button></form></section>
  </main>;
}
