"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Emenda entre duas seções de fundo diferente. Em vez de um gradiente longo
 * ocupando metade da seção, é uma faixa curta que se abre quando entra na
 * viewport — a passagem de cor acontece junto com o resto do conteúdo
 * aparecendo, então o olho não registra o corte.
 *
 * A transição vive no CSS (.costura-abre), que já desliga sozinha em
 * prefers-reduced-motion.
 */
export default function Costura({
  de,
  para,
  altura = 120,
}: {
  /** cor de cima (var CSS, ex.: "var(--brand-blue)") */
  de: string;
  /** cor de baixo */
  para: string;
  altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [aberta, setAberta] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAberta(true);
          io.disconnect();
        }
      },
      { rootMargin: "40% 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ height: altura, background: `linear-gradient(to bottom, ${de}, ${para})` }}
    >
      <div
        className="costura-abre h-full w-full"
        style={{
          background: `linear-gradient(to bottom, ${de} 0%, ${para} 100%)`,
          transform: aberta ? "scaleY(1)" : "scaleY(0.55)",
        }}
      />
    </div>
  );
}
