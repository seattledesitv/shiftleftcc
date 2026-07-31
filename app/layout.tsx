import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import "./globals.css";
import "./brand-overrides.css";
import "./platform-overrides.css";

export const metadata: Metadata = {
  title: "Shift Left Coaching & Consulting | Wellbeing Before Crisis",
  description: "The Shift Left Strategy helps people and organizations notice earlier, learn continuously, and care intentionally through coaching, consulting, speaking, and practical mental-fitness frameworks.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { email?: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Keep the public website available if authentication is temporarily unavailable.
  }

  return <html lang="en"><body>
    <header className="siteHeader">
      <Link href="/" className="brandLockup" aria-label="Shift Left Coaching and Consulting home">
        <Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={150} height={66} priority />
        <span className="brandWords"><strong>Shift Left</strong><small>COACHING &amp; CONSULTING</small><em>Notice. Learn. Care.</em></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/why-shift-left">Strategy</Link>
        <Link href="/my-story">My Story</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/organizations">Organizations</Link>
        <Link href="/consulting">Consulting</Link>
        <Link href="/speaking">Speaking</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/blog">Journal</Link>
        {user ? <form className="headerAuth" action="/auth/signout" method="post"><button type="submit" className="authNavButton" title={user.email || "Signed in"}>Logout</button></form> : <Link href="/login">Login</Link>}
        <Link href="/book" className="navCta">Book a Call</Link>
      </nav>
    </header>
    {children}
    <footer>
      <div className="footerBrand"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={190} height={84} /><strong>SHIFT LEFT COACHING &amp; CONSULTING</strong><p>Notice earlier. Learn continuously. Care intentionally.</p></div>
      <div><strong>Discover</strong><Link href="/">Home</Link><Link href="/why-shift-left">The Strategy</Link><Link href="/my-story">My Story</Link><Link href="/why-me">Why Me</Link><Link href="/for-who">Who It Is For</Link><Link href="/how-it-works">How It Works</Link></div>
      <div><strong>Explore</strong><Link href="/programs">Programs</Link><Link href="/organizations">Organizations</Link><Link href="/consulting">Consulting</Link><Link href="/speaking">Speaking</Link><Link href="/wellbeing-assessment">Wellbeing Assessment</Link><Link href="/assessment">Shift Left Check-In</Link><Link href="/resources">Resources</Link><Link href="/blog">Journal</Link></div>
      <div><strong>Connect</strong>{user ? <form action="/auth/signout" method="post"><button className="footerAuthButton" type="submit">Logout</button></form> : <Link href="/login">Member login</Link>}<Link href="/book">Book a discovery call</Link><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a><p>© 2026 Experience Healing LLC</p><p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p></div>
    </footer>
  </body></html>;
}
