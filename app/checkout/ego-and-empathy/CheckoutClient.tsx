"use client";

import { useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type CheckoutDebug = {
  requestId?: string;
  stripeSecretMode?: string;
  sessionMode?: string;
  sessionId?: string;
  orderId?: string;
  stripeType?: string | null;
  stripeCode?: string | null;
  stripeRequestId?: string | null;
  supabaseUrlConfigured?: boolean;
  serviceRoleConfigured?: boolean;
};

export default function CheckoutClient() {
  const [quantity, setQuantity] = useState(1);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState<CheckoutDebug>({});

  const fetchClientSecret = useCallback(async () => {
    setError("");
    setDebug({});

    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const result = await response.json();
      setDebug({ requestId: result.requestId, ...(result.diagnostics || {}) });
      if (!response.ok || !result.clientSecret) throw new Error(result.error || "Unable to start checkout.");
      return result.clientSecret as string;
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.";
      setError(message);
      throw checkoutError;
    }
  }, [quantity]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);
  const subtotal = 19.99 * quantity;
  const totalBeforeTax = subtotal + 5;
  const publishableMode = publishableKey?.startsWith("pk_test_") ? "test" : publishableKey?.startsWith("pk_live_") ? "live" : publishableKey ? "unknown" : "missing";

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
      {!started && <button className="button primary" onClick={() => { setError(""); setDebug({}); setStarted(true); }}>Continue to secure payment</button>}
      {started && <button className="button secondary" onClick={() => { setStarted(false); setError(""); setDebug({}); }}>Change quantity</button>}
      {error && <div className="checkoutDebug error"><strong>Checkout error</strong><p>{error}</p></div>}
      {started && <div className="checkoutDebug">
        <strong>Checkout diagnostics</strong>
        <dl>
          <div><dt>Browser key mode</dt><dd>{publishableMode}</dd></div>
          {debug.stripeSecretMode && <div><dt>Server key mode</dt><dd>{debug.stripeSecretMode}</dd></div>}
          {typeof debug.supabaseUrlConfigured === "boolean" && <div><dt>Supabase URL</dt><dd>{debug.supabaseUrlConfigured ? "configured" : "MISSING"}</dd></div>}
          {typeof debug.serviceRoleConfigured === "boolean" && <div><dt>Service role key</dt><dd>{debug.serviceRoleConfigured ? "configured" : "MISSING"}</dd></div>}
          {debug.sessionMode && <div><dt>Session mode</dt><dd>{debug.sessionMode}</dd></div>}
          {debug.requestId && <div><dt>Request ID</dt><dd>{debug.requestId}</dd></div>}
          {debug.sessionId && <div><dt>Stripe session</dt><dd>{debug.sessionId}</dd></div>}
          {debug.stripeCode && <div><dt>Stripe code</dt><dd>{debug.stripeCode}</dd></div>}
          {debug.stripeRequestId && <div><dt>Stripe request</dt><dd>{debug.stripeRequestId}</dd></div>}
        </dl>
        <p className="purchaseNote">These values do not expose card details or secret keys.</p>
      </div>}
    </aside>
    <section className="embeddedCheckoutWrap">
      {started ? <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider> : <div className="checkoutPlaceholder"><h3>Secure checkout</h3><p>Choose a quantity and continue. Payment details are handled securely by Stripe and are never stored by Shift Left.</p></div>}
    </section>
  </div>;
}
