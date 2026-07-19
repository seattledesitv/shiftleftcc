import Link from "next/link";

const posts = [
  { tag: "MIND FITNESS", title: "Mind Fitness Through IT Strategies for Logical Minds", excerpt: "How systems thinking, shifting left, feedback loops, and preventive maintenance can make wellbeing more relatable to technology professionals.", href: "/journal/mind-fitness-through-it-strategies", featured: true },
  { tag: "SHIFT LEFT", title: "The Power of Shift Left Coaching in Promoting Mental Health and Wellbeing", excerpt: "A foundational introduction to early intervention, preventive care, resilience, and proactive mental-fitness practices.", href: "/why-shift-left" },
  { tag: "SELF-AWARENESS", title: "Know Your Thinking Patterns", excerpt: "Learn to notice automatic thoughts, thinking errors, self-talk, core beliefs, and the role mindfulness can play in changing patterns.", href: "mailto:info@shiftleftcc.com?subject=Know Your Thinking Patterns article" },
  { tag: "SELF-COACHING", title: "How Can You Coach Yourself?", excerpt: "A practical framework for setting goals, asking powerful questions, creating action plans, reflecting, and seeking support when needed.", href: "mailto:info@shiftleftcc.com?subject=Self Coaching article" },
  { tag: "WELLBEING", title: "Tips for Maintaining Positive Mental Health", excerpt: "Seven practical reminders involving thoughts, gratitude, connection, physical health, stress, rest, and professional support.", href: "mailto:info@shiftleftcc.com?subject=Positive Mental Health article" },
  { tag: "STATE OF MIND", title: "Maintain a Positive State of Mind", excerpt: "How awareness of changing emotions, external influences, healthy management, and individual values can support physical and emotional health.", href: "mailto:info@shiftleftcc.com?subject=State of Mind article" },
];

export default function BlogPage() {
  return <main>
    <section className="pageHero"><p className="eyebrow">THE SHIFT LEFT JOURNAL</p><h1>Ideas for logical minds and human lives.</h1><p className="lead">Practical perspectives on proactive wellbeing, technology, leadership, resilience, self-awareness, family, and community.</p></section>
    <section className="contentPage"><div className="contentGrid">{posts.map(post => <article className={`contentCard ${post.featured ? "featuredArticle" : ""}`} key={post.title}><span className="tag">{post.tag}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={post.href}>{post.featured ? "Read the featured article" : "Read more"} →</Link></article>)}</div></section>
  </main>;
}