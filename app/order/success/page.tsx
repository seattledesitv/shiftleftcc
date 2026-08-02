import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false, follow: false } };

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let status = "processing";
  let email: string | null = null;
  let amount: number | null = null;

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      status = session.payment_status;
      email = session.customer_details?.email || session.customer_email || null;
      amount = session.amount_total;
    } catch {}
  }

  const paid = status === "paid";
  return <main>
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">ORDER CONFIRMATION</p>
      <h1>{paid ? "Thank you for your order." : "We are confirming your payment."}</h1>
      <p className="lead">{paid ? "Your order for Ego and Empathy has been received." : "Payment confirmation may take a moment. Please do not submit another order."}</p>
    </section>
    <section className="memberDashboard"><div className="dashboardCard" style={{ maxWidth: 760, margin: "0 auto" }}>
      <h2>{paid ? "Payment confirmed" : "Confirmation in progress"}</h2>
      {email && <p>A receipt and order updates will be associated with <strong>{email}</strong>.</p>}
      {amount !== null && <p><strong>Order total:</strong> ${(amount / 100).toFixed(2)}</p>}
      <p>U.S. orders include standard shipping. You may contact <a href="mailto:info@shiftleftcc.com">info@shiftleftcc.com</a> with questions.</p>
      <div className="actions"><Link className="button primary" href="/books/ego-and-empathy">Return to the book page</Link><Link className="button secondary" href="/">Explore Shift Left</Link></div>
    </div></section>
  </main>;
}
