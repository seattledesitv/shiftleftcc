"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TicketType = { id:string; name:string; description:string|null; price_amount:number; quantity_available:number|null; max_per_order:number };

export default function RegisterForm({ eventId, ticketTypes, isAuthenticated }: { eventId:string; ticketTypes:TicketType[]; isAuthenticated:boolean }) {
  const [ticketTypeId,setTicketTypeId] = useState(ticketTypes[0]?.id || "");
  const [quantity,setQuantity] = useState(1);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [discountCode,setDiscountCode] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [confirmed,setConfirmed] = useState(false);
  const selected = useMemo(()=>ticketTypes.find(t=>t.id===ticketTypeId),[ticketTypes,ticketTypeId]);

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage(""); setConfirmed(false);
    try {
      const res = await fetch("/api/events/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({eventId,ticketTypeId,quantity,name,email,phone,discountCode:discountCode.trim()})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      setConfirmed(true);
      setMessage(isAuthenticated ? "Thank you. Your registration is confirmed. Your ticket has been emailed to you and is also available in My Tickets." : "Thank you. Your registration is confirmed. Your ticket has been sent to the email address you provided.");
      setName(""); setPhone(""); setQuantity(1); setDiscountCode("");
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
    <label>Discount code <span style={{fontWeight:400}}>(optional)</span><input value={discountCode} onChange={e=>setDiscountCode(e.target.value.toUpperCase())} placeholder="Enter code" /></label>
    {selected?.description && <p>{selected.description}</p>}
    <button className="button" disabled={busy}>{busy ? "Processing…" : selected?.price_amount ? "Continue to secure payment" : "Register free"}</button>
    {message && <div role="status" style={{padding:14,borderRadius:14,background:confirmed?"rgba(47,143,45,.08)":"rgba(180,50,50,.06)"}}><p style={{margin:0}}>{message}</p>{confirmed && isAuthenticated && <p style={{margin:"10px 0 0"}}><Link href="/my-tickets"><strong>View My Tickets →</strong></Link></p>}</div>}
  </form>;
}
