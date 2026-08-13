import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const base = "https://www.shiftleftcc.com";
const fallbackRoutes = ["", "/why-shift-left", "/my-story", "/why-me", "/programs", "/organizations", "/consulting", "/speaking", "/books", "/books/mind-fitness", "/books/ego-and-empathy", "/resources", "/blog", "/book", "/wellbeing-assessment"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { data } = await supabase.from("seo_pages").select("path,sitemap_priority,change_frequency,updated_at").eq("sitemap_enabled", true).eq("index_page", true).order("path");
      if (data?.length) return data.map(row => ({
        url: row.path === "/" ? `${base}/` : `${base}${row.path}`,
        lastModified: new Date(row.updated_at),
        changeFrequency: row.change_frequency as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: Number(row.sitemap_priority),
      }));
    } catch {}
  }
  return fallbackRoutes.map((route, index) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: index === 0 ? "weekly" : "monthly", priority: index === 0 ? 1 : 0.7 }));
}
