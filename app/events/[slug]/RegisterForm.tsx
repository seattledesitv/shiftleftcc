"use client";

import { useMemo, useState } from "react";

type TicketType = { id:string; name:string; description:string|null; price_amount:number; quantity_available:number|null; max_per_order:number };

export default function RegisterForm({ eventId, ticketTypes }: { eventId:string; ticketTypes:TicketType[] }) {
  const [ticketTypeId,setTicketTypeId] = useState(ticketTypes[0]?.id || "");
  const [quantity,setQuantity] = useState(1);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const selected = useMemo(()=>ticketTypes.find(t=>t.id===ticketTypeId),[ticketTypes,ticketTypeId]);

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/events/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({eventId,ticketTypeId,quantity,name,email,phone})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      setMessage(`Registration confirmed. Ticket reference: ${data.ticketCodes?.join(", ") || data.orderId}`);
      setName(""); setPhone(""); setQuantity(1);
    } catch(err) { setMessage(err instanceof Error ? err.message : "Registration failed."); }
    finally { setBusy(false); }
  }

  if (!ticketTypes.length) return <div className="contentCard"><h2>Registration is not open yet.</h2></div>;
  return <form onSubmit={submit} className="contentCard" style={{display:"grid",gap:14}}>
    <p className="eyebrow">REGISTER</p><h2>Choose your ticket</h2>
    <label>Ticket type<select value={ticketTypeId} onChange={e=>setTicketTypeId(e.target.value)}>{ticketTypes.map(t=><option key={t.id} value={t.id}>{t.name} — {t.price_amount===0?"Free":`$${(t.price_amount/100).toFixed(2)}`}</option>)}</select></label>
    <label>Quantity<input type="number" min={1} max={selected?.max_per_order || 10} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
    <label>Name<input required value={name} onChange={e=>setName(e.target.value)} /></label>
    <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <label>Phone <span style={{fontWeight:400}}>(optional)</span><input value={phone} onChange={e=>setPhone(e.target.value)} /></label>
    {selected?.description && <p>{selected.description}</p>}
    <button className="button" disabled={busy}>{busy ? "Processing…" : selected?.price_amount ? "Continue to secure payment" : "Register free"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
