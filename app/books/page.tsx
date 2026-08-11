import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import "./store.css";

export default async function BooksPage() {
  const supabase = await createClient();
  const { data: books } = await supabase.from("books").select("id,slug,title,subtitle,description,cover_image_url,price_amount,shipping_amount,featured").eq("status","active").order("display_order");
  return <main className="bookStorePage"><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT BOOKS</p><h1>Books for stronger thinking and wellbeing.</h1><p className="lead">Purchase directly from Shift Left using secure Stripe checkout. U.S. shipping only.</p></section><section className="bookStoreGrid">{(books || []).map(book => <article className="bookStoreCard" key={book.id}><img className="bookStoreCover" src={book.cover_image_url || "/books/ego-empathy-cover.svg"} alt={`${book.title} cover`} /><div>{book.featured && <p className="eyebrow">FEATURED</p>}<h2>{book.title}</h2>{book.subtitle && <p><strong>{book.subtitle}</strong></p>}<p>{book.description}</p><p className="bookStorePrice">${(book.price_amount/100).toFixed(2)}</p><p className="purchaseNote">+ ${(book.shipping_amount/100).toFixed(2)} U.S. shipping</p><div className="bookStoreActions"><Link className="button secondary" href={`/books/${book.slug}`}>Learn more</Link><Link className="button primary" href={`/checkout/${book.slug}`}>Buy Now</Link></div></div></article>)}</section></main>;
}
