import type { Metadata } from "next";
import Link from "next/link";
import CheckoutClient from "./CheckoutClient";
import "./checkout.css";

export const metadata: Metadata = {
  title: "Buy Ego and Empathy",
  description: "Purchase the regular paperback edition of Ego and Empathy by Bharath Kumar Arekapudi with secure U.S. checkout.",
  robots: { index: false, follow: false },
};

export default function BookCheckoutPage() {
  return <main className="bookCheckoutPage">
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">SECURE BOOK CHECKOUT</p>
      <h1>Complete your order.</h1>
      <p className="lead">Ego and Empathy · Regular paperback · $19.99 plus $5 U.S. shipping.</p>
    </section>
    <section className="bookCheckoutSection">
      <CheckoutClient />
      <p className="checkoutBack"><Link href="/books/ego-and-empathy">← Return to the book page</Link></p>
    </section>
  </main>;
}
