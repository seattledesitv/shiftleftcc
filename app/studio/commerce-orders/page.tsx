import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

function money(cents:number|null){return `$${((cents||0)/100).toFixed(2)}`;}

export default async function StudioCommerceOrdersPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login?next=/studio/commerce-orders");
  const {data:admin}=await supabase.from("admins").select("role").eq("user_id",user.id).maybeSingle();
  if(!admin) redirect("/my-journey");
  const {data:orders}=await supabase.from("commerce_orders").select("id,product_name,product_type,customer_name,customer_email,customer_phone,total_amount,payment_status,fulfillment_status,paid_at,created_at").order("created_at",{ascending:false}).limit(100);
  const paid=(orders||[]).filter(o=>o.payment_status==="paid");
  const revenue=paid.reduce((sum,o)=>sum+(o.total_amount||0),0);
  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · COMMERCE ORDERS</p><h1>Program &amp; service purchases.</h1><p className="lead">Review direct Stripe purchases for coaching, programs, workshops, assessments, and future digital products.</p></section><nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/commerce">Commerce</Link><Link href="/studio/commerce-orders">Orders</Link><Link href="/studio/books">Books</Link><Link href="/studio/book-orders">Book Orders</Link></nav><section className="memberDashboard"><div className="dashboardGrid"><article className="dashboardCard"><p className="eyebrow">PAID REVENUE</p><div className="dashboardScore">{money(revenue)}</div><h2>{paid.length} paid purchase{paid.length===1?"":"s"}</h2></article><article className="dashboardCard"><p className="eyebrow">TOTAL ORDERS</p><div className="dashboardScore">{orders?.length||0}</div><h2>Program &amp; service orders</h2></article></div><div className="historyList" style={{marginTop:24}}>{(orders||[]).map(order=><article className="dashboardCard leadCard" key={order.id}><div className="leadHeader"><div><p className="eyebrow">{new Date(order.created_at).toLocaleString()} · {order.product_type}</p><h2>{order.product_name}</h2><p>{order.customer_name||"Customer pending"}{order.customer_email?` · ${order.customer_email}`:""}{order.customer_phone?` · ${order.customer_phone}`:""}</p></div><div className="leadBadges"><span>{order.payment_status}</span><span>{order.fulfillment_status}</span></div></div><p><strong>Total:</strong> {money(order.total_amount)}</p><p className="purchaseNote">Order ID: {order.id}{order.paid_at?` · Paid ${new Date(order.paid_at).toLocaleString()}`:""}</p></article>)}{!orders?.length&&<div className="dashboardCard"><h2>No program purchases yet.</h2><p>Direct Stripe purchases will appear here.</p></div>}</div></section></main>;
}
