import Image from "next/image";
import ModelViewer from "@/components/ModelViewer";

/**
 * Hero visual: fotos nas laterais dissolvendo em um azul difuso ao centro,
 * onde a logo 3D é apresentada. Sem bordas retas — as máscaras das fotos e o
 * véu azul se sobrepõem, então não há divisão vertical perceptível.
 */
export default function Hero() {
  return (
    <section id="hero" className="relative h-[92vh] min-h-[560px] overflow-hidden bg-hero-dark">
      {/* Foto esquerda — dissolve gradualmente em direção ao centro */}
      <div
        className="hero-curtain-left absolute inset-y-0 left-0 w-[48%]"
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
        }}
      >
        <Image
          src="/images/hero/esquerda-hero.jpg"
          alt="Paciente sorrindo"
          fill
          priority
          quality={92}
          /* O recorte é mais alto que largo: a altura é que manda no tamanho
             necessário, por isso `sizes` bem acima da largura do bloco. */
          sizes="(max-width: 768px) 100vw, 75vw"
          className="hero-photo object-cover object-center"
        />
      </div>

      {/* Foto direita — mesmo efeito, espelhado */}
      <div
        className="hero-curtain-right absolute inset-y-0 right-0 w-[48%]"
        style={{
          maskImage:
            "linear-gradient(to left, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, rgba(0,0,0,.92) 24%, rgba(0,0,0,.45) 62%, transparent 96%)",
        }}
      >
        <Image
          src="/images/hero/direita-equipe.jpg"
          alt="Equipe Ortoative"
          fill
          priority
          quality={92}
          sizes="(max-width: 768px) 100vw, 75vw"
          className="hero-photo-right object-cover object-top"
        />
      </div>

      {/* Véu azul difuso por cima das fotos — some para as laterais.
          O gradiente vive no globals.css porque muda de tamanho no mobile. */}
      <div className="hero-veu pointer-events-none absolute inset-0" />

      {/* Brilho que apresenta a logo */}
      <div
        className="hero-stage pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 32% 40% at 50% 44%, color-mix(in oklch, var(--hero-glow) 26%, transparent) 0%, color-mix(in oklch, var(--primary) 24%, transparent) 46%, transparent 78%)",
        }}
      />

      {/* Escurecimento inferior para receber o texto */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, var(--hero-dark) 92%, transparent) 0%, color-mix(in oklch, var(--hero-dark) 55%, transparent) 42%, transparent 100%)",
        }}
      />

      {/* Logo 3D central */}
      <div className="hero-logo absolute left-1/2 top-[42%] h-[400px] w-[400px] max-w-[84vw] -translate-x-1/2 -translate-y-1/2">
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

      {/* Texto: benefício como título, posicionamento como apoio */}
      <div className="absolute bottom-[9%] left-1/2 w-[92%] max-w-2xl -translate-x-1/2 text-center">
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
