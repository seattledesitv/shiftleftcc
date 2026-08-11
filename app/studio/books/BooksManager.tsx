"use client";

import { useState } from "react";

type Book = { id:string; slug:string; title:string; subtitle:string|null; description:string|null; cover_image_url:string|null; price_amount:number; shipping_amount:number; status:string; featured:boolean; display_order:number; };

export default function BooksManager({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [message, setMessage] = useState("");

  async function save(book: Book) {
    setMessage("Saving...");
    const response = await fetch(`/api/studio/books/${book.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ title:book.title, subtitle:book.subtitle, description:book.description, price:(book.price_amount/100).toFixed(2), shipping:(book.shipping_amount/100).toFixed(2), status:book.status, featured:book.featured, displayOrder:book.display_order }) });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error || "Unable to save book.");
    setMessage(`${book.title} saved.`);
  }

  function patch(id:string, changes:Partial<Book>) { setBooks(current => current.map(book => book.id === id ? {...book,...changes} : book)); }

  return <div className="historyList">
    {message && <div className="dashboardCard"><strong>{message}</strong></div>}
    {books.map(book => <article className="dashboardCard" key={book.id}>
      <div className="leadHeader"><div><p className="eyebrow">{book.slug}</p><h2>{book.title}</h2></div><div className="leadBadges"><span>{book.status}</span>{book.featured && <span>Featured</span>}</div></div>
      <div className="activityFormGrid">
        <label>Title<input value={book.title} onChange={e=>patch(book.id,{title:e.target.value})}/></label>
        <label>Subtitle<input value={book.subtitle || ""} onChange={e=>patch(book.id,{subtitle:e.target.value})}/></label>
        <label>Price ($)<input type="number" min="0" step="0.01" value={(book.price_amount/100).toFixed(2)} onChange={e=>patch(book.id,{price_amount:Math.round(Number(e.target.value)*100)})}/></label>
        <label>U.S. shipping ($)<input type="number" min="0" step="0.01" value={(book.shipping_amount/100).toFixed(2)} onChange={e=>patch(book.id,{shipping_amount:Math.round(Number(e.target.value)*100)})}/></label>
        <label>Status<select value={book.status} onChange={e=>patch(book.id,{status:e.target.value})}><option value="active">Active</option><option value="draft">Draft</option><option value="inactive">Inactive</option></select></label>
        <label>Display order<input type="number" value={book.display_order} onChange={e=>patch(book.id,{display_order:Number(e.target.value)})}/></label>
      </div>
      <label className="goalForm">Description<textarea rows={4} value={book.description || ""} onChange={e=>patch(book.id,{description:e.target.value})}/></label>
      <label><input type="checkbox" checked={book.featured} onChange={e=>patch(book.id,{featured:e.target.checked})}/> Featured book</label>
      <div className="actions"><button className="button primary" onClick={()=>save(book)}>Save book</button></div>
    </article>)}
  </div>;
}
