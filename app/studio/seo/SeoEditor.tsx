"use client";

import { FormEvent, useState } from "react";

type SeoPage = {
  id: string;
  path: string;
  page_name: string;
  seo_title: string;
  meta_description: string;
  keywords: string[];
  canonical_url: string | null;
  og_image: string | null;
  schema_type: string;
  index_page: boolean;
  sitemap_enabled: boolean;
  sitemap_priority: number;
  change_frequency: string;
  notes: string | null;
};

export default function SeoEditor({ page }: { page: SeoPage }) {
  const [status, setStatus] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving…");
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/studio/seo/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageName: data.get("pageName"),
        seoTitle: data.get("seoTitle"),
        metaDescription: data.get("metaDescription"),
        keywords: data.get("keywords"),
        canonicalUrl: data.get("canonicalUrl"),
        ogImage: data.get("ogImage"),
        schemaType: data.get("schemaType"),
        indexPage: data.get("indexPage") === "on",
        sitemapEnabled: data.get("sitemapEnabled") === "on",
        priority: data.get("priority"),
        changeFrequency: data.get("changeFrequency"),
        notes: data.get("notes"),
      }),
    });
    const result = await response.json();
    setStatus(response.ok ? "Saved." : result.error || "Unable to save.");
  }

  return <form className="dashboardCard seoEditor" onSubmit={save}>
    <div className="leadHeader"><div><p className="eyebrow">{page.path}</p><h2>{page.page_name}</h2></div><span className="assessmentStatus">{page.index_page ? "Indexed" : "No index"}</span></div>
    <label>Page name<input name="pageName" defaultValue={page.page_name} /></label>
    <label>SEO title<input name="seoTitle" defaultValue={page.seo_title} maxLength={70} /><small>{page.seo_title.length} characters currently</small></label>
    <label>Meta description<textarea name="metaDescription" rows={3} defaultValue={page.meta_description} maxLength={180} /></label>
    <label>Focus keywords<textarea name="keywords" rows={2} defaultValue={(page.keywords || []).join(", ")} /><small>Comma-separated. Use natural language in page content; keywords are planning guidance, not a ranking shortcut.</small></label>
    <div className="activityFormGrid"><label>Canonical URL<input name="canonicalUrl" defaultValue={page.canonical_url || ""} /></label><label>Open Graph image<input name="ogImage" defaultValue={page.og_image || "/shift-left-logo.svg"} /></label></div>
    <div className="activityFormGrid"><label>Schema type<select name="schemaType" defaultValue={page.schema_type}>{["WebPage","CollectionPage","Service","Book","AboutPage","Blog","Article","FAQPage","Product"].map(value => <option key={value}>{value}</option>)}</select></label><label>Change frequency<select name="changeFrequency" defaultValue={page.change_frequency}>{["always","hourly","daily","weekly","monthly","yearly","never"].map(value => <option key={value}>{value}</option>)}</select></label></div>
    <label>Sitemap priority<input name="priority" type="number" min="0" max="1" step="0.1" defaultValue={page.sitemap_priority} /></label>
    <div className="journalTags"><label><input name="indexPage" type="checkbox" defaultChecked={page.index_page} /> Allow search indexing</label><label><input name="sitemapEnabled" type="checkbox" defaultChecked={page.sitemap_enabled} /> Include in sitemap</label></div>
    <label>Admin notes<textarea name="notes" rows={2} defaultValue={page.notes || ""} /></label>
    <div className="actions"><button className="button primary" type="submit">Save SEO settings</button>{status && <span>{status}</span>}</div>
  </form>;
}
