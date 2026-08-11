import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import CheckoutClient from "./CheckoutClient";
import "./checkout.css";

export const metadata: Metadata = { title: "Buy Ego & Empathy", description: "Purchase Ego & Empathy by Bharath Kumar Arekapudi with secure U.S. checkout.", robots: { index: false, follow: false } };

export default async function BookCheckoutPage() {
  const supabase = await createClient();
  const { data: book } = await supabase.from("books").select("slug,title,price_amount,shipping_amount,status").eq("slug", "ego-and-empathy").maybeSingle();
  if (!book || book.status !== "active") notFound();
  return <main className="bookCheckoutPage"><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SECURE BOOK CHECKOUT</p><h1>Complete your order.</h1><p className="lead">{book.title} · Regular paperback · ${(book.price_amount / 100).toFixed(2)} plus ${(book.shipping_amount / 100).toFixed(2)} U.S. shipping.</p></section><section className="bookCheckoutSection"><CheckoutClient bookSlug={book.slug} title={book.title} unitAmount={book.price_amount} shippingAmount={book.shipping_amount} /><p className="checkoutBack"><Link href="/books/ego-and-empathy">← Return to the book page</Link></p></section></main>;
}
