import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import ProgramCheckoutClient from "./CheckoutClient";
import "../../ego-and-empathy/checkout.css";

export default async function ProgramCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("commerce_products").select("slug,title,description,duration_label,price_amount,purchase_enabled,pricing_mode,status").eq("slug", slug).maybeSingle();
  if (!product || product.status !== "active") notFound();
  if (!product.purchase_enabled || product.pricing_mode !== "fixed" || !product.price_amount) {
    return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">PROGRAM</p><h1>{product.title}</h1><p className="lead">Direct purchase is not enabled for this program yet.</p><div className="actions"><Link className="button primary" href={`/book?program=${encodeURIComponent(product.title)}`}>Request a customized conversation</Link><Link className="button secondary" href="/programs">Back to programs</Link></div></section></main>;
  }
  return <main className="bookCheckoutPage"><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SECURE PROGRAM CHECKOUT</p><h1>{product.title}</h1><p className="lead">{product.duration_label || product.description}</p></section><section className="bookCheckoutSection"><ProgramCheckoutClient slug={product.slug} title={product.title} priceAmount={product.price_amount} /><p className="checkoutBack"><Link href="/programs">← Return to programs</Link></p></section></main>;
}
