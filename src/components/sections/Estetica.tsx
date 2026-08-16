import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/** Estética — quarta seção, texto à direita. */
export default function Estetica() {
  return (
    <SecaoProcedimento
      id="estetica"
      nome="Lentes e facetas"
      frase="Cor, formato e harmonia planejados no digital. Você vê o resultado antes de decidir."
      ctaPrincipal={{
        href: "/procedimentos/estetica",
        texto: "Ver procedimentos estéticos",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre lentes e facetas."
      tom="verde"
      textoNaDireita
      imagem={
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/procedimentos/estetica.avif"
            alt="Resultado de lentes de contato dental"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/estetica.avif")}
          />
        </div>
      }
    />
  );
}
