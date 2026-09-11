"use client";

export default function EventAdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const message = error?.message || "Something went wrong while managing this event.";
  return (
    <main>
      <section className="pageHero compactHero dashboardHero">
        <p className="eyebrow">SHIFT LEFT STUDIO · EVENTS</p>
        <h1>We couldn't complete that event update.</h1>
        <p className="lead">{message}</p>
      </section>
      <section className="memberDashboard">
        <article className="dashboardCard">
          <h2>What to check</h2>
          <p>If this happened while adding a discount code, make sure the event discounts database migration has been run in Supabase.</p>
          <p><code>supabase/migrations/20260911_event_discounts.sql</code></p>
          <button className="button" onClick={() => reset()}>Try again</button>
        </article>
      </section>
    </main>
  );
}
