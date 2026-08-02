"use client";

import { useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutClient() {
  const [quantity, setQuantity] = useState(1);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const result = await response.json();
    if (!response.ok || !result.clientSecret) throw new Error(result.error || "Unable to start checkout.");
    return result.clientSecret as string;
  }, [quantity]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);
  const subtotal = 19.99 * quantity;
  const totalBeforeTax = subtotal + 5;

  if (!stripePromise) return <div className="checkoutNotice">Stripe checkout is not configured yet.</div>;

  return <div className="checkoutLayout">
    <aside className="checkoutSummary">
      <p className="eyebrow">ORDER SUMMARY</p>
      <h2>Ego and Empathy</h2>
      <p>Regular paperback · U.S. shipping only</p>
      {!started && <label>Quantity
        <select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>
          {[1,2,3,4,5,6,7,8,9,10].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>}
      <div className="checkoutTotals">
        <div><span>Book{quantity > 1 ? "s" : ""}</span><strong>${subtotal.toFixed(2)}</strong></div>
        <div><span>Shipping</span><strong>$5.00</strong></div>
        <div className="checkoutGrandTotal"><span>Total before tax</span><strong>${totalBeforeTax.toFixed(2)}</strong></div>
      </div>
      <p className="purchaseNote">Applicable sales tax, when enabled, is calculated from the shipping address.</p>
      {!started && <button className="button primary" onClick={() => { setError(""); setStarted(true); }}>Continue to secure payment</button>}
      {started && <button className="button secondary" onClick={() => setStarted(false)}>Change quantity</button>}
      {error && <p className="formStatus">{error}</p>}
    </aside>
    <section className="embeddedCheckoutWrap">
      {started ? <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider> : <div className="checkoutPlaceholder"><h3>Secure checkout</h3><p>Choose a quantity and continue. Payment details are handled securely by Stripe and are never stored by Shift Left.</p></div>}
    </section>
  </div>;
}
