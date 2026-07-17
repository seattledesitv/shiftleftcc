import Image from "next/image";
import Link from "next/link";

const offerings = [
  {
    number: "01",
    title: "Individual",
    heading: "Clarity, confidence, and forward movement.",
    body: "Personal coaching for transitions, career decisions, emotional wellbeing, purpose, mindset, and sustainable growth.",
    items: ["Life and wellness coaching", "Career clarity", "Resilience and habits", "Purpose and transitions"],
  },
  {
    number: "02",
    title: "Family",
    heading: "Create space for conversations that matter.",
    body: "Guided support for families who want to connect earlier, listen better, and spark meaningful conversations with teens.",
    items: ["Sparking teen conversations", "Parent–teen communication", "Family reflection sessions", "Tools for difficult moments"],
  },
  {
    number: "03",
    title: "Organizations",
    heading: "Healthier people. Stronger teams. Better systems.",
    body: "Workshops, coaching, and consulting that strengthen empathy, communication, psychological safety, and resilience.",
    items: ["Leadership and team coaching", "Mental wellness workshops", "Empathy programs", "Culture consulting"],
  },
];

const logoDetails = [
  ["green", "The green figure", "Represents a person equipped with self-awareness, resilience, empathy, and practical mental-wellness strategies."],
  ["blue", "The blue figure", "Represents a person still discovering tools, support, and possibility on their wellbeing journey."],
  ["infinity", "The infinity loop", "Symbolizes continuous growth, healing, and learning. We move forward, and sometimes we move back."],
  ["shift", "Shift left", "Encourages proactive action—addressing challenges early, before they escalate into crises."],
  ["connection", "The connection", "Coaching is about human connection, empathy, and walking alongside individuals and communities."],
  ["balance", "The balance", "Balances wellbeing and action to create a fulfilling, meaningful life."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">SHIFT LEFT &amp; STAY AHEAD</p>
          <h1>Wellbeing <em>before</em> challenges become crises<span>.</span></h1>
          <p className="lead">Practical coaching that helps individuals, families, leaders, and organizations develop awareness, resilience, and the confidence to act earlier.</p>
          <div className="actions">
            <a href="#contact" className="button primary">Book a Discovery Call <span>→</span></a>
            <a href="#about" className="button secondary">▶ &nbsp; Learn More</a>
          </div>
        </div>
        <div className="heroRight" aria-label="Awareness, empowerment and action">
          <div className="pillar"><span className="pillarIcon">♡</span><strong>Awareness</strong><p>Build self-awareness and understand what truly matters.</p><i /></div>
          <div className="pillar"><span className="pillarIcon">◎</span><strong>Empowerment</strong><p>Strengthen mindset, develop skills, and grow resilience.</p><i /></div>
          <div className="pillar"><span className="pillarIcon">↗</span><strong>Action</strong><p>Take proactive steps today to create a better tomorrow.</p><i /></div>
        </div>
        <Image className="heroJourney" src="/hero-journey.svg" alt="Two people connecting on green and blue paths that represent the Shift Left journey" width={1400} height={360} priority />
      </section>

      <section className="logoStory" id="logo-story">
        <div className="logoStoryHeader"><p className="eyebrow">WHY THIS LOGO?</p><h2>A visual story of the Shift Left philosophy.</h2><p>Our logo reflects the belief that wellbeing is a journey—one we take together.</p></div>
        <div className="logoStoryBody">
          <div className="logoVisual"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching infinity logo with green and blue figures" width={760} height={420} priority /><p>Shift Left Coaching</p></div>
          <div className="logoDetailGrid">
            {logoDetails.map(([kind, title, copy]) => <article key={title}><span className={`storyIcon ${kind}`}>{kind === "infinity" ? "∞" : kind === "shift" ? "↗" : kind === "connection" ? "◉" : kind === "balance" ? "◐" : "☺"}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
        <div className="brandPromise"><span>❧</span><p><strong>Shift Left Coaching</strong> helps individuals, families, schools, and organizations build the skills today for a <em>healthier, stronger tomorrow.</em></p><div><b>Mind.<small>Be aware.</small></b><b>Heart.<small>Be kind.</small></b><b>Action.<small>Make it happen.</small></b></div></div>
      </section>

      <section className="intro" id="about">
        <p className="eyebrow">THE SHIFT LEFT PHILOSOPHY</p>
        <div><h2>Support should begin before the breaking point.</h2><p>We bring the idea of “shifting left” into human wellbeing: noticing earlier, preparing earlier, and acting earlier. The goal is not perfection. It is helping people build the capacity to respond with greater awareness, choice, and confidence.</p></div>
      </section>

      <section className="offerings" id="offerings">
        <div className="sectionHeading"><p className="eyebrow">HOW WE HELP</p><h2>Support designed around people and the systems around them.</h2></div>
        <div className="offeringGrid">
          {offerings.map((offering) => (
            <article key={offering.title} className={`offeringCard ${offering.title.toLowerCase()}`}>
              <span className="cardNumber">{offering.number}</span><p className="eyebrow">{offering.title}</p><h3>{offering.heading}</h3><p>{offering.body}</p><ul>{offering.items.map((item) => <li key={item}>{item}</li>)}</ul><a href="#contact">Start a conversation →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="consultingTeaser">
        <p className="eyebrow">SHIFT LEFT CONSULTING</p><h2>Build the idea. Shape the story. Reach the community.</h2><p>Practical packages for websites, media and marketing, product launches, community placement, and book publishing.</p><Link href="/consulting" className="button primary">Explore consulting packages</Link>
      </section>

      <section className="contentTeaser">
        <div><p className="eyebrow">INSIGHTS &amp; RESOURCES</p><h2>Ideas for moving awareness into action.</h2><p>Explore practical perspectives on wellbeing, parenting, communication, leadership, community, and the Shift Left approach.</p></div>
        <div className="contentLinks"><Link href="/blog">Read the blog →</Link><Link href="/resources">Explore resources →</Link></div>
      </section>

      <section className="contact" id="contact">
        <div><p className="eyebrow">LET&apos;S CONNECT</p><h2>Your next shift can start with one conversation.</h2><p>Share what you are navigating. We will explore whether coaching or consulting is the right fit and identify a practical next step.</p><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a></div>
        <form action="mailto:info@shiftleftcc.com" method="post" encType="text/plain"><label>Full name<input name="name" required /></label><label>Email<input type="email" name="email" required /></label><label>I am interested in<select name="interest"><option>Individual coaching</option><option>Family coaching</option><option>Organizational coaching</option><option>Consulting services</option><option>Speaking or workshops</option></select></label><label>How can we help?<textarea name="message" rows={4} required /></label><button className="button primary" type="submit">Request a discovery call</button></form>
      </section>
    </main>
  );
}
