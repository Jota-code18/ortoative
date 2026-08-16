"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Skeleton from "@/components/Skeleton";

/**
 * Lê uma media query sem `setState` dentro de efeito — que é o que o
 * compilador do React proíbe e o ESLint pega. O instantâneo do servidor é
 * `null`: lá não dá para saber o tamanho da tela, e chutar faria o navegador
 * baixar o arquivo errado antes de qualquer correção.
 */
function useConsultaDeMidia(consulta: string): boolean | null {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => null
  );
}

/**
 * Passeio pela unidade, em vídeo.
 *
 * Substitui a cena three.js em tempo real. O passeio não tem interação e não
 * muda de execução para execução — é exatamente o que vídeo faz melhor, e o
 * que ele evita é o que derrubava a aba no celular: contexto WebGL, dezenas de
 * MB de textura em memória de vídeo e o three.js no bundle. Decodificação de
 * vídeo é acelerada por hardware em qualquer aparelho dos últimos dez anos.
 *
 * Os arquivos saem de `npm run passeios:renderizar`, que desenha a cena quadro
 * a quadro. Só MP4: o VP9 saía 3,5x maior nesta cena, e vindo primeiro no
 * `<source>` era ele que os navegadores baixavam.
 */
export default function PasseioVideo({
  slug,
  unidade,
}: {
  /** base do nome dos arquivos em /videos */
  slug: string;
  /** nome da unidade, para o rótulo acessível */
  unidade: string;
}) {
  const blocoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pronto, setPronto] = useState(false);

  const noCelular = useConsultaDeMidia("(max-width: 768px)");
  const semMovimento = useConsultaDeMidia("(prefers-reduced-motion: reduce)") === true;
  const variante = noCelular === null ? null : noCelular ? "-mobile" : "";

  useEffect(() => {
    const bloco = blocoRef.current;
    if (!bloco || variante === null || semMovimento) return;

    /* Toca só na tela. Vídeo em laço fora de vista gasta bateria e dados sem
       ninguém ver — e o navegador nem sempre pausa sozinho. */
    const io = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(bloco);
    return () => io.disconnect();
  }, [variante, semMovimento]);

  return (
    <div className="relative isolate">
      <div
        ref={blocoRef}
        className="relative h-[52vh] min-h-[360px] overflow-hidden rounded-3xl bg-muted ring-1 ring-black/5 md:h-[68vh] md:rounded-[2rem]"
      >
        {!pronto && <Skeleton arredondado="" className="absolute inset-0" />}

        {variante !== null && (
          <video
            ref={videoRef}
            aria-label={`Passeio pela unidade de ${unidade}`}
            poster={`/videos/${slug}-poster.avif`}
            muted
            playsInline
            loop
            /* Sem movimento automático: mostra o pôster e entrega os controles,
               em vez de um laço que a pessoa pediu para não ver. */
            autoPlay={!semMovimento}
            controls={semMovimento}
            preload="metadata"
            onCanPlay={() => setPronto(true)}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              pronto ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={`/videos/${slug}${variante}.mp4`} type="video/mp4" />
          </video>
        )}

        {/* Grão sutil, o mesmo que a cena tinha */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </div>
  );
}
