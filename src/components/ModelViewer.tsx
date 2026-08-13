"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  cameraControls?: boolean;
  rotationPerSecond?: string;
  /** Rotação automática contínua — desligada na hero */
  autoRotate?: boolean;
  /** "theta phi radius" — phi 90deg = câmera na altura do modelo (vista frontal) */
  cameraOrbit?: string;
  /**
   * Balanço lento de apresentação: gira um pouco para cada lado e sobe/desce,
   * revelando o volume do modelo. Respeita prefers-reduced-motion.
   */
  sway?: boolean;
  /** Exposição da luz — >1 clareia o modelo (útil sobre fundo escuro) */
  exposure?: number;
  /** Imagem exibida antes do 3D carregar (evita buraco no layout) */
  poster?: string;
};

/**
 * Wrapper do <model-viewer> (Google). O runtime (three.js) só é baixado
 * quando o elemento entra na viewport e o navegador está ocioso — até lá
 * o poster segura o lugar. O balanço pausa fora da tela e em aba oculta.
 */
export default function ModelViewer({
  src,
  alt,
  className,
  cameraControls = true,
  rotationPerSecond = "30deg",
  autoRotate = true,
  cameraOrbit,
  sway = false,
  exposure = 1,
  poster,
}: Props) {
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const mvRef = useRef<HTMLElement>(null);
  const visibleRef = useRef(true);

  // Carrega o runtime só quando o bloco entra na viewport, em tempo ocioso
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;
    const load = () => {
      const start = () => {
        if (!cancelled) import("@google/model-viewer").then(() => setReady(true));
      };
      if ("requestIdleCallback" in window) {
        (window as Window & typeof globalThis).requestIdleCallback(start, {
          timeout: 1500,
        });
      } else {
        setTimeout(start, 200);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Balanço: só anima enquanto visível e com a aba em primeiro plano
  useEffect(() => {
    if (!ready || !sway) return;
    const mv = mvRef.current;
    const host = hostRef.current;
    if (!mv || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(host);

    let raf = 0;
    let frame = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visibleRef.current || document.hidden) return;
      // O balanço é lento: atualizar a 30fps é indistinguível a olho nu e
      // corta pela metade os redesenhos do canvas WebGL.
      if (++frame % 2) return;
      const s = (t - t0) / 1000;
      const theta = Math.sin(s * 0.5) * 22; // ±22° direita/esquerda
      const phi = 86 + Math.sin(s * 0.33 + 1) * 9; // 77°..95° sobe/desce
      mv.setAttribute("camera-orbit", `${theta}deg ${phi}deg auto`);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ready, sway]);

  return (
    <div ref={hostRef} className={className} style={{ width: "100%", height: "100%" }}>
      {ready ? (
        <model-viewer
          ref={mvRef}
          src={src}
          alt={alt}
          auto-rotate={autoRotate || undefined}
          rotation-per-second={rotationPerSecond}
          camera-orbit={cameraOrbit}
          camera-controls={cameraControls || undefined}
          disable-zoom
          disable-pan
          shadow-intensity="0.6"
          exposure={exposure}
          interaction-prompt="none"
          loading="eager"
          style={{ width: "100%", height: "100%" }}
        />
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={alt}
          className="h-full w-full object-contain"
          fetchPriority="high"
        />
      ) : (
        <div aria-label={alt} style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
