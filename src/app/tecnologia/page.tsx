import Image from "next/image";
import { fabrica } from "@/lib/data";
import { previa } from "@/lib/lqip";
import { metadataDaPagina } from "@/lib/seo";

export const metadata = metadataDaPagina({
  titulo: "Tecnologia & Fábrica",
  descricao:
    "Scanner 3D, planejamento digital e fabricação própria de alinhadores em Anápolis. Conheça a fábrica da Ortoative por dentro.",
  caminho: "/tecnologia",
});

export default function TecnologiaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28">
      <h1 className="text-4xl md:text-5xl">Tecnologia & Fábrica</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-lg text-muted-foreground">
        <p>
          O que nenhuma marca grande mostra, a gente faz questão de abrir: o processo
          completo de fabricação do seu alinhador, aqui em Anápolis.
        </p>
        <p>
          Tudo começa no escaneamento intraoral — sem massinha, sem enjoo. A partir dele o
          caso é planejado digitalmente, dente por dente, definindo quanto cada um precisa
          se mover e em que ordem. Esse plano vira uma sequência de modelos impressos em
          3D, um para cada etapa do tratamento.
        </p>
        <p>
          Sobre esses modelos as placas são termoformadas, recortadas, polidas e
          conferidas uma a uma. Como o laboratório é nosso, o prazo não depende de
          fornecedor: se um dente não se mover como o planejado, a placa nova é produzida
          aqui mesmo, sem reabrir pedido com terceiros. Quem planeja o seu caso é quem
          fabrica.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {fabrica.map((e) => (
          <article
            key={e.src}
            className="overflow-hidden rounded-2xl border border-border/70"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={e.src}
                alt={e.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                {...previa(e.src)}
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl text-primary">{e.titulo}</h2>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                {e.texto}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
