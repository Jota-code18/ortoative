"use client";

import { useEffect, useRef, useState } from "react";

export type LadoCard = {
  titulo: string;
  itens: string[];
};

const INTERVALO = 5000;

/**
 * Um único card com dois conteúdos que se alternam a cada 5s. As camadas
 * empilhadas atrás deixam visível que há mais informação na frente.
 * Pausa no hover, no foco e quando sai da viewport.
 */
export default function CardAlternante({ lados }: { lados: LadoCard[] }) {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visivel = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visivel.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => {
      if (!visivel.current || document.hidden) return;
      setAtivo((i) => (i + 1) % lados.length);
    }, INTERVALO);
    return () => clearInterval(id);
  }, [pausado, lados.length]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {/* Camadas da pilha — sugerem o conteúdo que está atrás */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-3 top-3 rounded-xl border border-border bg-card/70 shadow-sm"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-1.5 top-1.5 rounded-xl border border-border bg-card/85 shadow-sm"
      />

      <div className="relative overflow-hidden rounded-xl border bg-card p-7 shadow-md md:p-9">
        {/* Altura reservada pelo maior conteúdo: a troca não move a página */}
        <div className="grid">
          {lados.map((lado, i) => (
            <div
              key={lado.titulo}
              aria-hidden={i !== ativo}
              className="col-start-1 row-start-1 transition-all duration-700 ease-out"
              style={{
                opacity: i === ativo ? 1 : 0,
                transform: i === ativo ? "translateY(0)" : "translateY(10px)",
                pointerEvents: i === ativo ? "auto" : "none",
              }}
            >
              <h3 className="text-xl text-primary md:text-2xl">{lado.titulo}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground md:text-base">
                {lado.itens.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-brand-green-text">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Indicadores: também servem de atalho entre os dois lados */}
        <div className="mt-7 flex items-center gap-3">
          {lados.map((lado, i) => (
            <button
              key={lado.titulo}
              type="button"
              onClick={() => setAtivo(i)}
              aria-label={`Ver ${lado.titulo}`}
              aria-pressed={i === ativo}
              className="group flex items-center gap-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === ativo ? "w-10 bg-brand-green" : "w-4 bg-border group-hover:bg-primary/40"
                }`}
              />
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            {lados[ativo].titulo}
          </span>
        </div>
      </div>
    </div>
  );
}
