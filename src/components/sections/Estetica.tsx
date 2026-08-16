import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/** Estética — fecha a alternância com o texto à esquerda e a imagem à direita. */
export default function Estetica() {
  return (
    <SecaoProcedimento
      id="estetica"
      nome="Lentes e facetas"
      frase="Você vê o resultado antes de decidir."
      descricao="Lâminas finas corrigem cor, formato e proporção sem mover os dentes de lugar. O sorriso é planejado no digital antes de qualquer procedimento."
      ctaPrincipal={{
        href: "/procedimentos/estetica",
        texto: "Ver lentes e facetas",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre lentes e facetas."
      tom="verde"
      imagem={
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3] md:rounded-3xl">
          <Image
            src="/images/procedimentos/estetica.avif"
            alt="Resultado de lentes de contato dental"
            fill
            sizes="(max-width: 768px) 36vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/estetica.avif")}
          />
        </div>
      }
    />
  );
}
