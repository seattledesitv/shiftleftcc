import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import "../../dashboard.css";

function money(cents: number | null) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

export default async function StudioBookOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/book-orders");
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/my-journey");

  const { data: orders } = await supabase.from("book_orders").select("id,product_name,customer_name,customer_email,customer_phone,quantity,unit_amount,shipping_amount,tax_amount,total_amount,payment_status,fulfillment_status,shipping_name,shipping_address,tracking_number,paid_at,created_at").order("created_at", { ascending: false }).limit(100);

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · BOOK ORDERS</p><h1>Book fulfillment.</h1><p className="lead">Review payment status, customer details, shipping information, and fulfillment for direct book purchases.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link><Link href="/studio/book-orders">Book Orders</Link></nav>
    <section className="memberDashboard"><div className="historyList">
      <div className="dashboardCard"><p className="eyebrow">ORDERS</p><h2>{orders?.length || 0} direct order{orders?.length === 1 ? "" : "s"}</h2></div>
      {(orders || []).map(order => {
        const address = (order.shipping_address || {}) as Record<string, string | null>;
        const addressText = [address.line1, address.line2, address.city, address.state, address.postal_code].filter(Boolean).join(", ");
        return <article className="dashboardCard leadCard" key={order.id}>
          <div className="leadHeader"><div><p className="eyebrow">{new Date(order.created_at).toLocaleString()}</p><h2>{order.customer_name || order.shipping_name || "Pending customer"}</h2><p>{order.customer_email ? <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a> : "Email pending"}{order.customer_phone ? ` · ${order.customer_phone}` : ""}</p></div><div className="leadBadges"><span>{order.payment_status}</span><span>{order.fulfillment_status}</span></div></div>
          <p><strong>{order.product_name}</strong> · Qty {order.quantity}</p>
          <p><strong>Total:</strong> {money(order.total_amount)} <span className="purchaseNote">(book {money((order.unit_amount || 0) * order.quantity)} + shipping {money(order.shipping_amount)}{order.tax_amount ? ` + tax ${money(order.tax_amount)}` : ""})</span></p>
          {addressText && <p><strong>Ship to:</strong> {addressText}</p>}
          {order.tracking_number && <p><strong>Tracking:</strong> {order.tracking_number}</p>}
          <p className="purchaseNote">Order ID: {order.id}{order.paid_at ? ` · Paid ${new Date(order.paid_at).toLocaleString()}` : ""}</p>
        </article>;
      })}
      {!orders?.length && <div className="dashboardCard"><h2>No book orders yet.</h2><p>Completed Stripe test and live purchases will appear here.</p></div>}
    </div></section>
  </main>;
}
