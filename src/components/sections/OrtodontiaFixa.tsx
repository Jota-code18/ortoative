import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/**
 * Ortodontia fixa — segunda seção, texto à direita.
 *
 * Vem depois dos alinhadores por ordem de procura, não de importância: são
 * +20.000 dos sorrisos da casa, e a seção tem o mesmo peso da anterior.
 */
export default function OrtodontiaFixa() {
  return (
    <SecaoProcedimento
      id="ortodontia-fixa"
      nome="Ortodontia Fixa"
      numero="+20.000"
      numeroRotulo="sorrisos transformados com aparelho fixo"
      frase="Colado aos dentes, trabalha sozinho o tempo todo — sem depender de você lembrar."
      ctaPrincipal={{
        href: "/procedimentos/ortodontia-fixa",
        texto: "Ver tudo sobre ortodontia fixa",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre ortodontia fixa."
      tom="azul"
      textoNaDireita
      imagem={
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/procedimentos/ortodontia-fixa.avif"
            alt="Aparelho ortodôntico fixo instalado"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/ortodontia-fixa.avif")}
          />
        </div>
      }
    />
  );
}
