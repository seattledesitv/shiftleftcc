import type { Metadata } from "next";
import Link from "next/link";
import "./book.css";

const amazonUrl = "https://www.amazon.com/dp/B0D9LPJTWR";
const checkoutUrl = "/checkout/ego-and-empathy";
const coverUrl = "https://images-na.ssl-images-amazon.com/images/P/B0D9LPJTWR.01.LZZZZZZZ.jpg";

export const metadata: Metadata = {
  title: "Ego and Empathy Book by Bharath Kumar Arekapudi",
  description: "Explore Ego and Empathy by Bharath Kumar Arekapudi, a practical book about self-awareness, relationships, leadership, and finding a healthier balance between personal drive and understanding others.",
  alternates: { canonical: "/books/ego-and-empathy" },
  openGraph: {
    type: "book",
    title: "Ego and Empathy",
    description: "A practical exploration of balancing self-belief, awareness, and empathy in life, relationships, and leadership.",
    url: "/books/ego-and-empathy",
    images: [{ url: coverUrl, alt: "Ego and Empathy book cover" }],
  },
};

const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Ego and Empathy",
  author: { "@type": "Person", name: "Bharath Kumar Arekapudi" },
  url: "https://www.shiftleftcc.com/books/ego-and-empathy",
  image: coverUrl,
  sameAs: amazonUrl,
  offers: {
    "@type": "Offer",
    price: "19.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.shiftleftcc.com/checkout/ego-and-empathy",
    shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: "5.00", currency: "USD" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" } },
  },
};

export default function EgoAndEmpathyBookPage() {
  return <main className="bookPage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
    <section className="bookHero">
      <div className="bookCoverWrap"><img src={coverUrl} alt="Ego and Empathy by Bharath Kumar Arekapudi" className="bookCover" /></div>
      <div className="bookHeroCopy">
        <p className="eyebrow">A BOOK BY BHARATH KUMAR AREKAPUDI</p>
        <h1>Ego and Empathy</h1>
        <p className="bookLead">A practical exploration of how self-belief and empathy shape our choices, relationships, leadership, and personal growth.</p>
        <p>Discover how ego can protect, motivate, and strengthen us—while also learning when it begins to interfere with listening, connection, collaboration, and wellbeing. The book invites readers to build greater self-awareness and create a healthier balance between confidence and compassion.</p>
        <p><strong>$19.99</strong> · Regular paperback · $5 U.S. shipping</p>
        <div className="bookActions"><Link className="button primary" href={checkoutUrl}>Buy Now</Link><a className="button secondary" href={amazonUrl} target="_blank" rel="noopener noreferrer">Buy on Amazon</a></div>
        <p className="purchaseNote">Direct checkout stays on Shift Left and uses Stripe-secured payment fields. Card details are not stored by Shift Left.</p>
      </div>
    </section>
    <section className="bookContentSection">
      <div><p className="eyebrow">WHY THIS BOOK</p><h2>Build confidence without losing connection.</h2><p>Ego and empathy are often treated as opposites. In practice, both can serve an important purpose. The challenge is recognizing when confidence becomes defensiveness, when ambition overshadows relationships, or when empathy needs stronger boundaries.</p><p>This book brings those ideas into everyday life, helping readers reflect on how they communicate, make decisions, lead, respond to conflict, and understand the experiences of others.</p></div>
      <div className="bookTakeaways"><article><span>01</span><h3>Understand ego</h3><p>Recognize how ego can support identity and confidence—and how it can also create blind spots.</p></article><article><span>02</span><h3>Strengthen empathy</h3><p>Listen more deeply, understand other perspectives, and create stronger relationships.</p></article><article><span>03</span><h3>Find balance</h3><p>Make thoughtful decisions that respect both your own needs and the needs of others.</p></article><article><span>04</span><h3>Lead intentionally</h3><p>Apply self-awareness, empathy, and accountability in leadership, family, work, and community.</p></article></div>
    </section>
    <section className="bookAudienceSection"><p className="eyebrow">WHO IT IS FOR</p><h2>For people who want to grow without losing what matters.</h2><div className="bookAudienceGrid"><div><strong>Professionals & leaders</strong><p>For more thoughtful communication, decision-making, and collaboration.</p></div><div><strong>Parents & families</strong><p>For healthier conversations, stronger boundaries, and deeper understanding.</p></div><div><strong>Students & young adults</strong><p>For building identity, confidence, resilience, and emotional awareness.</p></div><div><strong>Anyone navigating change</strong><p>For reflecting on personal patterns and responding with greater intention.</p></div></div></section>
    <section className="bookAuthorSection"><div><p className="eyebrow">ABOUT THE AUTHOR</p><h2>Bharath Kumar Arekapudi</h2><p>Bharath is the founder of the Shift Left Strategy, a coach, consultant, speaker, and technology leader. Drawing from decades of corporate experience, major life transitions, community leadership, and wellbeing practices, he helps individuals and organizations notice earlier, learn continuously, and act with greater intention.</p><Link className="button secondary" href="/my-story">Read Bharath’s story</Link></div><div className="bookQuote">“Balance is not about eliminating ego. It is about developing enough awareness and empathy to use it wisely.”</div></section>
    <section className="bookFinalCta"><p className="eyebrow">START READING</p><h2>Explore the balance between self-belief and understanding others.</h2><div className="bookActions centered"><Link className="button primary" href={checkoutUrl}>Buy Now — $19.99</Link><a className="button secondary" href={amazonUrl} target="_blank" rel="noopener noreferrer">View on Amazon</a></div></section>
  </main>;
}
