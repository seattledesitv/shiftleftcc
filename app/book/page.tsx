"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

function newChallenge() {
  return { left: Math.floor(Math.random() * 8) + 2, right: Math.floor(Math.random() * 8) + 2 };
}

export default function BookPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [challenge, setChallenge] = useState({ left: 3, right: 4 });
  useEffect(() => { setChallenge(newChallenge()); }, []);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form).entries()), captchaLeft: challenge.left, captchaRight: challenge.right };
    try {
      const response = await fetch("/api/discovery-call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your request.");
      setStatus("success"); setMessage("Thank you. Your request was sent successfully, and we will follow up shortly with online meeting options."); form.reset(); setChallenge(newChallenge());
    } catch (caught) { setStatus("error"); setMessage(caught instanceof Error ? caught.message : "Unable to send your request."); setChallenge(newChallenge()); }
  }

  return <main>
    <section className="pageHero compactHero"><p className="eyebrow">ONLINE DISCOVERY CALL</p><h1>Your next shift can begin with one thoughtful conversation.</h1><p className="lead">This complimentary 30-minute discovery call is held online, so you can join from anywhere. Share what you are navigating, understand the Shift Left approach, and identify a practical next step.</p><p><strong>100% virtual · Zoom or Microsoft Teams · U.S. and international clients welcome</strong></p></section>
    <section className="contact bookingSection"><div><p className="eyebrow">WHAT TO EXPECT</p><h2>A clear, human starting point—online.</h2><ul><li>Share the challenge, transition, opportunity, or organizational need in front of you.</li><li>Explore whether coaching, consulting, speaking, or a workshop is the best fit.</li><li>Leave with a recommended next step—without pressure to commit.</li></ul><p><strong>Duration:</strong> 30 minutes</p><p><strong>Cost:</strong> Complimentary</p><p><strong>Format:</strong> Online video conversation via Zoom or Microsoft Teams</p><p><strong>Location:</strong> Join from anywhere; no in-person visit is required.</p></div>
      <form action="/api/discovery-call" method="post" onSubmit={submitRequest} autoComplete="on">
        <label>Full name<input name="name" autoComplete="name" required /></label><label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" /></label>
        <label>I am reaching out for<select name="audience" defaultValue="Myself"><option>Myself</option><option>My family</option><option>My team or organization</option><option>A school or university</option><option>A nonprofit or community group</option><option>A speaking event</option></select></label>
        <label>I am interested in<select name="interest" defaultValue="Discovery call"><option>Discovery call</option><option>Shift Left Foundations</option><option>Career Clarity &amp; Transition</option><option>Executive Wellbeing Coaching</option><option>Stronger Family Conversations</option><option>Mental Fitness for Logical Minds</option><option>The Shift Left Strategy Workshop</option><option>Leadership &amp; Team Wellbeing</option><option>Custom School or Community Program</option><option>Consulting</option><option>Speaking</option></select></label>
        <label>Organization or event name<input name="organization" autoComplete="organization" placeholder="Optional" /></label><label>What would you like to discuss?<textarea name="message" rows={5} required /></label><label>Preferred days or times<textarea name="availability" rows={3} placeholder="For example: weekday mornings or Tuesday after 3 PM Pacific" /></label>
        <label className="captchaField">Security check: What is {challenge.left} + {challenge.right}?<input type="number" name="captchaAnswer" inputMode="numeric" min="0" max="20" autoComplete="off" required /></label><label className="honeypotField" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="button primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request my online discovery call"}</button>{message && <p className={`formStatus ${status}`}>{message}</p>}<p className="finePrint">Your request is sent securely from the website. We will follow up with a virtual meeting option.</p>
      </form>
    </section>
    <section className="contentTeaser"><div><p className="eyebrow">EXPLORE FIRST</p><h2>Learn more before booking.</h2><p>Read about the strategy, browse online programs, explore organizational solutions, or understand the engagement process.</p></div><div className="contentLinks"><Link href="/why-shift-left">The Shift Left Strategy →</Link><Link href="/programs">Programs →</Link><Link href="/organizations">Organizations →</Link><Link href="/how-it-works">How it works →</Link></div></section>
  </main>;
}
