import type { Metadata } from "next";
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
          <Link href="/" className="wordmark" aria-label="Shift Left Coaching home">
            <span>SHIFT LEFT</span>
            <small>COACHING & CONSULTANCY</small>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/#offerings">Offerings</Link>
            <Link href="/#logo-story">Our Story</Link>
            <Link href="/consulting">Consulting</Link>
            <Link href="/#contact" className="navCta">Discovery Call</Link>
          </nav>
        </header>
        {children}
        <footer>
          <div><strong>SHIFT LEFT COACHING</strong><p>Wellbeing before challenges become crises.</p></div>
          <div><a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a><p>© 2026 Experience Healing LLC</p></div>
          <p className="finePrint">Coaching and educational content do not replace licensed medical or psychological care.</p>
        </footer>
      </body>
    </html>
  );
}