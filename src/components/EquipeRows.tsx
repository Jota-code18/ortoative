import Image from "next/image";
import Reveal from "@/components/Reveal";
import { equipe, type Profissional } from "@/lib/data";

/**
 * Lista da equipe em linhas: foto à esquerda, dados à direita.
 * Cada linha surge conforme o scroll desce (fade + deslize + desfoque),
 * com stagger interno entre foto e texto.
 */
function Linha({ p }: { p: Profissional }) {
  return (
    <article className="group grid grid-cols-[92px_1fr] items-start gap-5 border-t border-border py-7 transition-colors hover:bg-realce md:grid-cols-[150px_1fr] md:gap-8 md:py-9">
      <Reveal from="left" delay={60}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={p.foto}
            alt={p.nome}
            fill
            sizes="(max-width: 768px) 92px, 150px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Reveal>

      <Reveal from="bottom" delay={140}>
        <h3 className="text-lg leading-tight transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
          {p.nome}
        </h3>

        <p className="mt-1 text-sm font-semibold text-brand-green-text md:text-base">
          {p.titulo}
          {p.cro ? ` · ${p.cro}` : ""}
        </p>

        <div className="mt-3 space-y-1 text-base text-muted-foreground">
          {p.formacao.map((f) => (
            <p key={f}>{f}</p>
          ))}
          {p.especializacoes.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>

        {p.destaques && (
          <ul className="mt-3 space-y-1 border-l-2 border-brand-green/40 pl-4 text-base text-muted-foreground">
            {p.destaques.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </Reveal>
    </article>
  );
}

export default function EquipeRows({ limite }: { limite?: number }) {
  const lista = limite ? equipe.slice(0, limite) : equipe;
  return (
    <div className="border-b border-border">
      {lista.map((p) => (
        <Linha key={p.slug} p={p} />
      ))}
    </div>
  );
}
