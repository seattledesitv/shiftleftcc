import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shift Left Coaching | Wellbeing Before Crisis",
  description:
    "Coaching and consulting that helps individuals, families, leaders, and organizations build awareness, resilience, and practical skills earlier.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link href="/" className="brandLockup" aria-label="Shift Left Coaching home">
            <Image src="/shift-left-logo.svg" alt="" width={112} height={54} priority />
            <span className="brandWords"><strong>SHIFT LEFT</strong><small>COACHING</small><em>Awareness. Empowerment. Action.</em></span>
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
          <div className="footerBrand"><Image src="/shift-left-logo.svg" alt="Shift Left Coaching" width={150} height={70} /><strong>SHIFT LEFT COACHING</strong><p>Wellbeing before challenges become crises.</p></div>
          <div><strong>Explore</strong><Link href="/#offerings">Coaching</Link><Link href="/consulting">Consulting</Link><Link href="/resources">Resources</Link><Link href="/blog">Blog</Link></div>
          <div><strong>Connect</strong><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a><p>© 2026 Experience Healing LLC</p></div>
          <p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p>
        </footer>
      </body>
    </html>
  );
}