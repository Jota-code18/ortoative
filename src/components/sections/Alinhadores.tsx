import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/** Alinhadores — primeira das quatro seções de procedimento, texto à esquerda. */
export default function Alinhadores() {
  return (
    <SecaoProcedimento
      id="alinhadores"
      nome="Alinhadores Ortoative"
      numero="+500"
      numeroRotulo="sorrisos transformados com alinhadores"
      frase="O sorriso alinhado sem ninguém perceber."
      descricao="Placas transparentes trocadas em casa, planejadas dente por dente e produzidas no nosso laboratório — sem enviar o seu caso para fora."
      ctaPrincipal={{ href: "/alinhadores", texto: "Ver alinhadores" }}
      mensagemWhatsapp="Oi! Quero saber mais sobre os alinhadores Ortoative."
      tom="verde"
      imagem={
        /* O brilho atrás da peça é o que dá volume a um recorte plano. */
        <div className="relative aspect-[4/3] md:aspect-square">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--brand-green) 22%, transparent) 0%, color-mix(in oklch, var(--primary) 12%, transparent) 45%, transparent 72%)",
            }}
          />
          <Image
            src="/images/alinhadores/alinhador-arco.avif"
            alt="Alinhador invisível Ortoative"
            width={466}
            height={267}
            sizes="(max-width: 768px) 36vw, 45vw"
            className="absolute inset-0 m-auto max-h-full w-auto max-w-full object-contain"
            {...previa("/images/alinhadores/alinhador-arco.avif")}
          />
        </div>
      }
    />
  );
}
