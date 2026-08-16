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
      frase="O tratamento que não depende de disciplina."
      descricao="Colado aos dentes, trabalha o tempo todo. É a escolha mais previsível para mordidas complexas, e a mesma equipe acompanha do primeiro ajuste à contenção."
      ctaPrincipal={{
        href: "/procedimentos/ortodontia-fixa",
        texto: "Ver ortodontia fixa",
      }}
      mensagemWhatsapp="Oi! Quero saber mais sobre ortodontia fixa."
      tom="azul"
      textoNaDireita
      imagem={
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3] md:rounded-3xl">
          <Image
            src="/images/procedimentos/ortodontia-fixa.avif"
            alt="Aparelho ortodôntico fixo instalado"
            fill
            sizes="(max-width: 768px) 36vw, 50vw"
            className="object-cover"
            {...previa("/images/procedimentos/ortodontia-fixa.avif")}
          />
        </div>
      }
    />
  );
}
