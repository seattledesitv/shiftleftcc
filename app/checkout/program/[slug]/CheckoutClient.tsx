"use client";

import { useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function ProgramCheckoutClient({ slug, title, priceAmount }: { slug: string; title: string; priceAmount: number }) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const fetchClientSecret = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/checkout/product", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, quantity: 1 }) });
      const result = await response.json();
      if (!response.ok || !result.clientSecret) throw new Error(result.error || "Unable to start checkout.");
      return result.clientSecret as string;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      throw checkoutError;
    }
  }, [slug]);
  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);
  if (!stripePromise) return <div className="checkoutNotice">Stripe checkout is not configured yet.</div>;

  return <div className="checkoutLayout">
    <aside className="checkoutSummary">
      <p className="eyebrow">ORDER SUMMARY</p><h2>{title}</h2><p>Program purchase · scheduling after payment</p>
      <div className="checkoutTotals"><div className="checkoutGrandTotal"><span>Total</span><strong>${(priceAmount / 100).toFixed(2)}</strong></div></div>
      {!started && <button className="button primary" onClick={() => setStarted(true)}>Continue to secure payment</button>}
      {started && <button className="button secondary" onClick={() => { setStarted(false); setError(""); }}>Back</button>}
      {error && <div className="checkoutDebug error"><strong>Checkout error</strong><p>{error}</p></div>}
    </aside>
    <section className="embeddedCheckoutWrap">{started ? <EmbeddedCheckoutProvider stripe={stripePromise} options={options}><EmbeddedCheckout /></EmbeddedCheckoutProvider> : <div className="checkoutPlaceholder"><h3>Secure checkout</h3><p>Payment is handled securely by Stripe. After payment, you will receive confirmation and next-step scheduling information.</p></div>}</section>
  </div>;
}
