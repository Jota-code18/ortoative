"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import {
  calcularSugestao,
  mensagemSugestao,
  montarPerguntas,
  type Opcao,
  PROCEDIMENTOS,
  type Resposta,
  type TrilhaSugestao,
} from "@/lib/sugestao";

/**
 * "Entenda qual o melhor para você" — quiz no lugar da tabela comparativa.
 *
 * A tabela pedia leitura e conclusão própria; a maioria passava direto. Aqui o
 * visitante responde sobre a boca e a rotina dele e recebe uma sugestão com o
 * porquê, e o próximo passo é falar com quem pode confirmar.
 *
 * Altura mínima fixa para o restante da página não pular a cada resposta.
 */
export default function QuizTratamento() {
  const [trilha, setTrilha] = useState<TrilhaSugestao | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  const perguntas = montarPerguntas(trilha);
  const passo = respostas.length;
  const concluido = trilha !== null && passo >= perguntas.length;
  const pergunta = perguntas[passo];

  /* Antes da trilha ser escolhida o total ainda não existe. Seis é a régua
     estimada — o caminho mais longo tem sete, e a barra crescer é menos
     desagradável do que encolher. */
  const total = trilha ? perguntas.length : 6;

  /* Marcos da régua com identidade própria: a lista é fixa e nunca reordena,
     mas chave por índice esconde justamente esse tipo de bug. */
  const marcos = Array.from({ length: total }, (_, i) => ({
    id: `marco-${i}`,
    feito: i <= passo,
  }));

  function responder(opcao: Opcao) {
    if (opcao.trilha) setTrilha(opcao.trilha);
    setRespostas((r) => [...r, { perguntaId: pergunta.id, opcao }]);
  }

  function voltar() {
    /* Desfazer a primeira resposta desfaz também a trilha, senão a sequência
       seguinte continuaria sendo a da trilha antiga. */
    if (respostas.length === 1) setTrilha(null);
    setRespostas((r) => r.slice(0, -1));
  }

  function reiniciar() {
    setTrilha(null);
    setRespostas([]);
  }

  return (
    /* Região nomeada: a home tem dois quizzes, e o leitor de tela (como o
       teste) precisa saber em qual está. */
    <section
      aria-labelledby="quiz-tratamento-titulo"
      className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8"
    >
      <h2
        id="quiz-tratamento-titulo"
        className="text-center text-2xl leading-tight md:text-4xl"
      >
        Entenda qual o melhor para você
      </h2>

      <div className="mt-5 flex min-h-[320px] flex-col justify-center md:mt-7 md:min-h-[300px]">
        {concluido ? (
          <Resultado respostas={respostas} aoRefazer={reiniciar} />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {marcos.map((m) => (
                  <div
                    key={m.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      m.feito ? "bg-brand-green-btn" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                {passo + 1}/{trilha ? total : "…"}
              </span>
            </div>

            {/* A `key` remonta o bloco a cada passo e dispara a animação de
                entrada. Sem animação de saída: quem acabou de tocar quer a
                próxima pergunta agora, esperar a anterior sair vira atraso. */}
            <div key={passo} className="passo-entra mt-5 md:mt-7">
              <h3 className="text-center text-lg font-semibold leading-snug text-foreground md:text-2xl">
                {pergunta.titulo}
              </h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:mt-6">
                {pergunta.opcoes.map((opcao) => (
                  <button
                    key={opcao.label}
                    type="button"
                    onClick={() => responder(opcao)}
                    /* min-h de 44px: alvo de toque confortável (WCAG 2.5.8) */
                    className="tatil flex min-h-[44px] items-center rounded-full border border-border bg-background px-4 text-sm font-semibold leading-tight text-foreground transition-colors hover:border-brand-green-btn hover:bg-brand-green-btn hover:text-white md:text-base"
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-sm text-muted-foreground md:mt-7">
              {passo > 0 && (
                <button
                  type="button"
                  onClick={voltar}
                  className="font-semibold hover:text-foreground"
                >
                  ← Voltar
                </button>
              )}
              <span>Leva menos de 1 minuto · sem compromisso</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Resultado({
  respostas,
  aoRefazer,
}: {
  respostas: Resposta[];
  aoRefazer: () => void;
}) {
  const sugestao = calcularSugestao(respostas);
  const principal = PROCEDIMENTOS[sugestao.principal];
  const alternativa = sugestao.alternativa ? PROCEDIMENTOS[sugestao.alternativa] : null;
  const verde = principal.tom === "verde";
  const corDoTom = verde ? "text-brand-green-text" : "text-primary";

  return (
    <div className="passo-entra text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Pelas suas respostas, o caminho mais provável é
      </p>
      <p className={`mt-1 text-2xl leading-tight md:text-4xl ${corDoTom}`}>
        {principal.nome}
      </p>
      <p className="mx-auto mt-2 max-w-lg text-base text-foreground md:text-lg">
        {principal.frase}
      </p>

      {sugestao.motivos.length > 0 && (
        <ul className="mx-auto mt-4 max-w-lg space-y-2 text-left">
          {sugestao.motivos.map((motivo) => (
            <li
              key={motivo}
              className="flex gap-2 text-sm text-muted-foreground md:text-base"
            >
              <span aria-hidden="true" className={`font-bold ${corDoTom}`}>
                ✓
              </span>
              {motivo}
            </li>
          ))}
        </ul>
      )}

      {alternativa && (
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground md:text-base">
          Vale olhar também:{" "}
          <Link
            href={alternativa.href}
            className={`font-semibold underline-offset-4 hover:underline ${corDoTom}`}
          >
            {alternativa.nome}
          </Link>
          .
        </p>
      )}

      {/* O quiz sugere; quem decide é o profissional. Deixar isso claro é o que
          torna o convite para a consulta a consequência natural do resultado. */}
      <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-realce px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        Isto é uma sugestão feita a partir do que você contou. Só um exame vê osso, raiz e
        mordida — mande suas respostas para a nossa equipe e receba a indicação de um
        profissional, sem custo.
      </p>

      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={whatsappLink(mensagemSugestao(respostas, sugestao))}
          target="_blank"
          rel="noopener noreferrer"
          className="tatil inline-block rounded-full bg-brand-green-btn px-7 py-3.5 text-base font-extrabold text-white transition-transform hover:scale-105"
        >
          Falar com um profissional
        </a>
        <Link
          href={principal.href}
          className={`tatil inline-block px-2 py-2 text-base font-bold underline-offset-4 hover:underline ${corDoTom}`}
        >
          Conhecer {principal.nome}
        </Link>
      </div>

      <button
        type="button"
        onClick={aoRefazer}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground"
      >
        Refazer o quiz
      </button>
    </div>
  );
}
