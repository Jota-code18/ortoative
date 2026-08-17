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
 * No celular o arranjo é em L: a imagem fica ao lado do bloco de cima — nome
 * mais número, ou nome mais frase em quem não tem contagem — e o restante corre
 * na largura inteira embaixo. Assim a imagem entra no mesmo campo de visão do
 * nome, e a descrição não fica espremida numa coluna de 60%.
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

  const blocoFrase = (
    /* Preta e um degrau abaixo do nome: é a frase que vende, e precisa de
       peso — cinza a rebaixaria a legenda. */
    <p className="max-w-xl text-lg font-semibold leading-snug text-foreground md:text-3xl">
      {frase}
    </p>
  );

  return (
    <section id={id} className="scroll-mt-20 py-4 md:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_38%] items-start gap-x-4 gap-y-3 px-4 md:grid-cols-2 md:items-center md:gap-x-12">
        {/* Bloco de cima: o que fica ao lado da imagem no celular. */}
        <Reveal className={textoNaDireita ? "md:order-2" : "md:order-1"}>
          <h2 className={`text-2xl leading-tight md:text-5xl ${corDoTom}`}>{nome}</h2>

          {numero ? (
            <p className="mt-1.5 md:mt-3">
              <span className={`block text-xl font-extrabold md:text-4xl ${corDoTom}`}>
                <NumeroAnimado valor={numero} />
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground md:text-base">
                {numeroRotulo}
              </span>
            </p>
          ) : (
            /* Sem contagem, é a frase que sobe para o lado da imagem — o bloco
               de cima nunca fica só com o nome. */
            <div className="mt-2 md:mt-4">{blocoFrase}</div>
          )}

          {/* No desktop tudo mora nesta coluna; no celular o resto desce. */}
          <div className="hidden md:block">
            {numero && <div className="mt-4">{blocoFrase}</div>}
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {descricao}
            </p>
            <Chamadas
              ctaPrincipal={ctaPrincipal}
              mensagemWhatsapp={mensagemWhatsapp}
              verde={verde}
              corDoTom={corDoTom}
            />
          </div>
        </Reveal>

        <Reveal
          from={textoNaDireita ? "left" : "right"}
          delay={120}
          className={textoNaDireita ? "md:order-1" : "md:order-2"}
        >
          {imagem}
        </Reveal>

        {/* No celular: largura inteira, abaixo do bloco de cima e da imagem. */}
        <div className="col-span-2 md:hidden">
          {numero && blocoFrase}
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {descricao}
          </p>
          <Chamadas
            ctaPrincipal={ctaPrincipal}
            mensagemWhatsapp={mensagemWhatsapp}
            verde={verde}
            corDoTom={corDoTom}
          />
        </div>
      </div>
    </section>
  );
}

function Chamadas({
  ctaPrincipal,
  mensagemWhatsapp,
  verde,
  corDoTom,
}: {
  ctaPrincipal: { href: string; texto: string };
  mensagemWhatsapp: string;
  verde: boolean;
  corDoTom: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 md:mt-6">
      <Link
        href={ctaPrincipal.href}
        className={`tatil rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors md:px-6 md:py-3 md:text-base ${
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
        className={`tatil inline-block py-2.5 text-sm font-bold underline-offset-4 hover:underline md:py-3 md:text-base ${corDoTom}`}
      >
        Falar no WhatsApp
      </a>
    </div>
  );
}
