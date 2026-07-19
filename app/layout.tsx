import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shift Left Coaching & Consulting | Wellbeing Before Crisis",
  description:
    "Coaching and consulting that helps individuals, families, leaders, and organizations build awareness, resilience, practical skills, brands, and community impact earlier.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link href="/" className="brandLockup" aria-label="Shift Left Coaching and Consulting home">
            <Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={150} height={66} priority />
            <span className="brandWords">
              <strong>Shift Left</strong>
              <small>COACHING &amp; CONSULTING</small>
              <em>Awareness. Empowerment. Action.</em>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/#offerings">Coaching</Link>
            <Link href="/consulting">Consulting</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#contact" className="navCta">Book a Discovery Call</Link>
          </nav>
        </header>
        {children}
        <footer>
          <div className="footerBrand">
            <Image src="/shift-left-logo.svg" alt="Shift Left Coaching and Consulting" width={190} height={84} />
            <strong>SHIFT LEFT COACHING &amp; CONSULTING</strong>
            <p>Wellbeing before challenges become crises.</p>
          </div>
          <div><strong>Explore</strong><Link href="/#offerings">Coaching</Link><Link href="/consulting">Consulting</Link><Link href="/resources">Resources</Link><Link href="/blog">Blog</Link></div>
          <div><strong>Connect</strong><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a><p>© 2026 Experience Healing LLC</p></div>
          <p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p>
        </footer>
      </body>
    </html>
  );
}
