"use client";

import { useState } from "react";
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
 * Junta o carrossel de tratamentos e o comparativo em torno de um estado só.
 *
 * No celular a tabela mostra uma coluna por vez, acompanhando o card que está
 * em foco: duas colunas empilhadas dobravam a altura da seção e ainda
 * espremiam cada resposta em metade da largura. No desktop nada muda — lá a
 * comparação lado a lado cabe e é o que faz a tabela valer.
 */
export default function AlinhadoresCarrossel({
  tratamentos,
  pecas,
}: {
  tratamentos: Tratamento[];
  pecas: Peca[];
}) {
  const [ativo, setAtivo] = useState(0);

  return (
    <>
      <Reveal delay={80}>
        <div className="mt-4">
          <CarrosselTratamentos
            tratamentos={tratamentos}
            pecas={pecas}
            aoTrocar={setAtivo}
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-3 max-w-5xl px-4 md:mt-8">
        <Reveal>
          <ComparativoTratamentos ativo={ativo} />
        </Reveal>
      </div>
    </>
  );
}
