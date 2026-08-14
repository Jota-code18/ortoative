import CarrosselTratamentos, { type Tratamento } from "@/components/CarrosselTratamentos";
import ComparativoTratamentos from "@/components/ComparativoTratamentos";
import Reveal from "@/components/Reveal";

type Peca = {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  girar?: boolean;
};

/**
 * Carrossel de tratamentos e comparativo, um encostado no outro.
 *
 * Ficam juntos e sem borda entre eles de propósito: são a mesma pergunta —
 * "alinhador ou fixo?" — e separá-los em dois cartões fazia a tabela parecer
 * um objeto solto embaixo da seção.
 *
 * O estado compartilhado saiu: com a tabela em perguntas e marcas, as duas
 * colunas cabem no celular ao mesmo tempo, e ela não precisa mais seguir o
 * card em foco.
 */
export default function AlinhadoresCarrossel({
  tratamentos,
  pecas,
}: {
  tratamentos: Tratamento[];
  pecas: Peca[];
}) {
  return (
    <>
      <Reveal delay={80}>
        <div className="mt-4">
          <CarrosselTratamentos tratamentos={tratamentos} pecas={pecas} />
        </div>
      </Reveal>

      <div className="mx-auto mt-1 max-w-3xl px-4 md:mt-4">
        <Reveal>
          <ComparativoTratamentos />
        </Reveal>
      </div>
    </>
  );
}
