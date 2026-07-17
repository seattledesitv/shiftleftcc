import Link from "next/link";

const packages = [
  {
    title: "Website Building",
    subtitle: "From idea to launch",
    description: "A clear, credible, mobile-friendly website designed around your audience, message, and next action.",
    items: ["Brand and content discovery", "Website design and development", "Mobile optimization", "Launch and handoff support"],
  },
  {
    title: "Media Marketing",
    subtitle: "Build visibility with purpose",
    description: "A practical media plan that turns your story into content people can understand, share, and remember.",
    items: ["Messaging and campaign planning", "Social content direction", "Video and interview strategy", "Community media outreach"],
  },
  {
    title: "Product Marketing & Community Placement",
    subtitle: "Reach the people who need it",
    description: "Position a product or service clearly, then connect it with relevant audiences, partners, and community channels.",
    items: ["Product positioning", "Launch story and assets", "Community activation plan", "Partner and placement strategy"],
  },
  {
    title: "Book Publishing",
    subtitle: "Turn lived experience into impact",
    description: "Structured support to shape a book concept, organize the manuscript, prepare for publishing, and introduce it to the right audience.",
    items: ["Book concept and audience", "Content structure and accountability", "Publishing-readiness support", "Launch and community promotion"],
  },
];

export const metadata = {
  title: "Consulting Packages | Shift Left Coaching",
  description: "Website building, media marketing, product marketing, community placement, and book publishing consulting packages.",
};

export default function ConsultingPage() {
  return (
    <main>
      <section className="pageHero">
        <p className="eyebrow">SHIFT LEFT CONSULTING</p>
        <h1>Build with clarity. Launch with confidence. Reach the right community.</h1>
        <p className="lead">Flexible consulting packages for people, purpose-led businesses, authors, and community organizations that need both strategy and practical execution.</p>
        <a className="button primary" href="#packages">View packages</a>
      </section>

      <section className="packageSection" id="packages">
        <div className="sectionHeading"><p className="eyebrow">CONSULTING PACKAGES</p><h2>Choose a focused starting point. We will tailor the scope after discovery.</h2></div>
        <div className="packageGrid">
          {packages.map((item, index) => (
            <article className="packageCard" key={item.title}>
              <span className="cardNumber">0{index + 1}</span>
              <p className="eyebrow">{item.subtitle}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>{item.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <a href="mailto:info@shiftleftcc.com?subject=Consulting package inquiry">Request package details →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="processSection">
        <p className="eyebrow">HOW IT WORKS</p>
        <div className="processGrid">
          <article><span>01</span><h3>Discover</h3><p>Clarify the goal, audience, current assets, constraints, and definition of success.</p></article>
          <article><span>02</span><h3>Design</h3><p>Create the right package, milestones, deliverables, and collaboration rhythm.</p></article>
          <article><span>03</span><h3>Deliver</h3><p>Move from strategy into practical execution with regular reviews and decisions.</p></article>
          <article><span>04</span><h3>Launch</h3><p>Release the work with a clear plan for adoption, visibility, and next steps.</p></article>
        </div>
      </section>

      <section className="consultingCta">
        <h2>Not sure which package fits?</h2>
        <p>Start with a discovery conversation. We can combine services into a focused plan rather than forcing your work into a fixed template.</p>
        <div className="actions"><a className="button primary" href="mailto:info@shiftleftcc.com?subject=Consulting discovery call">Book a discovery call</a><Link className="button secondary" href="/">Return home</Link></div>
      </section>
    </main>
  );
}