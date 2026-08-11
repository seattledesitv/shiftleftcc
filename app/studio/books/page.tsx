import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import BooksManager from "./BooksManager";
import "../../dashboard.css";

export default async function StudioBooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/books");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");
  const { data: books } = await supabase.from("books").select("id,slug,title,subtitle,description,cover_image_url,price_amount,shipping_amount,status,featured,display_order").order("display_order");
  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · BOOKS</p><h1>Manage the bookstore.</h1><p className="lead">Control book pricing, shipping, availability, featured placement, and descriptions without changing code.</p></section><nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link></nav><section className="memberDashboard"><BooksManager initialBooks={books || []} /></section></main>;
}
