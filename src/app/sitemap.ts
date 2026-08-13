import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Rotas estáticas do site. Blog entra aqui quando o CMS existir. */
const rotas = [
  { caminho: "", prioridade: 1 },
  { caminho: "/alinhadores", prioridade: 0.9 },
  { caminho: "/agende", prioridade: 0.9 },
  { caminho: "/procedimentos", prioridade: 0.8 },
  { caminho: "/procedimentos/ortodontia-fixa", prioridade: 0.7 },
  { caminho: "/procedimentos/implantes", prioridade: 0.7 },
  { caminho: "/procedimentos/estetica", prioridade: 0.7 },
  { caminho: "/procedimentos/protese", prioridade: 0.6 },
  { caminho: "/procedimentos/canal", prioridade: 0.6 },
  { caminho: "/procedimentos/gengivas", prioridade: 0.6 },
  { caminho: "/procedimentos/cirurgias", prioridade: 0.6 },
  { caminho: "/equipe", prioridade: 0.7 },
  { caminho: "/tecnologia", prioridade: 0.7 },
  { caminho: "/para-dentistas", prioridade: 0.6 },
  { caminho: "/blog", prioridade: 0.5 },
  { caminho: "/privacidade", prioridade: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return rotas.map(({ caminho, prioridade }) => ({
    url: `${site.url}${caminho}`,
    lastModified: agora,
    changeFrequency: caminho === "" || caminho === "/blog" ? "weekly" : "monthly",
    priority: prioridade,
  }));
}
