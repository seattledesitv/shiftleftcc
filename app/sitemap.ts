import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.shiftleftcc.com";
  const routes = ["", "/why-shift-left", "/my-story", "/why-me", "/programs", "/organizations", "/consulting", "/speaking", "/books/ego-and-empathy", "/resources", "/blog", "/book", "/wellbeing-assessment"];
  return routes.map((route, index) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: index === 0 ? "weekly" : "monthly", priority: index === 0 ? 1 : route === "/books/ego-and-empathy" ? 0.9 : 0.7 }));
}
