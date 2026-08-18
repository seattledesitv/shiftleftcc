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
  is_visible: boolean;
  is_cta: boolean;
  auth_visibility: "public" | "authenticated" | "admin";
  open_new_tab: boolean;
};

const fallbackHeader: NavItem[] = [
  { id: "home", location: "header", label: "Home", href: "/", parent_id: null, display_order: 10, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "method", location: "header", label: "The Shift Left Method", href: "/why-shift-left", parent_id: null, display_order: 20, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "services", location: "header", label: "Coaching & Services", href: "/programs", parent_id: null, display_order: 30, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "organizations", location: "header", label: "Organizations", href: "/organizations", parent_id: null, display_order: 40, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "books", location: "header", label: "Books", href: "/books", parent_id: null, display_order: 50, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "resources", location: "header", label: "Resources", href: "/resources", parent_id: null, display_order: 60, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "about", location: "header", label: "About Bharath", href: "/my-story", parent_id: null, display_order: 70, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "journey", location: "header", label: "My Journey", href: "/my-journey", parent_id: null, display_order: 80, is_visible: true, is_cta: false, auth_visibility: "authenticated", open_new_tab: false },
  { id: "studio", location: "header", label: "Studio", href: "/studio", parent_id: null, display_order: 90, is_visible: true, is_cta: false, auth_visibility: "admin", open_new_tab: false },
  { id: "start", location: "header", label: "Start Your Journey", href: "/book", parent_id: null, display_order: 100, is_visible: true, is_cta: true, auth_visibility: "public", open_new_tab: false },
];

