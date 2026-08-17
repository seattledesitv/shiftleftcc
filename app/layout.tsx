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

type NavItem = {
  id: string;
  location: "header" | "footer_discover" | "footer_explore";
  label: string;
  href: string;
  parent_id: string | null;
  display_order: number;
  is_cta: boolean;
  auth_visibility: "public" | "authenticated" | "admin";
  open_new_tab: boolean;
};

const fallbackHeader: NavItem[] = [
  { id: "h1", location: "header", label: "Home", href: "/", parent_id: null, display_order: 10, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h2", location: "header", label: "The Shift Left Method", href: "/why-shift-left", parent_id: null, display_order: 20, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h3", location: "header", label: "Coaching & Services", href: "/programs", parent_id: null, display_order: 30, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h4", location: "header", label: "Organizations", href: "/organizations", parent_id: null, display_order: 40, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h5", location: "header", label: "Books", href: "/books", parent_id: null, display_order: 50, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h6", location: "header", label: "Resources", href: "/resources", parent_id: null, display_order: 60, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h7", location: "header", label: "About Bharath", href: "/my-story", parent_id: null, display_order: 70, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "h8", location: "header", label: "My Journey", href: "/my-journey", parent_id: null, display_order: 80, is_cta: false, auth_visibility: "authenticated", open_new_tab: false },
  { id: "h9", location: "header", label: "Studio", href: "/studio", parent_id: null, display_order: 90, is_cta: false, auth_visibility: "admin", open_new_tab: false },
  { id: "h10", location: "header", label: "Start Your Journey", href: "/book", parent_id: null, display_order: 100, is_cta: true, auth_visibility: "public", open_new_tab: false },
];

const fallbackDiscover: NavItem[] = [
  { id: "d1", location: "footer_discover", label: "Home", href: "/", parent_id: null, display_order: 10, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "d2", location: "footer_discover", label: "The Shift Left Method", href: "/why-shift-left", parent_id: null, display_order: 20, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "d3", location: "footer_discover", label: "About Bharath", href: "/my-story", parent_id: null, display_order: 30, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "d4", location: "footer_discover", label: "How It Works", href: "/how-it-works", parent_id: null, display_order: 40, is_cta: false, auth_visibility: "public", open_new_tab: false },
];

const fallbackExplore: NavItem[] = [
  { id: "e1", location: "footer_explore", label: "Coaching & Services", href: "/programs", parent_id: null, display_order: 10, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "e2", location: "footer_explore", label: "Organizations", href: "/organizations", parent_id: null, display_order: 20, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "e3", location: "footer_explore", label: "Books", href: "/books", parent_id: null, display_order: 30, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "e4", location: "footer_explore", label: "Resources", href: "/resources", parent_id: null, display_order: 40, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "e5", location: "footer_explore", label: "Blog", href: "/blog", parent_id: null, display_order: 50, is_cta: false, auth_visibility: "public", open_new_tab: false },
];

function allowed(item: NavItem, signedIn: boolean, admin: boolean) {
  if (item.auth_visibility === "admin") return admin;
  if (item.auth_visibility === "authenticated") return signedIn;
  return true;
}

function NavAnchor({ item, className }: { item: NavItem; className?: string }) {
  const external = /^https?:\/\//.test(item.href);
  if (external) return <a href={item.href} className={className} target={item.open_new_tab ? "_blank" : undefined} rel={item.open_new_tab ? "noopener noreferrer" : undefined}>{item.label}</a>;
  return <Link href={item.href} className={className}>{item.label}</Link>;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { id: string; email?: string } | null = null;
  let isAdmin = false;
  let tagline = "Notice earlier. Learn continuously. Care intentionally.";
  let contactEmail = "info@shiftleftcc.com";
  let onlineMessage = "100% Online · Available across the U.S. and worldwide via Zoom or Microsoft Teams";
  let navigation: NavItem[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      isAdmin = Boolean(admin);
    }
    const [{ data: publicSettings }, { data: navItems }] = await Promise.all([
      supabase.from("platform_settings").select("category,key,value").eq("is_public", true).in("key", ["tagline","primary_email","service_delivery"]),
      supabase.from("navigation_items").select("id,location,label,href,parent_id,display_order,is_cta,auth_visibility,open_new_tab").eq("is_visible", true).order("display_order"),
    ]);
    navigation = (navItems || []) as NavItem[];
    for (const setting of publicSettings || []) {
      if (setting.category === "general" && setting.key === "tagline" && typeof setting.value === "string") tagline = setting.value;
      if (setting.category === "contact" && setting.key === "primary_email" && typeof setting.value === "string") contactEmail = setting.value;
      if (setting.category === "contact" && setting.key === "service_delivery" && typeof setting.value === "string") onlineMessage = setting.value;
    }
  } catch {}

  const headerItems = (navigation.filter(item => item.location === "header").length ? navigation.filter(item => item.location === "header") : fallbackHeader).filter(item => allowed(item, Boolean(user), isAdmin));
  const discoverItems = (navigation.filter(item => item.location === "footer_discover").length ? navigation.filter(item => item.location === "footer_discover") : fallbackDiscover).filter(item => allowed(item, Boolean(user), isAdmin));
  const exploreItems = (navigation.filter(item => item.location === "footer_explore").length ? navigation.filter(item => item.location === "footer_explore") : fallbackExplore).filter(item => allowed(item, Boolean(user), isAdmin));
  const topLevel = headerItems.filter(item => !item.parent_id);

  return <html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="siteHeader">
      <Link href="/" className="brandLockup" aria-label="Shift Left Coaching and Consulting home"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={150} height={66} priority /><span className="brandWords"><strong>Shift Left</strong><small>COACHING &amp; CONSULTING</small><em>{tagline}</em></span></Link>
      <nav aria-label="Main navigation" className="dynamicNav">
        {topLevel.map(item => {
          const children = headerItems.filter(child => child.parent_id === item.id);
          if (children.length) return <div className="navDropdown" key={item.id}><NavAnchor item={item} className={item.is_cta ? "navCta" : undefined} /><div className="navDropdownMenu">{children.map(child => <NavAnchor item={child} key={child.id} className={child.is_cta ? "navCta" : undefined} />)}</div></div>;
          return <NavAnchor item={item} key={item.id} className={item.is_cta ? "navCta" : undefined} />;
        })}
        {user ? <form className="headerAuth" action="/auth/signout" method="post"><button type="submit" className="authNavButton" title={user.email || "Signed in"}>Logout</button></form> : <Link href="/login">Login</Link>}
      </nav>
    </header>
    {children}
    <footer><div className="footerBrand"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={190} height={84} /><strong>SHIFT LEFT COACHING &amp; CONSULTING</strong><p>{tagline}</p><p className="finePrint">{onlineMessage}</p></div><div><strong>Discover</strong>{discoverItems.map(item => <NavAnchor item={item} key={item.id} />)}</div><div><strong>Explore</strong>{exploreItems.map(item => <NavAnchor item={item} key={item.id} />)}</div><div><strong>Connect</strong>{user ? <form action="/auth/signout" method="post"><button className="footerAuthButton" type="submit">Logout</button></form> : <Link href="/login">Member login</Link>}<Link href="/book">Start Your Journey</Link><a href={`mailto:${contactEmail}`}>{contactEmail}</a><p>© 2026 Experience Healing LLC</p><p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p></div></footer>
  </body></html>;
}
