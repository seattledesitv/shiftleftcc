import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/my-journey/", "/studio/", "/api/"] },
    ],
    sitemap: "https://www.shiftleftcc.com/sitemap.xml",
    host: "https://www.shiftleftcc.com",
  };
}
