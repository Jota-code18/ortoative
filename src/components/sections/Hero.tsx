import Image from "next/image";
import ModelViewer from "@/components/ModelViewer";
import { previa } from "@/lib/lqip";

/**
 * Hero — dois desenhos, um componente.
 *
 * No desktop as duas fotos se dissolvem em um azul difuso ao centro, com a
 * logo 3D no meio. No celular esse arranjo não funciona: duas fotos de 64% se
 * sobrepõem, os rostos caem na dobra e a logo compete com eles. Lá a foto é
 * uma só, os rostos ficam no terço de cima (livres da Header), a logo desce
 * para abaixo do tronco e as frases fecham embaixo.
 *
 * São duas composições, mas UM componente e UM `ModelViewer`: montar dois
 * baixaria o runtime do model-viewer e o GLB duas vezes, e o visitante paga
 * pelo que não vê. O que muda entre os tamanhos é posição, não estrutura.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-hero-dark md:h-[92vh]"
    >
      {/* Foto esquerda — só no desktop.
          `sizes` de 1px no celular faz o navegador escolher o menor recorte do
          srcset: o elemento fica oculto, e o download some junto. */}
      <div
        className="hero-curtain-left absolute inset-y-0 left-0 hidden w-[48%] md:block"
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
        }}
      >
        <Image
          src="/images/hero/esquerda-hero.avif"
          alt="Paciente sorrindo"
          fill
          quality={92}
          sizes="(max-width: 768px) 1px, 75vw"
          className="hero-photo object-cover object-center"
          {...previa("/images/hero/esquerda-hero.avif")}
        />
      </div>

      {/* Foto direita — a única no celular, onde ocupa a tela inteira.
          `object-[center_18%]` deixa os rostos no terço de cima, abaixo da
          Header e acima da logo. A máscara lateral só existe no desktop: no
          celular não há foto do outro lado para dissolver contra, e ela apenas
          apagava a faixa esquerda, deixando o azul do fundo aparecer. */}
      <div className="hero-curtain-right hero-mascara-direita absolute inset-y-0 right-0 w-full md:w-[48%]">
        <Image
          src="/images/hero/direita-equipe.avif"
          alt="Equipe Ortoative"
          fill
          priority
          quality={92}
          sizes="(max-width: 768px) 100vw, 75vw"
          className="hero-photo-right object-cover object-[center_18%] md:object-[78%_top]"
          {...previa("/images/hero/direita-equipe.avif")}
        />
      </div>

      {/* Véu azul: no celular acompanha a logo, que desceu */}
      <div className="hero-veu pointer-events-none absolute inset-0" />

      {/* Brilho que apresenta a logo */}
      <div className="hero-stage hero-brilho pointer-events-none absolute inset-0" />

      {/* Escurecimento inferior para receber o texto. Mais alto no celular,
          onde há logo e duas frases empilhadas sobre a foto. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, var(--hero-dark) 92%, transparent) 0%, color-mix(in oklch, var(--hero-dark) 55%, transparent) 46%, transparent 100%)",
        }}
      />

      {/* Logo 3D. No celular fica abaixo do tronco; no desktop, no centro. */}
      <div className="hero-logo absolute left-1/2 top-[59%] h-[240px] w-[240px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 md:top-[42%] md:h-[400px] md:w-[400px] md:max-w-[84vw]">
        <ModelViewer
          src="/models/ortoative-logo.glb"
          alt="Logo Ortoative em 3D"
          cameraControls={false}
          autoRotate={false}
          cameraOrbit="0deg 90deg auto"
          sway
          exposure={1.5}
          poster="/images/marca/logomarca-neg.png"
        />
      </div>

      {/* Texto: no celular logo abaixo da logo; no desktop, no rodapé da hero */}
      <div className="absolute bottom-[7%] left-1/2 w-[92%] max-w-2xl -translate-x-1/2 text-center md:bottom-[9%]">
        <h1 className="hero-titulo text-3xl font-bold leading-tight text-white md:text-[2.75rem]">
          <span className="hero-line">
            <span>Seu sorriso alinhado</span>
          </span>
          <span className="hero-line">
            <span>com tecnologia própria.</span>
          </span>
        </h1>
        <p className="hero-line mt-4">
          <span className="block font-sans text-sm font-normal leading-relaxed text-white/75 md:text-base">
            Clínica e fabricante de alinhadores invisíveis com mais de 26 anos de
            experiência.
          </span>
        </p>
      </div>
    </section>
  );
}
