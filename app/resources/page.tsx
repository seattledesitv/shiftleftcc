const resources = [
  { tag: "CONVERSATION GUIDE", title: "Start a meaningful conversation", excerpt: "A simple framework for listening with curiosity, asking open questions, and making room for what is not yet easy to say." },
  { tag: "SELF-REFLECTION", title: "Awareness check-in", excerpt: "Pause and notice what you are feeling, what may be driving it, and what support or action could help next." },
  { tag: "FAMILY", title: "Teen conversation prompts", excerpt: "Low-pressure prompts families can use to spark connection without making every conversation feel serious or forced." },
  { tag: "LEADERS", title: "Earlier signals at work", excerpt: "Questions leaders can use to recognize strain, create psychological safety, and invite support before performance is affected." },
  { tag: "ACTION PLAN", title: "My Shift Left plan", excerpt: "Identify early signals, helpful people, practical tools, and one small action you can take before a challenge grows." },
  { tag: "COMMUNITY", title: "Building a circle of support", excerpt: "Map the people, spaces, and practices that help you feel connected, grounded, understood, and able to move forward." },
];

export default function ResourcesPage() {
  return <main>
    <section className="pageHero"><p className="eyebrow">PRACTICAL RESOURCES</p><h1>Tools for earlier awareness and action.</h1><p className="lead">Conversation starters, reflection prompts, and practical frameworks for individuals, families, leaders, and communities.</p></section>
    <section className="contentPage"><div className="contentGrid">{resources.map(resource => <article className="contentCard" key={resource.title}><span className="tag">{resource.tag}</span><h2>{resource.title}</h2><p>{resource.excerpt}</p><a href={`mailto:info@shiftleftcc.com?subject=${encodeURIComponent(resource.title)}`}>Request this resource →</a></article>)}</div></section>
  </main>;
}