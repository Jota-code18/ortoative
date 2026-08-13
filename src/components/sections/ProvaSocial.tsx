import NumeroAnimado from "@/components/NumeroAnimado";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import Reveal from "@/components/Reveal";
import { depoimentos, stats } from "@/lib/data";

/**
 * Mockup: sorrisos transformados | clientes atendidos | procedimentos,
 * carrossel de antes/depois, quadrados de depoimentos (procedimento, nome, idade).
 */
export default function ProvaSocial() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.rotulo} delay={i * 80}>
              <div className="rounded-xl border border-border/70 p-6 transition-colors hover:bg-realce">
                <p className="text-4xl font-extrabold text-primary">
                  <NumeroAnimado valor={s.valor} />
                </p>
                <p className="mt-1 text-base font-semibold text-muted-foreground">
                  {s.rotulo}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-10 text-center text-3xl md:text-4xl">
            Sorrisos que já <span className="text-brand-green-text">transformamos</span>
          </h2>
        </Reveal>

        {/* TODO: carrossel real de antes/depois quando as fotos chegarem */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 90}>
              <PhotoPlaceholder
                label={`Antes & Depois — caso ${n}`}
                path={`public/images/antes-depois/caso-0${n}.jpg`}
                className="aspect-square"
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {depoimentos.map((d, i) => (
            <Reveal key={d.nome} delay={i * 90}>
              <figure className="h-full rounded-xl border border-border/70 p-6 transition-colors hover:bg-realce">
                <blockquote className="text-base text-muted-foreground">
                  “{d.texto}”
                </blockquote>
                <figcaption className="mt-4 text-base">
                  {/* cite marca quem é o autor da citação acima */}
                  <cite className="font-bold not-italic">{d.nome}</cite>
                  {d.idade ? `, ${d.idade} anos` : ""}
                  <span className="block text-brand-green-text">{d.procedimento}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
