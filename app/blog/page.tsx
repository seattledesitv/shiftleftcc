import Link from "next/link";

const posts = [
  { tag: "SHIFT LEFT", title: "Why wellbeing support should begin before a crisis", excerpt: "A practical introduction to noticing earlier, preparing earlier, and creating support before challenges intensify." },
  { tag: "FAMILY", title: "How to spark conversations with teens", excerpt: "Simple ways to replace interrogation with curiosity and create safer openings for honest parent–teen conversations." },
  { tag: "LEADERSHIP", title: "Awareness, empowerment, and action at work", excerpt: "How leaders can build a culture where people speak earlier, ask for help sooner, and take meaningful action." },
  { tag: "PERSONAL GROWTH", title: "The difference between reacting and responding", excerpt: "A reflection on emotional awareness, choice, and the small pause that can change what happens next." },
  { tag: "COMMUNITY", title: "Wellbeing grows through connection", excerpt: "Why empathy, belonging, and community support are essential parts of sustainable mental wellness." },
  { tag: "RESILIENCE", title: "Building tools before you need them", excerpt: "Practical strategies become most useful when they are learned, practiced, and normalized ahead of difficult moments." },
];

export default function BlogPage() {
  return <main>
    <section className="pageHero"><p className="eyebrow">SHIFT LEFT INSIGHTS</p><h1>Ideas that move awareness into action.</h1><p className="lead">Perspectives on wellbeing, family conversations, leadership, resilience, community, and proactive support.</p></section>
    <section className="contentPage"><div className="contentGrid">{posts.map(post => <article className="contentCard" key={post.title}><span className="tag">{post.tag}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href="mailto:info@shiftleftcc.com?subject=Blog topic inquiry">Read more →</Link></article>)}</div></section>
  </main>;
}