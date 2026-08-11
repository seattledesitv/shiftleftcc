"use client";

import { useState } from "react";

export default function OrderFulfillmentForm({
  orderId,
  fulfillmentStatus,
  shippingCarrier,
  trackingNumber,
  internalNotes,
}: {
  orderId: string;
  fulfillmentStatus: string;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  internalNotes?: string | null;
}) {
  const [status, setStatus] = useState(fulfillmentStatus);
  const [carrier, setCarrier] = useState(shippingCarrier || "");
  const [tracking, setTracking] = useState(trackingNumber || "");
  const [notes, setNotes] = useState(internalNotes || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/studio/book-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus: status,
          shippingCarrier: carrier,
          trackingNumber: tracking,
          internalNotes: notes,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update order.");
      setMessage(result.emailStatus === "sent" ? "Saved. Shipping email sent." : result.emailStatus === "failed" ? `Saved, but email failed: ${result.emailError}` : "Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update order.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="orderFulfillmentForm">
    <label>Fulfillment status
      <select value={status} onChange={event => setStatus(event.target.value)}>
        <option value="unfulfilled">Unfulfilled</option>
        <option value="preparing">Preparing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </label>
    <label>Carrier
      <input value={carrier} onChange={event => setCarrier(event.target.value)} placeholder="USPS, UPS, FedEx..." />
    </label>
    <label>Tracking number
      <input value={tracking} onChange={event => setTracking(event.target.value)} placeholder="Tracking number" />
    </label>
    <label>Internal notes
      <textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} placeholder="Packing, customer, or fulfillment notes" />
    </label>
    <button type="button" className="button secondary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save fulfillment"}</button>
    {message && <p className="purchaseNote">{message}</p>}
  </div>;
}
