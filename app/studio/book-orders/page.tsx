import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import OrderFulfillmentForm from "./OrderFulfillmentForm";
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

  const { data: orders } = await supabase.from("book_orders").select("id,product_name,customer_name,customer_email,customer_phone,quantity,unit_amount,shipping_amount,tax_amount,total_amount,payment_status,fulfillment_status,shipping_name,shipping_address,shipping_carrier,tracking_number,internal_notes,paid_at,shipped_at,delivered_at,created_at").order("created_at", { ascending: false }).limit(100);
  const allOrders = orders || [];
  const paidOrders = allOrders.filter(order => order.payment_status === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const booksSold = paidOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
  const pendingShipment = paidOrders.filter(order => ["unfulfilled", "preparing"].includes(order.fulfillment_status)).length;
  const shipped = paidOrders.filter(order => order.fulfillment_status === "shipped").length;

  return <main>
    <section className="pageHero compactHero dashboardHero"><p className="eyebrow">SHIFT LEFT STUDIO · BOOK ORDERS</p><h1>Book store operations.</h1><p className="lead">Track sales, payment status, shipping, tracking, and fulfillment for direct book purchases.</p></section>
    <nav className="journeyNav studioNav"><Link href="/studio">Overview</Link><Link href="/studio/members">Members</Link><Link href="/studio/assessments">Assessments</Link><Link href="/studio/leads">Leads</Link><Link href="/studio/book-orders">Book Orders</Link></nav>
    <section className="memberDashboard">
      <div className="dashboardGrid">
        <article className="dashboardCard"><p className="eyebrow">REVENUE</p><div className="dashboardScore">{money(revenue)}</div><h2>Paid direct orders</h2></article>
        <article className="dashboardCard"><p className="eyebrow">BOOKS SOLD</p><div className="dashboardScore">{booksSold}</div><h2>Paid copies</h2></article>
        <article className="dashboardCard"><p className="eyebrow">TO SHIP</p><div className="dashboardScore">{pendingShipment}</div><h2>Pending fulfillment</h2></article>
        <article className="dashboardCard"><p className="eyebrow">IN TRANSIT</p><div className="dashboardScore">{shipped}</div><h2>Marked shipped</h2></article>
      </div>
      <div className="historyList">
        <div className="dashboardCard"><p className="eyebrow">ORDERS</p><h2>{allOrders.length} direct order{allOrders.length === 1 ? "" : "s"}</h2><p>Sandbox orders remain visible while testing; live orders will use the same workflow after the Stripe keys are switched.</p></div>
        {allOrders.map(order => {
          const address = (order.shipping_address || {}) as Record<string, string | null>;
          const addressText = [address.line1, address.line2, address.city, address.state, address.postal_code].filter(Boolean).join(", ");
          return <article className="dashboardCard leadCard" key={order.id}>
            <div className="leadHeader"><div><p className="eyebrow">{new Date(order.created_at).toLocaleString()}</p><h2>{order.customer_name || order.shipping_name || "Pending customer"}</h2><p>{order.customer_email ? <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a> : "Email pending"}{order.customer_phone ? ` · ${order.customer_phone}` : ""}</p></div><div className="leadBadges"><span>{order.payment_status}</span><span>{order.fulfillment_status}</span></div></div>
            <p><strong>{order.product_name}</strong> · Qty {order.quantity}</p>
            <p><strong>Total:</strong> {money(order.total_amount)} <span className="purchaseNote">(book {money((order.unit_amount || 0) * order.quantity)} + shipping {money(order.shipping_amount)}{order.tax_amount ? ` + tax ${money(order.tax_amount)}` : ""})</span></p>
            {addressText && <p><strong>Ship to:</strong> {addressText}</p>}
            {order.tracking_number && <p><strong>Tracking:</strong> {order.shipping_carrier ? `${order.shipping_carrier} · ` : ""}{order.tracking_number}</p>}
            <p className="purchaseNote">Order ID: {order.id}{order.paid_at ? ` · Paid ${new Date(order.paid_at).toLocaleString()}` : ""}{order.shipped_at ? ` · Shipped ${new Date(order.shipped_at).toLocaleString()}` : ""}{order.delivered_at ? ` · Delivered ${new Date(order.delivered_at).toLocaleString()}` : ""}</p>
            <OrderFulfillmentForm orderId={order.id} fulfillmentStatus={order.fulfillment_status} shippingCarrier={order.shipping_carrier} trackingNumber={order.tracking_number} internalNotes={order.internal_notes} />
          </article>;
        })}
        {!allOrders.length && <div className="dashboardCard"><h2>No book orders yet.</h2><p>Completed Stripe test and live purchases will appear here.</p></div>}
      </div>
    </section>
  </main>;
}
