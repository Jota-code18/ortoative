import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Metadata de uma página interna.
 *
 * O canonical e o og:url PRECISAM ser próprios de cada rota. Herdados do
 * layout, apontariam todas as páginas para a home e o Google trataria o site
 * inteiro como conteúdo duplicado da raiz.
 */
export function metadataDaPagina({
  titulo,
  descricao,
  caminho,
}: {
  titulo: string;
  descricao: string;
  /** rota começando com "/" */
  caminho: string;
}): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.name,
      url: `${site.url}${caminho}`,
      title: `${titulo} | ${site.name}`,
      description: descricao,
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | ${site.name}`,
      description: descricao,
    },
  };
}
