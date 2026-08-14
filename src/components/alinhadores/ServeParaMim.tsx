"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/lib/site";

/**
 * "Serve para o meu caso?" — a pergunta que trava a decisão.
 *
 * Nenhum concorrente responde: todos param em "só um dentista pode dizer".
 * É verdade, mas mandar embora quem perguntou é desperdício. Aqui a pessoa
 * marca o que tem e recebe a leitura honesta do caso dela, com o encaminhamento
 * certo — inclusive quando a resposta é "alinhador não é o melhor para você".
 *
 * Dizer que o alinhador não serve em alguns casos não é perder venda: é o que
 * faz o "serve" valer alguma coisa. E a Ortoative faz os dois tratamentos.
 */
type Resposta = "sim" | "provavel" | "avaliar";

const CASOS: {
  id: string;
  label: string;
  resposta: Resposta;
  texto: string;
}[] = [
  {
    id: "tortos",
    label: "Dentes tortos ou girados",
    resposta: "sim",
    texto:
      "É o caso mais comum de alinhador. Giro leve e apinhamento moderado resolvem bem, com a vantagem de você acompanhar o movimento na simulação antes de começar.",
  },
  {
    id: "espacos",
    label: "Espaços entre os dentes",
    resposta: "sim",
    texto:
      "Fechamento de espaço é onde o alinhador costuma ser mais rápido que o aparelho fixo, porque o movimento é previsível e planejado de uma vez.",
  },
  {
    id: "mordida",
    label: "Mordida que não encaixa",
    resposta: "provavel",
    texto:
      "Depende do quanto a mordida está deslocada. Boa parte dos casos resolve com alinhador e acessórios; os mais severos pedem aparelho fixo, e às vezes os dois em etapas.",
  },
  {
    id: "recidiva",
    label: "Usei aparelho e os dentes voltaram",
    resposta: "sim",
    texto:
      "Recidiva é caso clássico de alinhador: o movimento costuma ser pequeno, o tratamento é curto, e você sai com a contenção que faltou da primeira vez.",
  },
  {
    id: "adolescente",
    label: "É para um adolescente",
    resposta: "provavel",
    texto:
      "Funciona, e a discrição costuma pesar muito nessa idade. O ponto a conversar é disciplina: o alinhador só trabalha nas horas em que está na boca.",
  },
  {
    id: "implante",
    label: "Tenho implante ou prótese",
    resposta: "avaliar",
    texto:
      "Implante não se move — ele é osso integrado. Dá para tratar em volta dele, mas o planejamento muda bastante. Esse caso precisa de exame de imagem antes de qualquer promessa.",
  },
  {
    id: "gengiva",
    label: "Minha gengiva sangra",
    resposta: "avaliar",
    texto:
      "Antes de mover dente, trata-se a gengiva. Mover dente em gengiva inflamada piora o quadro. A boa notícia é que o tratamento de gengiva é rápido e feito aqui também.",
  },
  {
    id: "siso",
    label: "Preciso extrair um dente ou siso",
    resposta: "avaliar",
    texto:
      "Muitas vezes a extração faz parte do plano e entra antes do alinhador. A ordem certa sai do exame de imagem — e a cirurgia também é feita aqui.",
  },
];

const TOM: Record<Resposta, { rotulo: string; cor: string; fundo: string }> = {
  sim: {
    rotulo: "Caso típico de alinhador",
    cor: "text-brand-green-text",
    fundo: "color-mix(in oklch, var(--brand-green) 12%, transparent)",
  },
  provavel: {
    rotulo: "Provavelmente sim, com uma conversa",
    cor: "text-primary",
    fundo: "color-mix(in oklch, var(--primary) 10%, transparent)",
  },
  avaliar: {
    rotulo: "Precisa de avaliação antes",
    cor: "text-foreground",
    fundo: "color-mix(in oklch, var(--foreground) 7%, transparent)",
  },
};

export default function ServeParaMim() {
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const caso = CASOS.find((c) => c.id === escolhido);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-green-text">
        Sem enrolação
      </p>
      <h2 className="mt-1 text-2xl md:text-4xl">Serve para o meu caso?</h2>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
        Marque o que mais parece com a sua situação. A resposta é a mesma que você ouviria
        na cadeira — inclusive quando não for a que a gente gostaria de dar.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {CASOS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setEscolhido(c.id === escolhido ? null : c.id)}
            aria-pressed={c.id === escolhido}
            className={`tatil flex min-h-[44px] items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
              c.id === escolhido
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {caso && (
        <div
          key={caso.id}
          className="conteudo-chega mt-5 rounded-2xl p-5"
          style={{ background: TOM[caso.resposta].fundo }}
        >
          <p
            className={`text-sm font-bold uppercase tracking-wide ${TOM[caso.resposta].cor}`}
          >
            {TOM[caso.resposta].rotulo}
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground md:text-lg">
            {caso.texto}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#avaliacao"
              className="tatil rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-blue"
            >
              Fazer a avaliação gratuita
            </Link>
            <a
              href={whatsappLink(
                `Oi! Vi a página dos alinhadores e meu caso é: ${caso.label.toLowerCase()}. Queria saber mais.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="tatil rounded-full border-2 border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Antes de escolher, o espaço não fica vazio nem pula quando a resposta
          entra: a altura mínima segura o layout. */}
      {!caso && (
        <p className="mt-5 min-h-[3rem] text-base text-muted-foreground">
          Escolha uma opção acima para ver a resposta.
        </p>
      )}
    </div>
  );
}
