"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NumeroAnimado from "@/components/NumeroAnimado";
import { previa } from "@/lib/lqip";

export type Tratamento = {
  titulo: string;
  destaque: string;
  destaqueRotulo: string;
};

type Peca = {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** peça solta: fica parada, sem o balanço das demais */
  girar?: boolean;
};

/** tempo parado em cada slide, em ms */
const PAUSA = 5000;
/** quanto o giro automático espera depois que a pessoa mexe na faixa */
const ESPERA_APOS_INTERACAO = 6000;
/** três cópias da lista: dá folga para os dois lados sem tocar nas bordas */
const COPIAS = 3;

/**
 * Cada slide é um par: o card do tratamento e a peça correspondente, juntos,
 * ocupando a largura visível inteira. O encaixe é feito por scroll-snap, então
 * arrastar sempre para no próximo par — nunca no meio de dois.
 *
 * O loop infinito é feito com a lista triplicada e um reposicionamento que só
 * acontece com a faixa parada. A versão anterior movia um slide para o fim da
 * fila dentro do próprio evento de scroll: no navegador real isso cancelava a
 * rolagem suave em andamento e matava a inércia do dedo no celular.
 */
export default function CarrosselTratamentos({
  tratamentos,
  pecas,
  aoTrocar,
}: {
  tratamentos: Tratamento[];
  pecas: Peca[];
  /** avisa quem está de fora qual tratamento está em foco */
  aoTrocar?: (indice: number) => void;
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  /* Em ref para o efeito não precisar do callback nas dependências — ele
     recria todos os listeners e reposiciona a faixa se rodar de novo.
     A sincronia vai num efeito próprio: escrever em ref durante a renderização
     quebra a regra do compilador do React. */
  const aoTrocarRef = useRef(aoTrocar);
  useEffect(() => {
    aoTrocarRef.current = aoTrocar;
  }, [aoTrocar]);
  const total = tratamentos.length;

  /* Os controles são montados dentro do efeito: lá eles podem ler relógio e
     posição de scroll sem serem chamados durante a renderização. */
  const controles = useRef<{
    rolar: (passos: number) => void;
    irPara: (indice: number) => void;
  }>({ rolar: () => {}, irPara: () => {} });

  const slides = Array.from({ length: COPIAS * total }, (_, i) => {
    const indice = i % total;
    return {
      chave: `${tratamentos[indice].titulo}-${i}`,
      tratamento: tratamentos[indice],
      peca: pecas[indice],
    };
  });

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conjunto = () => trilho.clientWidth * total;

    // começa no conjunto do meio, para haver espaço nos dois sentidos
    trilho.scrollLeft = conjunto();

    let visivel = true;
    let pausadoAte = 0;
    let timerAuto: ReturnType<typeof setTimeout>;
    let timerParada: ReturnType<typeof setTimeout>;
    let quadro = 0;

    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(trilho);

    /* Reposiciona a faixa de volta ao conjunto do meio — a faixa [c, 2c). Só
       roda com o scroll parado: mexer em scrollLeft durante uma rolagem em
       curso a cancela. */
    const normalizar = () => {
      const c = conjunto();
      if (!c) return;
      if (trilho.scrollLeft < c) trilho.scrollLeft += c;
      else if (trilho.scrollLeft >= 2 * c) trilho.scrollLeft -= c;
    };

    const aoRolar = () => {
      if (!quadro) {
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          const l = trilho.clientWidth;
          if (l) {
            const indice = Math.round(trilho.scrollLeft / l) % total;
            setAtivo(indice);
            aoTrocarRef.current?.(indice);
          }
        });
      }
      clearTimeout(timerParada);
      timerParada = setTimeout(normalizar, 160);
    };

    const agendar = (espera = PAUSA) => {
      clearTimeout(timerAuto);
      timerAuto = setTimeout(() => {
        if (!visivel || document.hidden || performance.now() < pausadoAte) {
          agendar(700);
          return;
        }
        trilho.scrollBy({
          left: trilho.clientWidth,
          behavior: semAnimacao ? "auto" : "smooth",
        });
        agendar();
      }, espera);
    };

    const aoInteragir = () => {
      pausadoAte = performance.now() + ESPERA_APOS_INTERACAO;
    };

    /* Setas e bolinhas. Rolar por aqui também segura o giro automático, senão
       o carrossel andaria sozinho logo depois do clique. */
    const rolar = (passos: number) => {
      aoInteragir();
      trilho.scrollBy({
        left: passos * trilho.clientWidth,
        behavior: semAnimacao ? "auto" : "smooth",
      });
    };

    const irPara = (indice: number) => {
      const l = trilho.clientWidth;
      if (!l) return;
      const atual = Math.round(trilho.scrollLeft / l);
      let passos = (((indice - (atual % total)) % total) + total) % total;
      if (passos > total / 2) passos -= total;
      if (passos) rolar(passos);
    };

    controles.current = { rolar, irPara };

    /* Roda do mouse: só conta como interação quando é horizontal. Rolar a
       página com o cursor sobre a faixa não pode interromper o avanço. */
    const aoGirarRoda = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) aoInteragir();
    };

    /* Largura do slide muda com o resize: recoloca no conjunto do meio para o
       encaixe não ficar entre dois cards. */
    const aoRedimensionar = () => {
      const l = trilho.clientWidth;
      if (l) trilho.scrollLeft = conjunto() + (ativo % total) * l;
    };

    trilho.addEventListener("scroll", aoRolar, { passive: true });
    trilho.addEventListener("pointerdown", aoInteragir);
    trilho.addEventListener("touchstart", aoInteragir, { passive: true });
    trilho.addEventListener("wheel", aoGirarRoda, { passive: true });
    window.addEventListener("resize", aoRedimensionar);

    agendar();

    return () => {
      clearTimeout(timerAuto);
      clearTimeout(timerParada);
      if (quadro) cancelAnimationFrame(quadro);
      io.disconnect();
      trilho.removeEventListener("scroll", aoRolar);
      trilho.removeEventListener("pointerdown", aoInteragir);
      trilho.removeEventListener("touchstart", aoInteragir);
      trilho.removeEventListener("wheel", aoGirarRoda);
      window.removeEventListener("resize", aoRedimensionar);
    };
    // `ativo` é lido só no resize; incluí-lo recriaria os listeners a cada slide
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Alinhadores e Ortodontia Fixa"
    >
      {/* overflow-y: hidden é obrigatório — com overflow-x auto sozinho o
          navegador torna o eixo Y rolável também, e a roda do mouse sobre a
          faixa deixa de rolar a página.
          touch-action precisa liberar OS DOIS eixos: só `pan-y` (como estava)
          proíbe o gesto horizontal e o carrossel fica travado no celular. */}
      <div
        ref={trilhoRef}
        className="no-scrollbar snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {/* w-full (e não w-screen) no slide: 100vw incluiria a barra de rolagem
            e cada parada ficaria alguns pixels fora do lugar. */}
        <div className="flex">
          {slides.map(({ chave, tratamento, peca }) => (
            <div
              key={chave}
              data-slide
              className="flex w-full shrink-0 snap-start items-center gap-4 px-4 py-6 md:gap-10 md:px-[max(1rem,calc((100vw-72rem)/2))]"
            >
              <article className="min-w-0 flex-1">
                <h3 className="text-2xl text-primary md:text-3xl">{tratamento.titulo}</h3>
                <p className="mt-2 text-5xl font-extrabold text-brand-green-text md:text-6xl">
                  <NumeroAnimado valor={tratamento.destaque} />
                </p>
                <p className="text-base font-semibold text-muted-foreground md:text-lg">
                  {tratamento.destaqueRotulo}
                </p>
              </article>

              {/* Caixa quadrada: o brilho fica igual nas duas peças. Antes ele
                  herdava a altura da imagem — e como o aparelho é bem mais alto
                  que o estojo, saía maior e cortado. */}
              <div className="relative aspect-square w-[46%] shrink-0 md:w-[30%]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklch, var(--brand-green) 22%, transparent) 0%, color-mix(in oklch, var(--primary) 12%, transparent) 45%, transparent 72%)",
                  }}
                />
                <Image
                  src={peca.src}
                  alt={peca.alt}
                  width={peca.largura}
                  height={peca.altura}
                  sizes="(max-width: 768px) 46vw, 30vw"
                  /* O arco é largo e baixo: preso a 86% da caixa quadrada
                     ficaria pequeno demais, então usa a largura toda. O
                     aparelho é alto e cabe no limite comum. */
                  className={`absolute inset-0 m-auto max-h-[86%] w-auto object-contain ${
                    peca.girar ? "max-w-full" : "peca-flutuante max-w-[86%]"
                  }`}
                  {...previa(peca.src)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles: sem eles a faixa depende do giro automático, que não roda
          para quem pediu menos animação no sistema. */}
      <button
        type="button"
        onClick={() => controles.current.rolar(-1)}
        aria-label="Tratamento anterior"
        className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-primary shadow-md ring-1 ring-border backdrop-blur-none transition-colors hover:bg-card md:flex"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ‹
        </span>
      </button>
      <button
        type="button"
        onClick={() => controles.current.rolar(1)}
        aria-label="Próximo tratamento"
        className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-primary shadow-md ring-1 ring-border transition-colors hover:bg-card md:flex"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ›
        </span>
      </button>

      <div className="mt-1 flex items-center justify-center gap-2">
        {tratamentos.map((t, i) => (
          <button
            key={t.titulo}
            type="button"
            onClick={() => controles.current.irPara(i)}
            aria-label={`Ver ${t.titulo}`}
            aria-current={i === ativo}
            className="flex h-11 w-11 items-center justify-center"
          >
            <span
              aria-hidden="true"
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === ativo ? "w-7 bg-brand-green-btn" : "w-2 bg-border"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
