import Image from "next/image";
import Link from "next/link";
import NumeroAnimado from "@/components/NumeroAnimado";
import Reveal from "@/components/Reveal";
import { previa } from "@/lib/lqip";
import { whatsappLink } from "@/lib/site";

/**
 * Ortodontia fixa — seção própria, logo depois dos alinhadores.
 *
 * Vem em segundo por ordem de interesse do visitante, não por importância: o
 * alinhador é o que traz a busca, mas o aparelho fixo responde por +20.000 dos
 * sorrisos da casa. Por isso a seção tem o mesmo peso visual da anterior, só
 * com a imagem no outro lado — quem chega procurando aparelho fixo precisa
 * encontrar uma seção completa, não um contraponto do alinhador.
 */
const PONTOS = [
  "Trabalha 24 horas por dia, sem depender de você lembrar",
  "Resolve os casos mais complexos, inclusive cirúrgicos",
  "Versões estéticas, com braquete da cor do dente",
  "Costuma custar menos que o alinhador",
];

export default function OrtodontiaFixa() {
  return (
    <section id="ortodontia-fixa" className="scroll-mt-20 py-5 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        {/* No celular a foto vem antes do texto, como na seção de cima; no
            desktop ela troca de lado, para as duas seções não ficarem
            espelhadas iguais. */}
        <Reveal from="left" delay={120} className="md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/procedimentos/ortodontia-fixa.avif"
              alt="Aparelho ortodôntico fixo instalado"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              {...previa("/images/procedimentos/ortodontia-fixa.avif")}
            />
          </div>
        </Reveal>

        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Ortodontia Fixa
          </p>
          <h2 className="mt-1 text-3xl md:text-4xl">
            O tratamento que não depende de disciplina
          </h2>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Colado aos dentes, trabalha sozinho o tempo todo. É a escolha mais previsível
            para mordidas complexas e movimentos maiores — e a mesma equipe acompanha do
            primeiro ajuste à contenção.
          </p>

          <ul className="mt-5 space-y-2">
            {PONTOS.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-bold text-primary"
                >
                  ✓
                </span>
                <span className="text-base text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6">
            <span className="block text-4xl font-extrabold text-primary md:text-5xl">
              <NumeroAnimado valor="+20.000" />
            </span>
            <span className="mt-1 block text-base text-muted-foreground">
              sorrisos transformados com aparelho fixo
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/procedimentos/ortodontia-fixa"
              className="tatil rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-blue"
            >
              Ver tudo sobre ortodontia fixa
            </Link>
            <a
              href={whatsappLink("Oi! Quero saber mais sobre ortodontia fixa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="tatil inline-block px-2 py-3 font-bold text-primary underline-offset-4 hover:underline"
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
