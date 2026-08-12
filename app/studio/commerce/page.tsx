import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import CommerceEditor from "./CommerceEditor";
import "../../dashboard.css";

export default async function StudioCommercePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/commerce");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: products } = await supabase.from("commerce_products").select("id,title,subtitle,description,duration_label,price_amount,pricing_mode,purchase_enabled,status,featured,scheduling_url,display_order,product_type,audience").order("display_order");
  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · COMMERCE</p><h1>Products, programs &amp; pricing.</h1><p className="lead">Control pricing, direct Stripe purchase, customized engagements, visibility, and scheduling from one catalog.</p></section><nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/commerce">Commerce</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link><Link href="/studio/leads">Leads</Link></nav><section className="memberDashboard"><CommerceEditor products={(products || []) as any} /></section></main>;
}
