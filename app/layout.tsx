import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import "./globals.css";
import "./brand-overrides.css";
import "./platform-overrides.css";
import "./dashboard.css";

const siteUrl = "https://www.shiftleftcc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shift Left Coaching & Consulting | Proactive Wellbeing and Growth", template: "%s | Shift Left Coaching & Consulting" },
  description: "Shift Left Coaching & Consulting helps individuals, families, leaders, and organizations notice earlier, grow intentionally, and build sustainable wellbeing through coaching, assessments, life planning, and practical systems-thinking strategies.",
  keywords: ["Shift Left Coaching", "mental fitness", "life coaching", "career coaching", "leadership coaching", "family wellbeing", "burnout prevention", "life planning", "goal setting", "workplace wellbeing"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "Shift Left Coaching & Consulting", title: "Shift Left Coaching & Consulting", description: "Notice earlier. Learn continuously. Care intentionally.", images: [{ url: "/shift-left-logo.svg", width: 1200, height: 630, alt: "Shift Left Coaching & Consulting" }] },
  twitter: { card: "summary_large_image", title: "Shift Left Coaching & Consulting", description: "Proactive wellbeing, life planning, coaching, and consulting." },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Shift Left Coaching & Consulting", url: siteUrl, email: "info@shiftleftcc.com", slogan: "Notice. Learn. Care." },
    { "@type": "Person", "@id": `${siteUrl}/#founder`, name: "Bharath Kumar Arekapudi", url: `${siteUrl}/my-story`, jobTitle: "Coach and Consultant", worksFor: { "@id": `${siteUrl}/#organization` } },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Shift Left Coaching & Consulting", publisher: { "@id": `${siteUrl}/#organization` } },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { id: string; email?: string } | null = null;
  let isAdmin = false;
  let tagline = "Notice earlier. Learn continuously. Care intentionally.";
  let contactEmail = "info@shiftleftcc.com";
  let onlineMessage = "100% Online · Available across the U.S. and worldwide via Zoom or Microsoft Teams";
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      isAdmin = Boolean(admin);
    }
    const { data: publicSettings } = await supabase.from("platform_settings").select("category,key,value").eq("is_public", true).in("key", ["tagline","primary_email","service_delivery"]);
    for (const setting of publicSettings || []) {
      if (setting.category === "general" && setting.key === "tagline" && typeof setting.value === "string") tagline = setting.value;
      if (setting.category === "contact" && setting.key === "primary_email" && typeof setting.value === "string") contactEmail = setting.value;
      if (setting.category === "contact" && setting.key === "service_delivery" && typeof setting.value === "string") onlineMessage = setting.value;
    }
  } catch {}

  return <html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="siteHeader">
      <Link href="/" className="brandLockup" aria-label="Shift Left Coaching and Consulting home"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={150} height={66} priority /><span className="brandWords"><strong>Shift Left</strong><small>COACHING &amp; CONSULTING</small><em>{tagline}</em></span></Link>
      <nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/why-shift-left">Strategy</Link><Link href="/my-story">My Story</Link><Link href="/programs">Programs</Link><Link href="/organizations">Organizations</Link><Link href="/consulting">Consulting</Link><Link href="/speaking">Speaking</Link><Link href="/books">Books</Link><Link href="/resources">Resources</Link><Link href="/blog">Journal</Link>{user && <Link href="/my-journey">My Journey</Link>}{isAdmin && <Link href="/studio">Studio</Link>}{user ? <form className="headerAuth" action="/auth/signout" method="post"><button type="submit" className="authNavButton" title={user.email || "Signed in"}>Logout</button></form> : <Link href="/login">Login</Link>}<Link href="/book" className="navCta">Book a Call</Link></nav>
    </header>
    {children}
    <footer><div className="footerBrand"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={190} height={84} /><strong>SHIFT LEFT COACHING &amp; CONSULTING</strong><p>{tagline}</p><p className="finePrint">{onlineMessage}</p></div><div><strong>Discover</strong><Link href="/">Home</Link><Link href="/why-shift-left">The Strategy</Link><Link href="/my-story">My Story</Link><Link href="/why-me">Why Me</Link><Link href="/for-who">Who It Is For</Link><Link href="/how-it-works">How It Works</Link></div><div><strong>Explore</strong>{user && <Link href="/my-journey">My Journey</Link>}{isAdmin && <Link href="/studio">Studio</Link>}<Link href="/programs">Programs</Link><Link href="/organizations">Organizations</Link><Link href="/consulting">Consulting</Link><Link href="/speaking">Speaking</Link><Link href="/books">Books</Link><Link href="/wellbeing-assessment">Wellbeing Assessment</Link><Link href="/resources">Resources</Link><Link href="/blog">Journal</Link></div><div><strong>Connect</strong>{user ? <form action="/auth/signout" method="post"><button className="footerAuthButton" type="submit">Logout</button></form> : <Link href="/login">Member login</Link>}<Link href="/book">Book a discovery call</Link><a href={`mailto:${contactEmail}`}>{contactEmail}</a><p>© 2026 Experience Healing LLC</p><p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p></div></footer>
  </body></html>;
}
