import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/** Implantes — terceira seção, texto à esquerda. */
export default function Implantes() {
  return (
    <SecaoProcedimento
      id="implantes"
      nome="Implantes"
      frase="Recupere a segurança para sorrir, mastigar e conversar — com quem tem 26 anos de experiência."
      ctaPrincipal={{
        href: "/procedimentos/implantes",
        texto: "Saiba mais sobre implantes",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre implantes na Ortoative."
      tom="azul"
      imagem={
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/procedimentos/implantes.avif"
            alt="Implante dentário"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/implantes.avif")}
          />
        </div>
      }
    />
  );
}
