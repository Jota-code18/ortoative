import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { fabrica } from "@/lib/data";
import { previa } from "@/lib/lqip";

/**
 * Tecnologia & Fábrica — o diferencial que nenhuma marca grande mostra.
 * Fotos reais do laboratório da Ortoative.
 */

export default function TecnologiaBlog() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <Reveal>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-green-text">
          Tecnologia & Fábrica
        </p>
        <h2 className="text-3xl md:text-4xl">
          A única clínica da região que <span className="text-primary">fabrica</span> o
          próprio alinhador
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-muted-foreground md:text-lg">
          <p>
            Quase toda clínica que oferece alinhador é revendedora: escaneia o paciente,
            envia o caso para uma indústria — muitas vezes em outro estado ou país — e
            espera semanas pelas placas. A Ortoative faz o caminho inteiro dentro de casa,
            do escaneamento à última troca.
          </p>
          <p>
            Na prática isso muda três coisas para você. O prazo encurta, porque não há
            transporte nem fila de terceiro. A correção de rota é rápida: se um dente não
            se moveu como o planejado, uma placa nova é produzida aqui mesmo, sem reabrir
            pedido com fornecedor. E quem planeja o seu caso é quem fabrica, o que elimina
            o telefone-sem-fio entre o consultório e a indústria.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fabrica.map((e, i) => (
          <Reveal key={e.src} delay={i * 80}>
            <article className="h-full overflow-hidden rounded-2xl border border-border/70 transition-colors hover:bg-realce">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={e.src}
                  alt={e.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  {...previa(e.src)}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg text-primary">{e.titulo}</h3>
                <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                  {e.texto}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/tecnologia"
            className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
          >
            Conhecer a fábrica
          </Link>
          <Link
            href="/blog"
            className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Ler o Blog
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
