import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.shiftleftcc.com";
  const routes = ["", "/why-shift-left", "/my-story", "/why-me", "/programs", "/organizations", "/consulting", "/speaking", "/resources", "/blog", "/book", "/wellbeing-assessment"];
  return routes.map((route, index) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: index === 0 ? "weekly" : "monthly", priority: index === 0 ? 1 : 0.7 }));
}
