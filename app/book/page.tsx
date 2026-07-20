import Link from "next/link";

export default function BookPage() {
  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">BOOK A DISCOVERY CALL</p>
      <h1>Your next shift can begin with one thoughtful conversation.</h1>
      <p className="lead">This complimentary 30-minute call is a chance to share what you are navigating, understand the Shift Left approach, and identify a practical next step.</p>
    </section>

    <section className="contact bookingSection">
      <div>
        <p className="eyebrow">WHAT TO EXPECT</p>
        <h2>A clear, human starting point.</h2>
        <ul>
          <li>Share the challenge, transition, opportunity, or organizational need in front of you.</li>
          <li>Explore whether coaching, consulting, speaking, or a workshop is the best fit.</li>
          <li>Leave with a recommended next step—without pressure to commit.</li>
        </ul>
        <p><strong>Duration:</strong> 30 minutes</p>
        <p><strong>Cost:</strong> Complimentary</p>
        <p><strong>Format:</strong> Video or phone conversation</p>
      </div>

      <form action="mailto:info@shiftleftcc.com" method="post" encType="text/plain">
        <label>Full name<input name="name" required /></label>
        <label>Email<input type="email" name="email" required /></label>
        <label>Phone number<input type="tel" name="phone" /></label>
        <label>I am reaching out for<select name="audience" defaultValue="Myself">
          <option>Myself</option>
          <option>My family</option>
          <option>My team or organization</option>
          <option>A school or university</option>
          <option>A nonprofit or community group</option>
          <option>A speaking event</option>
        </select></label>
        <label>I am interested in<select name="interest" defaultValue="Discovery call">
          <option>Discovery call</option>
          <option>Shift Left Foundations</option>
          <option>Career Clarity &amp; Transition</option>
          <option>Executive Wellbeing Coaching</option>
          <option>Stronger Family Conversations</option>
          <option>Mental Fitness for Logical Minds</option>
          <option>The Shift Left Strategy Workshop</option>
          <option>Leadership &amp; Team Wellbeing</option>
          <option>Custom School or Community Program</option>
          <option>Consulting</option>
          <option>Speaking</option>
        </select></label>
        <label>Organization or event name<input name="organization" placeholder="Optional" /></label>
        <label>What would you like to discuss?<textarea name="message" rows={5} required /></label>
        <label>Preferred days or times<textarea name="availability" rows={3} placeholder="For example: weekday mornings or Tuesday after 3 PM Pacific" /></label>
        <button className="button primary" type="submit">Request my discovery call</button>
        <p className="finePrint">Submitting this form opens your email application with the request details. A calendar-based scheduler will be added in the next booking phase.</p>
      </form>
    </section>

    <section className="contentTeaser">
      <div><p className="eyebrow">EXPLORE FIRST</p><h2>Learn more before booking.</h2><p>Read about the strategy, browse current programs, explore organizational solutions, or understand the engagement process.</p></div>
      <div className="contentLinks"><Link href="/why-shift-left">The Shift Left Strategy →</Link><Link href="/programs">Programs →</Link><Link href="/organizations">Organizations →</Link><Link href="/how-it-works">How it works →</Link></div>
    </section>
  </main>;
}
