import Link from "next/link";
import type { ReactNode } from "react";
import NumeroAnimado from "@/components/NumeroAnimado";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site";

/**
 * Molde das quatro seções de procedimento da home.
 *
 * Existe para garantir que a hierarquia seja a mesma nas quatro — antes cada
 * uma tinha a sua, com o nome ora em antetítulo pequeno ora em manchete, e a
 * frase de apoio ora cinza ora preta. Com um molde só, mudar a hierarquia é
 * mudar um arquivo, e nenhuma seção fica para trás.
 *
 * A ordem de leitura é sempre a mesma:
 *   1. nome do procedimento — o maior
 *   2. número de sorrisos, quando existe
 *   3. frase de apoio, preta e um degrau menor que o nome
 *   4. chamadas
 */
export default function SecaoProcedimento({
  id,
  nome,
  numero,
  numeroRotulo,
  frase,
  ctaPrincipal,
  mensagemWhatsapp,
  imagem,
  tom,
  textoNaDireita = false,
}: {
  id: string;
  /** nome do procedimento — primeiro nível */
  nome: string;
  /** só alinhadores e ortodontia fixa têm contagem */
  numero?: string;
  numeroRotulo?: string;
  frase: string;
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
    <section id={id} className="scroll-mt-20 py-5 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        {/* No celular a imagem vem sempre antes do texto; a alternância de
            lados só existe onde há duas colunas. */}
        <Reveal
          from={textoNaDireita ? "left" : "right"}
          delay={120}
          className={textoNaDireita ? "md:order-1" : "md:order-2"}
        >
          {imagem}
        </Reveal>

        <Reveal className={textoNaDireita ? "md:order-2" : "md:order-1"}>
          <h2 className="text-4xl leading-tight md:text-5xl">{nome}</h2>

          {numero && (
            <p className="mt-3">
              <span className={`block text-3xl font-extrabold md:text-4xl ${corDoTom}`}>
                <NumeroAnimado valor={numero} />
              </span>
              <span className="mt-0.5 block text-base text-muted-foreground">
                {numeroRotulo}
              </span>
            </p>
          )}

          {/* Preta e um degrau abaixo do nome: é a frase que explica, e
              precisa de peso — cinza a rebaixaria a legenda. */}
          <p className="mt-4 max-w-xl text-2xl font-semibold leading-snug text-foreground md:text-3xl">
            {frase}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaPrincipal.href}
              className={`tatil rounded-full px-6 py-3 font-bold text-white transition-colors ${
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
              className={`tatil inline-block px-2 py-3 font-bold underline-offset-4 hover:underline ${corDoTom}`}
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
