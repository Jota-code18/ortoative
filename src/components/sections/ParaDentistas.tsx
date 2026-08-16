import Image from "next/image";
import SecaoProcedimento from "@/components/sections/SecaoProcedimento";
import { previa } from "@/lib/lqip";

/**
 * Ortoative para dentistas — mesma hierarquia das seções de procedimento.
 *
 * Não é procedimento, mas é uma oferta com nome, promessa e chamada, e o
 * visitante lê a home inteira na mesma cadência. Usar outro desenho aqui
 * quebraria o ritmo sem ganhar nada.
 */
export default function ParaDentistas() {
  return (
    <SecaoProcedimento
      id="para-dentistas"
      nome="Ortoative para dentistas"
      frase="Aprenda com quem fabrica."
      descricao="O Prof. Dr. Rui Cambauva — autor de dois livros de Ortodontia e ex-professor de quatro universidades — compartilha o que 26 anos de clínica e fábrica própria ensinaram."
      ctaPrincipal={{ href: "/para-dentistas", texto: "Conhecer a formação" }}
      mensagemWhatsapp="Oi! Sou dentista e quero saber mais sobre a formação da Ortoative."
      tom="verde"
      textoNaDireita
      imagem={
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3] md:rounded-3xl">
          <Image
            src="/images/dentistas/rui-apresentacao.avif"
            alt="Dr. Rui Cambauva analisando um escaneamento 3D no computador"
            fill
            sizes="(max-width: 768px) 36vw, 50vw"
            className="object-cover"
            {...previa("/images/dentistas/rui-apresentacao.avif")}
          />
        </div>
      }
    />
  );
}
