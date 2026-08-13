import { metadataDaPagina } from "@/lib/seo";

export const metadata = metadataDaPagina({
  titulo: "Blog",
  descricao:
    "Conteúdo aberto da Ortoative sobre alinhadores, ortodontia e saúde bucal — para pacientes e profissionais.",
  caminho: "/blog",
});
/** TODO: CMS/MDX na fase 4 — pauta inicial já definida na proposta */
const pautaInicial = [
  "Quando o alinhador resolve — e quando precisa de aparelho fixo",
  "Posso usar alinhador sendo adulto?",
  "Posso comer com alinhador?",
  "Diferença entre alinhador Ortoative e marcas importadas",
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-28">
      <h1 className="text-4xl md:text-5xl">Blog Ortoative</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Conhecimento aberto sobre procedimentos — para pacientes e para outros
        profissionais. Em breve.
      </p>
      <div className="mt-10 space-y-4">
        {pautaInicial.map((titulo) => (
          <div key={titulo} className="rounded-xl border border-border/70 p-6 transition-colors hover:bg-realce">
            <h2 className="text-lg">{titulo}</h2>
            <p className="mt-1 text-base font-semibold text-brand-green-text">Em breve</p>
          </div>
        ))}
      </div>
    </div>
  );
}
