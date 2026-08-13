import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl = "https://www.shiftleftcc.com";

type Defaults = { title: string; description: string; keywords?: string[]; image?: string; index?: boolean };

export async function seoMetadata(path: string, defaults: Defaults): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let row: any = null;
  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const result = await supabase.from("seo_pages").select("seo_title,meta_description,keywords,canonical_url,og_image,index_page").eq("path", path).maybeSingle();
      row = result.data;
    } catch {}
  }
  const title = row?.seo_title || defaults.title;
  const description = row?.meta_description || defaults.description;
  const image = row?.og_image || defaults.image || "/shift-left-logo.svg";
  const canonical = row?.canonical_url || `${siteUrl}${path === "/" ? "/" : path}`;
  const index = typeof row?.index_page === "boolean" ? row.index_page : defaults.index !== false;
  return {
    title,
    description,
    keywords: row?.keywords?.length ? row.keywords : defaults.keywords,
    alternates: { canonical },
    robots: { index, follow: index },
    openGraph: { type: "website", title, description, url: canonical, images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
