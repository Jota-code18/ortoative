import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { whatsappLink } from "@/lib/site";
import { metadataDaPagina } from "@/lib/seo";

export const metadata = metadataDaPagina({
  titulo: "Alinhadores Ortoative — fabricação própria em Anápolis",
  descricao:
    "Alinhadores invisíveis planejados e fabricados pela própria Ortoative em Anápolis. Escaneamento 3D, planejamento digital e acompanhamento completo.",
  caminho: "/alinhadores",
});


const etapas = [
  {
    titulo: "Escaneamento 3D",
    texto: "Sem massinha: seu sorriso é digitalizado em minutos no scanner intraoral.",
  },
  {
    titulo: "Planejamento digital",
    texto: "Cada movimento dos dentes é planejado pelo Dr. Rui e equipe, dente a dente.",
  },
  {
    titulo: "Fabricação própria",
    texto: "Seus alinhadores são produzidos aqui em Anápolis, na nossa fábrica.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Trocas programadas e a mesma equipe do início ao fim do tratamento.",
  },
];

export default function AlinhadoresPage() {
  return (
    <div className="pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="max-w-3xl text-4xl md:text-5xl">
          O único alinhador <span className="text-primary">fabricado</span> em Anápolis
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Marcas grandes enviam seu caso para fora. Aqui, quem planeja é quem fabrica —
          e quem fabrica é quem te acompanha.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {etapas.map((e, i) => (
            <div key={e.titulo} className="rounded-xl border border-border/70 p-6 transition-colors hover:bg-realce">
              <span className="text-3xl font-extrabold text-brand-green-text">{i + 1}</span>
              <h3 className="mt-2 text-lg">{e.titulo}</h3>
              <p className="mt-2 text-base text-muted-foreground">{e.texto}</p>
            </div>
          ))}
        </div>

        {/* TODO: fotos da fábrica + simulações + FAQ + comparativo completo */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <PhotoPlaceholder
            label="Foto: produção do alinhador na fábrica"
            path="public/images/fabrica/producao-01.jpg"
            className="aspect-[4/3]"
          />
          <PhotoPlaceholder
            label="Foto: alinhador em uso / detalhe"
            path="public/images/alinhadores/detalhe-01.jpg"
            className="aspect-[4/3]"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/agende"
            className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
          >
            Fazer avaliação rápida
          </Link>
          <a
            href={whatsappLink("Oi, vi a página do alinhador Ortoative e quero saber mais.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-brand-green px-6 py-3 font-bold text-brand-green-text hover:bg-brand-green-btn hover:text-white"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
