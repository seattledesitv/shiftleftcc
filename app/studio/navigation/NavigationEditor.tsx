"use client";

import { FormEvent, useMemo, useState } from "react";

type NavItem = {
  id: string;
  location: "header" | "footer_discover" | "footer_explore";
  label: string;
  href: string;
  parent_id: string | null;
  display_order: number;
  is_visible: boolean;
  is_cta: boolean;
  auth_visibility: "public" | "authenticated" | "admin";
  open_new_tab: boolean;
};

export default function NavigationEditor({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState("");
  const parents = useMemo(() => items.filter(item => item.location === "header" && !item.parent_id), [items]);

  async function save(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("Saving…");
    const response = await fetch("/api/studio/navigation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        label: data.get("label"),
        href: data.get("href"),
        location: data.get("location"),
        parentId: data.get("parentId") || null,
        displayOrder: data.get("displayOrder"),
        authVisibility: data.get("authVisibility"),
        isVisible: data.get("isVisible") === "on",
        isCta: data.get("isCta") === "on",
        openNewTab: data.get("openNewTab") === "on",
      }),
    });
    const result = await response.json();
    if (response.ok) {
      setItems(current => current.map(item => item.id === id ? result.item : item).sort((a,b) => a.display_order - b.display_order));
      setStatus("Saved.");
    } else setStatus(result.error || "Unable to save.");
  }

  async function addItem() {
    setStatus("Adding…");
    const response = await fetch("/api/studio/navigation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: "New navigation item", href: "/", location: "header", displayOrder: items.length * 10 + 10 }) });
    const result = await response.json();
    if (response.ok) { setItems(current => [...current, result.item]); setStatus("Added."); }
    else setStatus(result.error || "Unable to add.");
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this navigation item? Child items will also be deleted.")) return;
    const response = await fetch("/api/studio/navigation", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const result = await response.json();
    if (response.ok) { setItems(current => current.filter(item => item.id !== id && item.parent_id !== id)); setStatus("Deleted."); }
    else setStatus(result.error || "Unable to delete.");
  }

  return <div className="historyList">
    <div className="dashboardCard"><div className="leadHeader"><div><p className="eyebrow">NAVIGATION BUILDER</p><h2>{items.length} menu items</h2><p>Edit labels, URLs, order, visibility and dropdown relationships. Lower order numbers appear first.</p></div><button className="button primary" type="button" onClick={addItem}>Add menu item</button></div>{status && <p className="purchaseNote">{status}</p>}</div>
    {items.map(item => <form className="dashboardCard navigationEditor" key={item.id} onSubmit={event => save(event, item.id)}>
      <div className="leadHeader"><div><p className="eyebrow">{item.location.replace("_", " ")}</p><h2>{item.label}</h2></div><span className="assessmentStatus">{item.is_visible ? "Visible" : "Hidden"}</span></div>
      <div className="activityFormGrid"><label>Label<input name="label" defaultValue={item.label} required /></label><label>URL<input name="href" defaultValue={item.href} required /></label></div>
      <div className="activityFormGrid"><label>Location<select name="location" defaultValue={item.location}><option value="header">Header</option><option value="footer_discover">Footer · Discover</option><option value="footer_explore">Footer · Explore</option></select></label><label>Order<input name="displayOrder" type="number" defaultValue={item.display_order} /></label></div>
      <div className="activityFormGrid"><label>Parent / dropdown<select name="parentId" defaultValue={item.parent_id || ""}><option value="">Top level</option>{parents.filter(parent => parent.id !== item.id).map(parent => <option value={parent.id} key={parent.id}>{parent.label}</option>)}</select></label><label>Audience<select name="authVisibility" defaultValue={item.auth_visibility}><option value="public">Everyone</option><option value="authenticated">Signed-in members</option><option value="admin">Admins only</option></select></label></div>
      <div className="journalTags"><label><input name="isVisible" type="checkbox" defaultChecked={item.is_visible} /> Visible</label><label><input name="isCta" type="checkbox" defaultChecked={item.is_cta} /> CTA styling</label><label><input name="openNewTab" type="checkbox" defaultChecked={item.open_new_tab} /> Open in new tab</label></div>
      <div className="actions"><button className="button primary" type="submit">Save item</button><button className="button secondary" type="button" onClick={() => remove(item.id)}>Delete</button></div>
    </form>)}
  </div>;
}
