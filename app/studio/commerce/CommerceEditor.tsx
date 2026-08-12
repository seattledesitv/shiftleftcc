"use client";

import { useState } from "react";

type Product = { id:string; title:string; subtitle:string|null; description:string|null; duration_label:string|null; price_amount:number|null; pricing_mode:string; purchase_enabled:boolean; status:string; featured:boolean; scheduling_url:string|null; display_order:number; product_type:string; audience:string|null };

export default function CommerceEditor({ products }: { products: Product[] }) {
  const [items, setItems] = useState(products);
  const [message, setMessage] = useState<Record<string,string>>({});

  const updateLocal = (id:string, patch:Partial<Product>) => setItems(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
  const save = async (item:Product) => {
    setMessage(current => ({ ...current, [item.id]: "Saving..." }));
    const response = await fetch(`/api/studio/commerce/${item.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
      title:item.title, subtitle:item.subtitle, description:item.description, durationLabel:item.duration_label,
      price:item.price_amount === null ? "" : item.price_amount / 100, pricingMode:item.pricing_mode,
      purchaseEnabled:item.purchase_enabled, status:item.status, featured:item.featured,
      schedulingUrl:item.scheduling_url, displayOrder:item.display_order,
    }) });
    const result = await response.json();
    setMessage(current => ({ ...current, [item.id]: response.ok ? "Saved" : (result.error || "Save failed") }));
  };

  return <div className="historyList">{items.map(item => <article className="dashboardCard" key={item.id}>
    <div className="leadHeader"><div><p className="eyebrow">{item.product_type.toUpperCase()} · {item.audience || "GENERAL"}</p><h2>{item.title}</h2></div><div className="leadBadges"><span>{item.status}</span><span>{item.pricing_mode}</span></div></div>
    <div className="activityFormGrid">
      <label>Title<input value={item.title} onChange={e=>updateLocal(item.id,{title:e.target.value})}/></label>
      <label>Duration / package<input value={item.duration_label || ""} onChange={e=>updateLocal(item.id,{duration_label:e.target.value})}/></label>
      <label>Price ($)<input type="number" min="0" step="0.01" value={item.price_amount === null ? "" : item.price_amount/100} onChange={e=>updateLocal(item.id,{price_amount:e.target.value === "" ? null : Math.round(Number(e.target.value)*100)})}/></label>
      <label>Pricing mode<select value={item.pricing_mode} onChange={e=>updateLocal(item.id,{pricing_mode:e.target.value})}><option value="fixed">Fixed price</option><option value="starting_at">Starting at</option><option value="custom">Custom / discovery call</option></select></label>
      <label>Status<select value={item.status} onChange={e=>updateLocal(item.id,{status:e.target.value})}><option value="active">Active</option><option value="draft">Draft</option><option value="inactive">Inactive</option></select></label>
      <label>Display order<input type="number" value={item.display_order} onChange={e=>updateLocal(item.id,{display_order:Number(e.target.value)})}/></label>
    </div>
    <label className="commerceWideField">Description<textarea rows={4} value={item.description || ""} onChange={e=>updateLocal(item.id,{description:e.target.value})}/></label>
    <label className="commerceWideField">Scheduling URL (optional)<input value={item.scheduling_url || ""} onChange={e=>updateLocal(item.id,{scheduling_url:e.target.value})} placeholder="https://..."/></label>
    <div className="actions"><label><input type="checkbox" checked={item.purchase_enabled} disabled={item.pricing_mode !== "fixed"} onChange={e=>updateLocal(item.id,{purchase_enabled:e.target.checked})}/> Enable direct Stripe purchase</label><label><input type="checkbox" checked={item.featured} onChange={e=>updateLocal(item.id,{featured:e.target.checked})}/> Featured</label><button className="button primary" onClick={()=>save(item)}>Save</button><span>{message[item.id]}</span></div>
  </article>)}</div>;
}
