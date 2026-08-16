import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* /gravacao é o bastidor do render dos passeios, não conteúdo do site;
         /api/ recebe lead e não deve ser rastreada. */
      disallow: ["/gravacao", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
