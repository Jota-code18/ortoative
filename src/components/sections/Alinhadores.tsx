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
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3] md:rounded-3xl">
          <Image
            src="/images/alinhadores/alinhador-na-mao.avif"
            alt="Alinhador invisível segurado na mão, diante de um sorriso"
            fill
            sizes="(max-width: 768px) 36vw, 50vw"
            /* A foto é 16:9 e o alinhador fica à direita do centro. Nos dois
               formatos do quadro (1:1 no celular, 4:3 no desktop) sobra só
               largura, e centralizar cortaria a mão que segura a peça. */
            className="object-cover object-[58%_50%]"
            {...previa("/images/alinhadores/alinhador-na-mao.avif")}
          />
        </div>
      }
    />
  );
}
