"use client";

import { useEffect, useRef, useState } from "react";

/** desacelera no fim — a contagem "assenta" no valor em vez de estancar */
function suavizar(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Conta de zero até o valor quando entra na viewport. Aceita o número já
 * formatado ("+20.000", "26+") e preserva prefixo, sufixo e separadores.
 *
 * O HTML nasce com o valor final — quem chega sem JS, ou com movimento
 * reduzido, lê o número correto. A contagem só substitui o texto quando o
 * observador dispara.
 */
export default function NumeroAnimado({
  valor,
  duracao = 1600,
  className,
}: {
  valor: string;
  duracao?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [contando, setContando] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const digitos = valor.replace(/\D/g, "");
    // sem número (ex.: placeholder "—") ou movimento reduzido: fica como está
    if (!digitos || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const destino = Number(digitos);
    const prefixo = valor.slice(0, valor.search(/\d/));
    const sufixo = valor.slice(valor.search(/\d(?!.*\d)/) + 1);
    const temSeparador = /[.,]/.test(valor);
    const formatar = (n: number) =>
      prefixo + (temSeparador ? n.toLocaleString("pt-BR") : String(n)) + sufixo;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          setContando(formatar(Math.round(destino * suavizar(t))));
          if (t < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      // começa um pouco antes de aparecer: a contagem já entra rodando
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref} className={className}>
      {contando ?? valor}
    </span>
  );
}
