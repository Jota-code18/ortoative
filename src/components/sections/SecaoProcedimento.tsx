import Link from "next/link";
import type { ReactNode } from "react";
import NumeroAnimado from "@/components/NumeroAnimado";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site";

/**
 * Molde das seções de procedimento da home.
 *
 * Existe para a hierarquia ser a mesma em todas — antes cada uma tinha a sua,
 * com o nome ora em antetítulo pequeno ora em manchete. Com um molde só, mudar
 * a hierarquia é mudar um arquivo e nenhuma seção fica para trás.
 *
 * Ordem de leitura, sempre igual:
 *   1. nome do procedimento — o maior, na cor do tom
 *   2. número de sorrisos, quando existe
 *   3. frase de destaque, preta e um degrau menor que o nome
 *   4. descrição, que explica o que a frase só promete
 *   5. chamadas
 *
 * No celular a imagem fica AO LADO do texto, não acima. Empilhada, a seção
 * passava de uma tela e a imagem caía fora do campo de visão — o paciente
 * rolava sem nunca ver as duas coisas juntas. Ao lado e menor, tudo cabe numa
 * tela só.
 */
export default function SecaoProcedimento({
  id,
  nome,
  numero,
  numeroRotulo,
  frase,
  descricao,
  ctaPrincipal,
  mensagemWhatsapp,
  imagem,
  tom,
  textoNaDireita = false,
}: {
  id: string;
  /** nome do procedimento — primeiro nível, na cor do tom */
  nome: string;
  /** só alinhadores e ortodontia fixa têm contagem */
  numero?: string;
  numeroRotulo?: string;
  /** frase de destaque logo abaixo do nome */
  frase: string;
  /** explica o tratamento — a frase sozinha vende, mas não informa */
  descricao: string;
  ctaPrincipal: { href: string; texto: string };
  mensagemWhatsapp: string;
  imagem: ReactNode;
  tom: "verde" | "azul";
  /** as seções alternam o lado do texto ao descer a página */
  textoNaDireita?: boolean;
}) {
  const verde = tom === "verde";
  const corDoTom = verde ? "text-brand-green-text" : "text-primary";

  return (
    <section id={id} className="scroll-mt-20 py-4 md:py-10">
      {/* A imagem ocupa 40% no celular e metade no desktop: é o que sobra de
          largura depois do texto sem apertar demais a leitura. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_40%] items-center gap-4 px-4 md:grid-cols-2 md:gap-12">
        <Reveal
          from={textoNaDireita ? "left" : "right"}
          delay={120}
          className={textoNaDireita ? "order-1" : "order-2"}
        >
          {imagem}
        </Reveal>

        <Reveal className={textoNaDireita ? "order-2" : "order-1"}>
          <h2 className={`text-2xl leading-tight md:text-5xl ${corDoTom}`}>{nome}</h2>

          {numero && (
            <p className="mt-1.5 md:mt-3">
              <span className={`block text-xl font-extrabold md:text-4xl ${corDoTom}`}>
                <NumeroAnimado valor={numero} />
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground md:text-base">
                {numeroRotulo}
              </span>
            </p>
          )}

          {/* Preta e um degrau abaixo do nome: é a frase que vende, e precisa
              de peso — cinza a rebaixaria a legenda. */}
          <p className="mt-2 max-w-xl text-lg font-semibold leading-snug text-foreground md:mt-4 md:text-3xl">
            {frase}
          </p>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-lg">
            {descricao}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 md:mt-6 md:gap-3">
            <Link
              href={ctaPrincipal.href}
              className={`tatil rounded-full px-4 py-2.5 text-sm font-bold text-white transition-colors md:px-6 md:py-3 md:text-base ${
                verde
                  ? "bg-brand-green-btn hover:bg-brand-green-text"
                  : "bg-primary hover:bg-brand-blue"
              }`}
            >
              {ctaPrincipal.texto}
            </Link>
            <a
              href={whatsappLink(mensagemWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={`tatil inline-block px-2 py-2.5 text-sm font-bold underline-offset-4 hover:underline md:py-3 md:text-base ${corDoTom}`}
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
