import Link from "next/link";

const resources = [
  { tag: "CONVERSATION GUIDE", title: "Start a meaningful conversation", excerpt: "A simple framework for listening with curiosity, asking open questions, and making room for what is not yet easy to say.", action: "Request the guide" },
  { tag: "SELF-REFLECTION", title: "Awareness check-in", excerpt: "Pause and notice what you are feeling, what may be driving it, and what support or action could help next.", action: "Request the worksheet" },
  { tag: "FAMILY", title: "Teen conversation prompts", excerpt: "Low-pressure prompts families can use to spark connection without making every conversation feel serious or forced.", action: "Request the prompts" },
  { tag: "LEADERS", title: "Earlier signals at work", excerpt: "Questions leaders can use to recognize strain, create psychological safety, and invite support before performance is affected.", action: "Request the guide" },
  { tag: "ACTION PLAN", title: "My Shift Left plan", excerpt: "Identify early signals, helpful people, practical tools, and one small action you can take before a challenge grows.", action: "Request the template" },
  { tag: "COMMUNITY", title: "Building a circle of support", excerpt: "Map the people, spaces, and practices that help you feel connected, grounded, understood, and able to move forward.", action: "Request the worksheet" },
];

const pathways = [
  { title: "Wellbeing Self-Assessment", copy: "Complete the detailed Mind Fitness and Physical Wellbeing questionnaire, then visualize your combined result against the 80% benchmark.", href: "/wellbeing-assessment", cta: "Take the full assessment →" },
  { title: "Shift Left Check-In", copy: "Reflect on awareness, learning, care, support, action, and sustainability in under five minutes.", href: "/assessment", cta: "Start the quick check-in →" },
  { title: "Read the Journal", copy: "Explore practical ideas for mental fitness, leadership, family conversations, resilience, and systems thinking.", href: "/blog", cta: "Explore the Journal →" },
  { title: "Find a Program", copy: "Browse individual, family, leadership, and organizational experiences designed around proactive growth.", href: "/programs", cta: "View programs →" },
];

export default function ResourcesPage() {
  return <main>
    <section className="pageHero compactHero"><p className="eyebrow">PRACTICAL RESOURCES</p><h1>Tools for earlier awareness, better conversations, and useful action.</h1><p className="lead">Begin with a quick check-in, take the detailed wellbeing assessment, explore practical frameworks, or request a focused worksheet for yourself, your family, or your team.</p><div className="actions"><Link href="/wellbeing-assessment" className="button primary">Take the Wellbeing Assessment</Link><Link href="/assessment" className="button secondary">Try the 5-minute Check-In</Link></div></section>

    <section className="offerings"><div className="sectionHeading"><p className="eyebrow">START HERE</p><h2>Choose the kind of support that fits today.</h2></div><div className="offeringGrid">{pathways.map((pathway, index) => <article className="offeringCard" key={pathway.title}><span className="cardNumber">{String(index + 1).padStart(2, "0")}</span><h3>{pathway.title}</h3><p>{pathway.copy}</p><Link href={pathway.href}>{pathway.cta}</Link></article>)}</div></section>

    <section className="contentPage"><div className="sectionHeading"><p className="eyebrow">GUIDES &amp; WORKSHEETS</p><h2>Simple tools you can use in real conversations and real life.</h2></div><div className="contentGrid">{resources.map(resource => <article className="contentCard" key={resource.title}><span className="tag">{resource.tag}</span><h2>{resource.title}</h2><p>{resource.excerpt}</p><a href={`mailto:info@shiftleftcc.com?subject=${encodeURIComponent(resource.title)}`}>{resource.action} →</a></article>)}</div></section>

    <section className="consultingTeaser"><p className="eyebrow">FOR TEAMS, SCHOOLS &amp; COMMUNITIES</p><h2>Resources become more powerful when people practice them together.</h2><p>Shift Left guides and exercises can be incorporated into workshops, leadership conversations, school programs, and customized organizational engagements.</p><div className="actions"><Link href="/organizations" className="button primary">Explore organizational solutions</Link><Link href="/speaking" className="button secondary">Speaking &amp; workshops</Link></div></section>
  </main>;
}
