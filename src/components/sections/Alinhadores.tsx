import Image from "next/image";
import Link from "next/link";
import CarrosselTratamentos, { type Tratamento } from "@/components/CarrosselTratamentos";
import ComparativoTratamentos from "@/components/ComparativoTratamentos";
import Reveal from "@/components/Reveal";
import { previa } from "@/lib/lqip";

/**
 * Mockup: alinhadores e ortodontia fixa — faixa infinita alternando os dois
 * cards com as peças flutuando entre eles, e o comparativo logo abaixo.
 */
const tratamentos: Tratamento[] = [
  {
    titulo: "Alinhadores Ortoative",
    destaque: "+500",
    destaqueRotulo: "sorrisos transformados com alinhadores",
    itens: [
      "Praticamente invisíveis",
      "Removíveis para comer e escovar",
      "Fabricação própria em Anápolis",
      "Planejamento digital 3D",
    ],
  },
  {
    titulo: "Ortodontia Fixa",
    destaque: "+20.000",
    destaqueRotulo: "sorrisos transformados com aparelho fixo",
    itens: [
      "Indicada para casos complexos",
      "Independe da disciplina de uso",
      "Opções estéticas disponíveis",
      "Mesma equipe há 26+ anos",
    ],
  },
];

const pecas = [
  {
    /* arco solto, com o fundo recortado: gira devagar como se a câmera desse
       a volta nele */
    src: "/images/alinhadores/alinhador-arco.avif",
    alt: "Alinhador invisível Ortoative",
    largura: 466,
    altura: 267,
    girar: true,
  },
  {
    src: "/images/alinhadores/aparelho-movel.avif",
    alt: "Aparelho ortodôntico móvel",
    largura: 900,
    altura: 1228,
  },
];

export default function Alinhadores() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl">
              Alinhadores <span className="text-brand-green-text">ou</span> Ortodontia
              Fixa?
            </h2>
            <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
              Os dois transformam sorrisos — e aqui fazemos os dois. Entenda qual combina
              com seu caso, sua rotina e seu bolso.
            </p>
          </Reveal>

          {/* o estojo já vem com os cantos arredondados no próprio arquivo */}
          <Reveal from="right" delay={120}>
            <Image
              src="/images/alinhadores/estojo-aberto.avif"
              alt="Estojo aberto com o par de alinhadores Ortoative"
              width={387}
              height={373}
              sizes="(max-width: 768px) 45vw, 224px"
              className="h-auto w-40 md:w-56"
              {...previa("/images/alinhadores/estojo-aberto.avif")}
            />
          </Reveal>
        </div>
      </div>

      <Reveal delay={80}>
        <div className="mt-4">
          <CarrosselTratamentos tratamentos={tratamentos} pecas={pecas} />
        </div>
      </Reveal>

      <div className="mx-auto mt-8 max-w-5xl px-4">
        <Reveal>
          <ComparativoTratamentos />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-5 text-center">
            <Link
              href="/alinhadores"
              className="inline-block py-1 font-bold text-primary underline-offset-4 hover:underline"
            >
              Ver tudo sobre os alinhadores Ortoative →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
