import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import CheckoutClient from "../ego-and-empathy/CheckoutClient";
import "../ego-and-empathy/checkout.css";

export const metadata: Metadata = { title: "Buy Mind Fitness", description: "Purchase Mind Fitness: Through IT Strategies by Bharath Kumar Arekapudi with secure U.S. checkout.", robots: { index: false, follow: false } };

export default async function MindFitnessCheckoutPage() {
  const supabase = await createClient();
  const { data: book } = await supabase.from("books").select("slug,title,price_amount,shipping_amount,status").eq("slug", "mind-fitness").maybeSingle();
  if (!book || book.status !== "active") notFound();
  return <main className="bookCheckoutPage"><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SECURE BOOK CHECKOUT</p><h1>Complete your order.</h1><p className="lead">{book.title} · Regular paperback · ${(book.price_amount / 100).toFixed(2)} plus ${(book.shipping_amount / 100).toFixed(2)} U.S. shipping.</p></section><section className="bookCheckoutSection"><CheckoutClient bookSlug={book.slug} title={book.title} unitAmount={book.price_amount} shippingAmount={book.shipping_amount} /><p className="checkoutBack"><Link href="/books/mind-fitness">← Return to the book page</Link></p></section></main>;
}