const fallbackDiscover: NavItem[] = [
  { id: "fd1", location: "footer_discover", label: "Home", href: "/", parent_id: null, display_order: 10, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fd2", location: "footer_discover", label: "The Shift Left Method", href: "/why-shift-left", parent_id: null, display_order: 20, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fd3", location: "footer_discover", label: "About Bharath", href: "/my-story", parent_id: null, display_order: 30, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fd4", location: "footer_discover", label: "How It Works", href: "/how-it-works", parent_id: null, display_order: 40, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
];

const fallbackExplore: NavItem[] = [
  { id: "fe1", location: "footer_explore", label: "Coaching & Services", href: "/programs", parent_id: null, display_order: 10, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fe2", location: "footer_explore", label: "Organizations", href: "/organizations", parent_id: null, display_order: 20, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fe3", location: "footer_explore", label: "Books", href: "/books", parent_id: null, display_order: 30, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fe4", location: "footer_explore", label: "Resources", href: "/resources", parent_id: null, display_order: 40, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
  { id: "fe5", location: "footer_explore", label: "Blog", href: "/blog", parent_id: null, display_order: 50, is_visible: true, is_cta: false, auth_visibility: "public", open_new_tab: false },
];

function isAllowed(item: NavItem, user: { id: string } | null, isAdmin: boolean) {
  if (!item.is_visible) return false;
  if (item.auth_visibility === "admin") return isAdmin;
  if (item.auth_visibility === "authenticated") return Boolean(user);
  return true;
}

function normalizeHref(href: string) {
  const value = href.trim();
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "").toLowerCase();
  if (value === "/") return "/";
  return (`/${value.replace(/^\/+|\/+$/g, "")}`).toLowerCase();
}

function dedupeNavigation(items: NavItem[]) {
  const seen = new Set<string>();
  return [...items]
    .sort((a, b) => a.display_order - b.display_order)
    .filter(item => {
      const key = `${item.location}:${item.parent_id || "root"}:${normalizeHref(item.href)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function ensureHeaderHome(items: NavItem[]) {
  const hasHome = items.some(item => !item.parent_id && item.is_visible && normalizeHref(item.href) === "/");
  if (hasHome) return items;
  return [fallbackHeader[0], ...items];
}

const defaultSubmenus: Record<string, Array<{ label: string; href: string }>> = {
  "/programs": [
    { label: "Coaching Programs", href: "/programs" },
    { label: "Consulting", href: "/consulting" },
    { label: "Speaking & Workshops", href: "/speaking" },
    { label: "Wellbeing Assessment", href: "/wellbeing-assessment" },
  ],
  "/resources": [
    { label: "Resource Hub", href: "/resources" },
    { label: "Blog", href: "/blog" },
    { label: "Assessments", href: "/wellbeing-assessment" },
  ],
  "/my-story": [
    { label: "My Journey", href: "/my-story" },
    { label: "Why Work With Me", href: "/why-me" },
  ],
};

function ensureDefaultSubmenus(items: NavItem[]) {
  const output = [...items];
  const parents = output.filter(item => !item.parent_id && item.location === "header");
  for (const parent of parents) {
    const defaults = defaultSubmenus[normalizeHref(parent.href)];
    if (!defaults) continue;
    const existing = output.filter(item => item.parent_id === parent.id);
    defaults.forEach((child, index) => {
      if (existing.some(item => normalizeHref(item.href) === normalizeHref(child.href))) return;
      output.push({
        id: `virtual-${parent.id}-${index}`,
        location: "header",
        label: child.label,
        href: child.href,
        parent_id: parent.id,
        display_order: (index + 1) * 10,
        is_visible: true,
        is_cta: false,
        auth_visibility: "public",
        open_new_tab: false,
      });
    });
  }
  return dedupeNavigation(output);
}

function SmartLink({ item, className, children }: { item: NavItem; className?: string; children?: React.ReactNode }) {
  const external = /^https?:\/\//i.test(item.href);
  if (external) return <a href={item.href} className={className} target={item.open_new_tab ? "_blank" : undefined} rel={item.open_new_tab ? "noopener noreferrer" : undefined}>{children || item.label}</a>;
  return <Link href={item.href} className={className} target={item.open_new_tab ? "_blank" : undefined}>{children || item.label}</Link>;
}

function HeaderNavigation({ items, user, isAdmin }: { items: NavItem[]; user: { id: string } | null; isAdmin: boolean }) {
  const allowed = ensureDefaultSubmenus(ensureHeaderHome(items).filter(item => isAllowed(item, user, isAdmin)));
  const topLevel = allowed.filter(item => !item.parent_id).sort((a, b) => a.display_order - b.display_order);
  return <>{topLevel.map(item => {
    const children = allowed.filter(child => child.parent_id === item.id).sort((a, b) => a.display_order - b.display_order);
    if (children.length) return <details className={`navDropdown${item.is_cta ? " navCtaDropdown" : ""}`} key={item.id}>
      <summary className={item.is_cta ? "navCta" : undefined}><span>{item.label}</span><span className="navChevron" aria-hidden="true">⌄</span></summary>
      <div className="navDropdownMenu">
        <SmartLink item={item} className="navDropdownOverview">Overview</SmartLink>
        {children.map(child => <SmartLink item={child} key={child.id} className={child.is_cta ? "navCta" : undefined} />)}
      </div>
    </details>;
    return <SmartLink item={item} key={item.id} className={item.is_cta ? "navCta" : undefined} />;
  })}</>;
}

function FooterNavigation({ items, user, isAdmin }: { items: NavItem[]; user: { id: string } | null; isAdmin: boolean }) {
  return <>{dedupeNavigation(items.filter(item => !item.parent_id && isAllowed(item, user, isAdmin))).map(item => <SmartLink item={item} key={item.id} />)}</>;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { id: string; email?: string } | null = null;
  let isAdmin = false;
  let tagline = "Notice earlier. Learn continuously. Care intentionally.";
  let contactEmail = "info@shiftleftcc.com";
  let onlineMessage = "100% Online · Available across the U.S. and worldwide via Zoom or Microsoft Teams";
  let headerItems = fallbackHeader;
  let discoverItems = fallbackDiscover;
  let exploreItems = fallbackExplore;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      isAdmin = Boolean(admin);
    }
    const [{ data: publicSettings }, { data: navigation }] = await Promise.all([
      supabase.from("platform_settings").select("category,key,value").eq("is_public", true).in("key", ["tagline","primary_email","service_delivery"]),
      supabase.from("navigation_items").select("id,location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab").order("display_order"),
    ]);
    for (const setting of publicSettings || []) {
      if (setting.category === "general" && setting.key === "tagline" && typeof setting.value === "string") tagline = setting.value;
      if (setting.category === "contact" && setting.key === "primary_email" && typeof setting.value === "string") contactEmail = setting.value;
      if (setting.category === "contact" && setting.key === "service_delivery" && typeof setting.value === "string") onlineMessage = setting.value;
    }
    if (navigation?.length) {
      const nav = navigation as NavItem[];
      const header = nav.filter(item => item.location === "header");
      const discover = nav.filter(item => item.location === "footer_discover");
      const explore = nav.filter(item => item.location === "footer_explore");
      if (header.length) headerItems = header;
      if (discover.length) discoverItems = discover;
      if (explore.length) exploreItems = explore;
    }
  } catch {}

  return <html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="siteHeader">
      <Link href="/" className="brandLockup" aria-label="Shift Left Coaching and Consulting home"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={150} height={66} priority /><span className="brandWords"><strong>Shift Left</strong><small>COACHING &amp; CONSULTING</small><em>{tagline}</em></span></Link>
      <div className="headerNavStack">
        <nav aria-label="Main navigation"><HeaderNavigation items={headerItems} user={user} isAdmin={isAdmin} />{user ? <form className="headerAuth" action="/auth/signout" method="post"><button type="submit" className="authNavButton" title={user.email || "Signed in"}>Logout</button></form> : <Link href="/login">Login</Link>}</nav>
      </div>
    </header>
    {children}
    <footer><div className="footerBrand"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={190} height={84} /><strong>SHIFT LEFT COACHING &amp; CONSULTING</strong><p>{tagline}</p><p className="finePrint">{onlineMessage}</p></div><div><strong>Discover</strong><FooterNavigation items={discoverItems} user={user} isAdmin={isAdmin} /></div><div><strong>Explore</strong><FooterNavigation items={exploreItems} user={user} isAdmin={isAdmin} /></div><div><strong>Connect</strong>{user ? <form action="/auth/signout" method="post"><button className="footerAuthButton" type="submit">Logout</button></form> : <Link href="/login">Member login</Link>}<Link href="/book">Start your journey</Link><a href={`mailto:${contactEmail}`}>{contactEmail}</a><p>© 2026 Experience Healing LLC</p><p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p></div></footer>
  </body></html>;
}