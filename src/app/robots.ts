import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // rota de recebimento de lead não deve ser rastreada
      disallow: ["/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
