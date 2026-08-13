"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Atraso em ms — usado para escalonar itens de uma lista */
  delay?: number;
  /** Direção de entrada */
  from?: "bottom" | "left" | "right";
};

/* Deslocamento curto de propósito: o conteúdo aparece sem "voar" para o
   lugar, o que deixa o scroll com menos sensação de movimento. */
const offset = {
  bottom: "translate3d(0, 20px, 0)",
  left: "translate3d(-22px, 0, 0)",
  right: "translate3d(22px, 0, 0)",
} as const;

/**
 * Revela o conteúdo quando ele entra na viewport: fade + deslize + desfoque.
 * Respeita prefers-reduced-motion (mostra direto, sem animar).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Com movimento reduzido o conteúdo aparece sem deslize: o observador
       dispara na primeira checagem e a transição some junto. */
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (semMovimento) setDone(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onTransitionEnd={() => setDone(true)}
      style={
        // Depois de revelado, zera transform/filter/will-change: sem camadas
        // de composição penduradas nem blur ativo em dezenas de elementos.
        done
          ? undefined
          : {
              // Só opacity + transform: ambos rodam no compositor. Animar
              // `filter: blur` obriga o navegador a repintar a textura a cada
              // frame — era a maior fonte de engasgo durante o scroll.
              opacity: shown ? 1 : 0,
              transform: shown ? "translate3d(0,0,0)" : offset[from],
              transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
