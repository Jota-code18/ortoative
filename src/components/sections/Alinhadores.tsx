import Image from "next/image";
import Link from "next/link";
import NumeroAnimado from "@/components/NumeroAnimado";
import Reveal from "@/components/Reveal";
import { previa } from "@/lib/lqip";
import { whatsappLink } from "@/lib/site";

/**
 * Alinhadores — seção própria.
 *
 * Antes os dois tratamentos dividiam um bloco só, alternando num carrossel sob
 * o título "Alinhadores ou Ortodontia Fixa?". A pergunta era boa para o
 * comparativo, mas péssima para apresentar: o visitante que já quer alinhador
 * tinha de esperar o card certo aparecer, e o que queria fixo via primeiro o
 * outro. Cada tratamento agora se apresenta sozinho, e a comparação vem depois
 * — quando já se sabe o que está sendo comparado.
 */
const PONTOS = [
  "Praticamente invisível no dia a dia",
  "Você tira para comer e escovar",
  "Planejamento digital em 3D antes de começar",
  "Fabricado na nossa própria fábrica, em Anápolis",
];

export default function Alinhadores() {
  return (
    <section id="alinhadores" className="scroll-mt-20 py-5 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green-text">
            Alinhadores Ortoative
          </p>
          <h2 className="mt-1 text-3xl md:text-4xl">
            O sorriso alinhado sem ninguém perceber
          </h2>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Placas transparentes trocadas em casa, planejadas dente por dente e produzidas
            aqui mesmo — sem enviar o seu caso para fora.
          </p>

          <ul className="mt-5 space-y-2">
            {PONTOS.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-bold text-brand-green-text"
                >
                  ✓
                </span>
                <span className="text-base text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6">
            <span className="block text-4xl font-extrabold text-brand-green-text md:text-5xl">
              <NumeroAnimado valor="+500" />
            </span>
            <span className="mt-1 block text-base text-muted-foreground">
              sorrisos transformados com alinhadores
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/alinhadores"
              className="tatil rounded-full bg-brand-green-btn px-6 py-3 font-bold text-white transition-colors hover:bg-brand-green-text"
            >
              Ver tudo sobre os alinhadores
            </Link>
            <a
              href={whatsappLink("Oi! Quero saber mais sobre os alinhadores Ortoative.")}
              target="_blank"
              rel="noopener noreferrer"
              className="tatil inline-block px-2 py-3 font-bold text-brand-green-text underline-offset-4 hover:underline"
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          {/* O brilho atrás da peça é o mesmo tratamento que ela tinha no
              carrossel — é o que dá volume a um recorte plano. */}
          <div className="relative aspect-square">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--brand-green) 22%, transparent) 0%, color-mix(in oklch, var(--primary) 12%, transparent) 45%, transparent 72%)",
              }}
            />
            <Image
              src="/images/alinhadores/alinhador-arco.avif"
              alt="Alinhador invisível Ortoative"
              width={466}
              height={267}
              sizes="(max-width: 768px) 90vw, 45vw"
              className="absolute inset-0 m-auto max-h-[86%] w-auto max-w-full object-contain"
              {...previa("/images/alinhadores/alinhador-arco.avif")}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
