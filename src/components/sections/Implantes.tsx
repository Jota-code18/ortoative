import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/** Implantes — terceira seção, texto à esquerda. */
export default function Implantes() {
  return (
    <SecaoProcedimento
      id="implantes"
      nome="Implantes"
      frase="A segurança de morder e sorrir de novo."
      descricao="Um pino de titânio substitui a raiz perdida e sustenta o dente novo. Planejamento por imagem e acompanhamento até a cicatrização."
      ctaPrincipal={{
        href: "/procedimentos/implantes",
        texto: "Ver implantes",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre implantes na Ortoative."
      tom="azul"
      imagem={
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3] md:rounded-3xl">
          <Image
            src="/images/procedimentos/implantes.avif"
            alt="Implante dentário"
            fill
            sizes="(max-width: 768px) 36vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/implantes.avif")}
          />
        </div>
      }
    />
  );
}
