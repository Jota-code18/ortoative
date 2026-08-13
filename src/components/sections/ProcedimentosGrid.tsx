import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { procedimentosGrade } from "@/lib/data";
import { previa } from "@/lib/lqip";

/**
 * Mockup: demais procedimentos — quadrados com imagem e nome.
 * A explicação de cada tratamento fica na página do procedimento, não aqui.
 */
export default function ProcedimentosGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <Reveal>
        <h2 className="text-3xl md:text-4xl">Conheça os demais procedimentos</h2>
      </Reveal>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {procedimentosGrade.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <Link
              href={`/procedimentos/${p.slug}`}
              className="group block overflow-hidden rounded-xl border border-border/70 transition-colors hover:bg-realce"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.imagem}
                  alt={p.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  {...previa(p.imagem)}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg group-hover:text-primary">{p.nome}</h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
