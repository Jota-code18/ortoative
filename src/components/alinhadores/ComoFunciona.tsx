"use client";

import Image from "next/image";
import { useState } from "react";
import { previa } from "@/lib/lqip";

/**
 * As quatro etapas do tratamento, uma de cada vez.
 *
 * Os concorrentes empilham os passos em texto corrido ou num carrossel que
 * anda sozinho. Aqui quem escolhe é o visitante: ele lê o que quer, na ordem
 * que quiser, e a foto muda junto. Menos leitura na tela, mais controle.
 */
const ETAPAS = [
  {
    rotulo: "Escaneamento",
    titulo: "Sem massinha, sem enjoo",
    texto:
      "Um scanner passa pela sua boca e o sorriso vira modelo digital em poucos minutos. Você vê a arcada na tela na mesma consulta.",
    imagem: "/images/fabrica/modelos.avif",
    alt: "Modelos das arcadas impressos em 3D",
  },
  {
    rotulo: "Planejamento",
    titulo: "Dente por dente, antes de começar",
    texto:
      "O Dr. Rui define quanto cada dente precisa se mover e em que ordem. Você vê a simulação do resultado antes de decidir se quer tratar.",
    imagem: "/images/dentistas/rui-apresentacao.avif",
    alt: "Dr. Rui Cambauva analisando um escaneamento 3D",
  },
  {
    rotulo: "Fabricação",
    titulo: "Produzido aqui, não terceirizado",
    texto:
      "Seus alinhadores são impressos, termoformados e acabados no nosso laboratório. Nenhuma etapa sai para fora.",
    imagem: "/images/fabrica/impressoras.avif",
    alt: "Impressoras 3D do laboratório da Ortoative",
  },
  {
    rotulo: "Acompanhamento",
    titulo: "A mesma equipe do começo ao fim",
    texto:
      "Trocas programadas e consultas de conferência. Se um dente não se mover como o planejado, a placa nova sai daqui mesmo — sem reabrir pedido com fornecedor.",
    imagem: "/images/alinhadores/uso-alinhador.avif",
    alt: "Paciente colocando o alinhador",
  },
];

export default function ComoFunciona() {
  const [ativa, setAtiva] = useState(0);
  const etapa = ETAPAS[ativa];

  return (
    <div>
      {/* Os passos são botões, não abas de navegação: mudam conteúdo na mesma
          página. `aria-pressed` comunica o estado a quem usa leitor de tela. */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {ETAPAS.map((e, i) => (
          <button
            key={e.rotulo}
            type="button"
            onClick={() => setAtiva(i)}
            aria-pressed={i === ativa}
            className={`tatil flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors md:text-base ${
              i === ativa
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <span
              aria-hidden="true"
              className={`font-mono text-sm ${
                i === ativa ? "text-primary-foreground/70" : "text-muted-foreground/60"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {e.rotulo}
          </button>
        ))}
      </div>

      {/* `key` remonta o bloco a cada troca, o que dispara a entrada */}
      <div
        key={etapa.rotulo}
        className="conteudo-chega mt-5 grid items-center gap-6 md:mt-6 md:grid-cols-2 md:gap-10"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={etapa.imagem}
            alt={etapa.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            {...previa(etapa.imagem)}
          />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl">{etapa.titulo}</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            {etapa.texto}
          </p>
        </div>
      </div>
    </div>
  );
}
