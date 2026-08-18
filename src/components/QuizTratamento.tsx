"use client";

import Link from "next/link";
import { useState } from "react";
import { enviarLead, formatarTelefone, telefoneValido } from "@/lib/lead";
import { whatsappLink } from "@/lib/site";
import {
  calcularSugestao,
  detalhesDaSugestao,
  mensagemSugestao,
  type Opcao,
  PERGUNTAS,
  PROCEDIMENTOS,
  type Resposta,
} from "@/lib/sugestao";

/**
 * "Entenda qual o melhor para você" — quiz no lugar da tabela comparativa.
 *
 * Mesmo desenho da triagem do topo (fundo azul, régua de passos, opções em
 * pílula) porque é a mesma mecânica; mudar a aparência faria o visitante achar
 * que caiu em outro site.
 *
 * A diferença é a ordem: aqui o resultado vem antes do formulário. A promessa
 * feita no título é descobrir qual tratamento serve, e cobrar o telefone antes
 * de cumprir isso é o que faz o visitante fechar a página. Com a sugestão na
 * tela, o contato deixa de ser pedágio e vira o passo seguinte natural.
 */
export default function QuizTratamento() {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const passo = respostas.length;
  const respondeuTudo = passo >= PERGUNTAS.length;
  const pergunta = PERGUNTAS[passo];

  function responder(opcao: Opcao) {
    setRespostas((r) => [...r, { perguntaId: pergunta.id, opcao }]);
  }

  function reiniciar() {
    setRespostas([]);
    setNome("");
    setTelefone("");
    setEnviando(false);
    setEnviado(false);
  }

  async function concluir(e: React.FormEvent) {
    e.preventDefault();
    if (!telefoneValido(telefone) || enviando) return;
    setEnviando(true);

    const sugestao = calcularSugestao(respostas);
    /* Espera a resposta de propósito: disparar e seguir mostrava "tudo pronto"
       a quem tinha internet ruim sem nada ter saído. Se o e-mail falhar,
       seguimos assim mesmo — o WhatsApp da tela seguinte é o que fecha. */
    await enviarLead({
      nome,
      telefone,
      trilha: null,
      respostas: Object.fromEntries(
        respostas.map(({ perguntaId, opcao }) => [perguntaId, opcao.label])
      ),
      origem: "Quiz alinhador x ortodontia fixa",
      detalhes: detalhesDaSugestao(respostas),
      especialidade: PROCEDIMENTOS[sugestao.principal].nome,
    });

    setEnviando(false);
    setEnviado(true);
  }

  return (
    /* Região nomeada: a home tem dois quizzes, e quem usa leitor de tela
       precisa saber em qual está. */
    <section
      aria-labelledby="quiz-tratamento-titulo"
      className="mx-auto flex w-full max-w-3xl flex-col justify-center"
    >
      <h2
        id="quiz-tratamento-titulo"
        className="text-center text-2xl leading-tight md:text-4xl"
      >
        Entenda qual o melhor para você
      </h2>

      <div className="mt-4 flex min-h-[300px] flex-col justify-center md:mt-6 md:min-h-[320px]">
        {enviado ? (
          <Concluido nome={nome} respostas={respostas} aoRefazer={reiniciar} />
        ) : respondeuTudo ? (
          <Resultado
            respostas={respostas}
            nome={nome}
            telefone={telefone}
            enviando={enviando}
            aoMudarNome={setNome}
            aoMudarTelefone={setTelefone}
            aoEnviar={concluir}
            aoRefazer={reiniciar}
          />
        ) : (
          <>
            <div className="mb-3 flex items-center gap-3 md:mb-5">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {PERGUNTAS.map((p, i) => (
                  <div
                    key={p.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= passo ? "bg-brand-green" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="shrink-0 text-sm font-semibold text-white/75">
                {passo + 1}/{PERGUNTAS.length}
              </span>
            </div>

            {/* A `key` remonta o bloco a cada passo e dispara a animação de
                entrada. Sem animação de saída: quem acabou de tocar quer a
                próxima pergunta agora, esperar a anterior sair vira atraso. */}
            <div key={passo} className="passo-entra">
              <h3 className="text-center text-xl md:text-3xl">{pergunta.titulo}</h3>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:mt-5 md:gap-2">
                {pergunta.opcoes.map((opcao) => (
                  <button
                    key={opcao.label}
                    type="button"
                    onClick={() => responder(opcao)}
                    /* min-h de 44px: alvo de toque confortável (WCAG 2.5.8) */
                    className="tatil flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/5 px-3.5 text-sm font-semibold leading-tight text-white transition-colors hover:border-brand-green hover:bg-brand-green-btn md:px-4"
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/75 md:mt-5 md:text-base">
              {passo > 0 && (
                <button
                  type="button"
                  onClick={() => setRespostas((r) => r.slice(0, -1))}
                  className="font-semibold hover:text-white"
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
  nome,
  telefone,
  enviando,
  aoMudarNome,
  aoMudarTelefone,
  aoEnviar,
  aoRefazer,
}: {
  respostas: Resposta[];
  nome: string;
  telefone: string;
  enviando: boolean;
  aoMudarNome: (v: string) => void;
  aoMudarTelefone: (v: string) => void;
  aoEnviar: (e: React.FormEvent) => void;
  aoRefazer: () => void;
}) {
  const sugestao = calcularSugestao(respostas);
  const principal = PROCEDIMENTOS[sugestao.principal];
  const alternativa = PROCEDIMENTOS[sugestao.alternativa];

  return (
    <div className={enviando ? "passo-sai" : "passo-entra"}>
      <p className="text-center text-sm font-semibold uppercase tracking-wide text-white/70">
        {sugestao.equilibrado
          ? "Os dois servem no seu caso, com leve vantagem para"
          : "Pelas suas respostas, o caminho mais provável é"}
      </p>
      <p className="mt-1 text-center text-2xl leading-tight text-brand-green md:text-4xl">
        {principal.nome}
      </p>
      <p className="mx-auto mt-2 max-w-lg text-center text-white/85 md:text-lg">
        {principal.frase}
      </p>

      {sugestao.motivos.length > 0 && (
        <ul className="mx-auto mt-4 max-w-lg space-y-1.5 text-left">
          {sugestao.motivos.map((motivo) => (
            <li key={motivo} className="flex gap-2 text-sm text-white/80 md:text-base">
              <span aria-hidden="true" className="font-bold text-brand-green">
                ✓
              </span>
              {motivo}
            </li>
          ))}
        </ul>
      )}

      {/* O quiz sugere; quem decide é o profissional. Dizer isso é o que torna
          o pedido de contato a consequência natural do resultado. */}
      <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-white/70">
        Isto é uma sugestão a partir do que você contou — só um exame vê osso, raiz e
        mordida. Deixe seu contato e um profissional confirma se {principal.nome} é mesmo
        o seu caso ou se {alternativa.nome} resolve melhor.
      </p>

      <form className="mx-auto mt-4 w-full max-w-lg" onSubmit={aoEnviar}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={nome}
            onChange={(e) => aoMudarNome(e.target.value)}
            placeholder="Seu nome"
            required
            autoComplete="name"
            className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/65 focus:border-brand-green"
          />
          <input
            type="tel"
            value={telefone}
            onChange={(e) => aoMudarTelefone(formatarTelefone(e.target.value))}
            placeholder="Telefone com DDD"
            required
            inputMode="numeric"
            autoComplete="tel"
            className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/65 focus:border-brand-green"
          />
        </div>
        <button
          type="submit"
          disabled={!nome.trim() || !telefoneValido(telefone) || enviando}
          className="tatil mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green-btn px-6 py-3 font-bold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {enviando && (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="girando h-5 w-5">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
              />
              <path
                d="M12 3a9 9 0 0 1 9 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
          {enviando ? "Enviando…" : "Quero a confirmação de um profissional"}
        </button>
        {/* aria-live: quem usa leitor de tela também precisa saber que o envio
            começou — a rodinha é decorativa */}
        <p aria-live="polite" className="sr-only">
          {enviando ? "Enviando seus dados para a recepção." : ""}
        </p>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-white/70">
        <Link href={principal.href} className="font-semibold hover:text-white">
          Conhecer {principal.nome}
        </Link>
        <button type="button" onClick={aoRefazer} className="hover:text-white">
          Refazer o quiz
        </button>
      </div>
    </div>
  );
}

function Concluido({
  nome,
  respostas,
  aoRefazer,
}: {
  nome: string;
  respostas: Resposta[];
  aoRefazer: () => void;
}) {
  const sugestao = calcularSugestao(respostas);

  return (
    <div className="passo-entra text-center">
      <h3 className="text-2xl md:text-3xl">
        Tudo pronto{nome ? `, ${nome.split(" ")[0]}` : ""}!
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-white/80">
        Levamos suas respostas e a sugestão de {PROCEDIMENTOS[sugestao.principal].nome}{" "}
        para a nossa equipe. A secretária entra em contato dentro dos próximos 10 minutos.
        Se preferir adiantar, é só chamar no WhatsApp:
      </p>
      <a
        href={whatsappLink(mensagemSugestao(nome, respostas, sugestao))}
        target="_blank"
        rel="noopener noreferrer"
        className="tatil mt-5 inline-block rounded-full bg-brand-green-btn px-8 py-4 text-lg font-extrabold text-white transition-transform hover:scale-105"
      >
        Falar com um profissional
      </a>
      <button
        type="button"
        onClick={aoRefazer}
        className="mt-4 block w-full text-sm text-white/70 hover:text-white md:text-base"
      >
        Refazer
      </button>
    </div>
  );
}
