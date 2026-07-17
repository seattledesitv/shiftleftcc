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

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">SHIFT LEFT & STAY AHEAD</p>
          <h1>Wellbeing <em>before</em> challenges become crises.</h1>
          <p className="lead">Practical coaching that helps individuals, families, leaders, and organizations develop awareness, resilience, and the confidence to act earlier.</p>
          <div className="actions">
            <a href="#contact" className="button primary">Book a free discovery call</a>
            <a href="#offerings" className="button secondary">Explore our offerings</a>
          </div>
        </div>
        <div className="heroRight" aria-label="Awareness, empowerment and action">
          <div className="pillar"><span>01</span><strong>Awareness</strong><p>See patterns before they become barriers.</p></div>
          <div className="pillar"><span>02</span><strong>Empowerment</strong><p>Build tools that fit real life.</p></div>
          <div className="pillar"><span>03</span><strong>Action</strong><p>Move forward with intention.</p></div>
        </div>
      </section>

      <section className="intro">
        <p className="eyebrow">THE SHIFT LEFT PHILOSOPHY</p>
        <div><h2>Support should begin before the breaking point.</h2><p>We bring the idea of “shifting left” into human wellbeing: noticing earlier, preparing earlier, and acting earlier. The goal is not perfection. It is helping people build the capacity to respond with greater awareness, choice, and confidence.</p></div>
      </section>

      <section className="offerings" id="offerings">
        <div className="sectionHeading"><p className="eyebrow">HOW WE HELP</p><h2>Support designed around people and the systems around them.</h2></div>
        <div className="offeringGrid">
          {offerings.map((offering) => (
            <article key={offering.title} className={`offeringCard ${offering.title.toLowerCase()}`}>
              <span className="cardNumber">{offering.number}</span>
              <p className="eyebrow">{offering.title}</p>
              <h3>{offering.heading}</h3>
              <p>{offering.body}</p>
              <ul>{offering.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href="#contact">Start a conversation →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="logoStory" id="logo-story">
        <div className="logoVisual">
          <Image src="/shift-left-logo.svg" alt="Shift Left Coaching infinity logo with green and blue figures" width={760} height={420} priority />
        </div>
        <div className="logoCopy">
          <p className="eyebrow">WHY THIS LOGO?</p>
          <h2>A continuous journey from awareness to action.</h2>
          <div className="storyPoints">
            <article><span className="greenDot"/><div><h3>The green figure</h3><p>Represents a person equipped with self-awareness, resilience, empathy, and practical mental-wellness strategies.</p></div></article>
            <article><span className="blueDot"/><div><h3>The blue figure</h3><p>Represents a person who is still discovering those tools and may need support, understanding, and connection.</p></div></article>
            <article><span className="infinityMark">∞</span><div><h3>The infinity loop</h3><p>Reminds us that growth is ongoing. We all move between giving support and receiving it throughout life.</p></div></article>
            <article><span className="arrowMark">←</span><div><h3>The shift to the left</h3><p>Encourages earlier awareness and action—before challenges intensify into crisis.</p></div></article>
          </div>
        </div>
      </section>

      <section className="consultingTeaser">
        <p className="eyebrow">SHIFT LEFT CONSULTING</p>
        <h2>Build the idea. Shape the story. Reach the community.</h2>
        <p>Practical packages for websites, media and marketing, product launches, community placement, and book publishing.</p>
        <Link href="/consulting" className="button primary">Explore consulting packages</Link>
      </section>

      <section className="contact" id="contact">
        <div><p className="eyebrow">LET&apos;S CONNECT</p><h2>Your next shift can start with one conversation.</h2><p>Share what you are navigating. We will explore whether coaching or consulting is the right fit and identify a practical next step.</p><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a></div>
        <form action="mailto:info@shiftleftcc.com" method="post" encType="text/plain">
          <label>Full name<input name="name" required /></label>
          <label>Email<input type="email" name="email" required /></label>
          <label>I am interested in<select name="interest"><option>Individual coaching</option><option>Family coaching</option><option>Organizational coaching</option><option>Consulting services</option><option>Speaking or workshops</option></select></label>
          <label>How can we help?<textarea name="message" rows={4} required /></label>
          <button className="button primary" type="submit">Request a discovery call</button>
        </form>
      </section>
    </main>
  );
}