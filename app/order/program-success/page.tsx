import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default async function ProgramSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let order: any = null;
  let product: any = null;

  if (session_id && stripeKey && supabaseUrl && serviceKey) {
    try {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const orderId = session.metadata?.commerceOrderId;
      if (orderId) {
        const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
        const { data } = await admin.from("commerce_orders").select("id,product_id,product_name,total_amount,payment_status,customer_email").eq("id", orderId).maybeSingle();
        order = data;
        if (data?.product_id) {
          const { data: productData } = await admin.from("commerce_products").select("success_message,scheduling_url").eq("id", data.product_id).maybeSingle();
          product = productData;
        }
      }
    } catch {}
  }

  return <main><section className="pageHero compactHero dashboardHero"><p className="eyebrow">PURCHASE CONFIRMATION</p><h1>Thank you. Your program is confirmed.</h1><p className="lead">{order?.product_name || "Your Shift Left program"} has been received.</p></section><section className="memberDashboard"><div className="dashboardCard" style={{maxWidth:760,margin:"0 auto"}}><h2>{order?.payment_status === "paid" ? "Payment confirmed" : "Order received"}</h2>{product?.success_message && <p>{product.success_message}</p>}{order?.total_amount != null && <p><strong>Order total:</strong> ${(order.total_amount/100).toFixed(2)}</p>}{order?.customer_email && <p>Confirmation and updates are associated with <strong>{order.customer_email}</strong>.</p>}<div className="actions">{product?.scheduling_url && <a className="button primary" href={product.scheduling_url}>Schedule your session</a>}<Link className="button secondary" href="/programs">Explore programs</Link><Link className="button secondary" href="/my-journey">My Journey</Link></div></div></section></main>;
}
