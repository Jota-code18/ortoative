export const site = {
  name: "Ortoative",
  // TODO: trocar pelo domínio real quando for registrado
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ortoative.com.br",
  tagline: "Clínica e fabricante de alinhadores invisíveis em Anápolis há mais de 26 anos.",
  // Número da clínica — formato 55DDDNÚMERO (sem espaços/traços)
  whatsapp: "556284983400",
  telefoneExibicao: "+55 62 8498-3400",
  instagram: "https://instagram.com/ortoativeoficial",
  unidades: ["Anápolis", "Goianésia"] as const,
};

export const nav = [
  { label: "Alinhadores", href: "/alinhadores" },
  { label: "+Procedimentos", href: "/procedimentos" },
  { label: "Equipe", href: "/equipe" },
  { label: "Para dentistas", href: "/para-dentistas" },
  { label: "Blog", href: "/blog" },
  { label: "Local", href: "/#local" },
  { label: "Agende Agora", href: "/agende", cta: true },
] as const;

/** Mensagem pré-preenchida do WhatsApp por página (Notion: específica por origem) */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages: Record<string, string> = {
  "/": "Oi! Vim pelo site da Ortoative e quero saber mais.",
  "/alinhadores": "Oi, vi a página do alinhador Ortoative e quero saber mais.",
  "/procedimentos": "Oi! Vi os procedimentos no site da Ortoative e quero saber mais.",
  "/para-dentistas": "Oi! Sou dentista e quero saber mais sobre a Ortoative.",
  "/equipe": "Oi! Vi a equipe no site da Ortoative e quero agendar uma avaliação.",
  "/agende": "Oi! Quero agendar uma avaliação na Ortoative.",
};
