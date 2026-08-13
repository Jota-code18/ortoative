"use client";

import { useState } from "react";
import { enviarLead, formatarTelefone, telefoneValido } from "@/lib/lead";
import { etapaInicial, montarMensagem, montarSequencia, type TrilhaId } from "@/lib/quiz";
import { whatsappLink } from "@/lib/site";

/**
 * Versão compacta da triagem para rodar na própria home, dentro do espaço que
 * a chamada ocupava antes. Altura fixa para o layout não pular a cada passo.
 */
export default function QuizInline() {
  const [passo, setPasso] = useState(0);
  const [trilha, setTrilha] = useState<TrilhaId | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);

  const sequencia = montarSequencia(trilha);
  const total = sequencia.length + 1; // + passo do nome
  const noNome = passo === sequencia.length;
  const concluido = passo > sequencia.length;
  const etapa = sequencia[passo];

  function responder(id: string, label: string, novaTrilha?: TrilhaId) {
    setRespostas((r) => ({ ...r, [id]: label }));
    if (id === etapaInicial.id) setTrilha(novaTrilha ?? null);
    setPasso((p) => p + 1);
  }

  function reiniciar() {
    setPasso(0);
    setTrilha(null);
    setRespostas({});
    setNome("");
    setTelefone("");
    setEnviando(false);
  }

  async function concluir(e: React.FormEvent) {
    e.preventDefault();
    if (!telefoneValido(telefone) || enviando) return;
    setEnviando(true);
    /* Espera a resposta de propósito. Antes o envio era disparado e a tela
       pulava na hora: quem tinha internet ruim via "tudo pronto" sem nada ter
       saído. Se o e-mail falhar, seguimos assim mesmo — o WhatsApp da tela
       seguinte é o caminho que realmente fecha o atendimento. */
    await enviarLead({ nome, telefone, trilha, respostas });
    setEnviando(false);
    setPasso((p) => p + 1);
  }

  return (
    <div className="mx-auto flex min-h-[300px] w-full max-w-3xl flex-col justify-center">
      {concluido ? (
        <div className="passo-entra text-center">
          <h2 className="text-2xl md:text-3xl">
            Tudo pronto{nome ? `, ${nome.split(" ")[0]}` : ""}!
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Nossa secretária entrará em contato com você dentro dos próximos 10 minutos.
            Se já quiser dar mais informações, pode entrar em contato clicando no botão
            abaixo:
          </p>
          <a
            href={whatsappLink(montarMensagem(nome, trilha, respostas))}
            target="_blank"
            rel="noopener noreferrer"
            className="tatil mt-5 inline-block rounded-full bg-brand-green-btn px-8 py-4 text-lg font-extrabold text-white transition-transform hover:scale-105"
          >
            Agendar agora
          </a>
          <button
            type="button"
            onClick={reiniciar}
            className="mt-4 block w-full text-sm text-white/70 hover:text-white md:text-base"
          >
            Refazer
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center gap-3">
            {/* Antes da trilha ser escolhida o total ainda não existe: mostra
                uma régua estimada para a barra não encolher depois */}
            <div className="flex flex-1 gap-1.5" aria-hidden="true">
              {Array.from({ length: trilha ? total : 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= passo ? "bg-brand-green" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="shrink-0 text-sm font-semibold text-white/75">
              {passo + 1}/{trilha ? total : "…"}
            </span>
          </div>

          {/* A `key` remonta o bloco a cada passo, o que dispara a animação de
              entrada. Não há animação de saída na troca de pergunta de
              propósito: o paciente acabou de tocar e quer a próxima agora —
              esperar a anterior sair viraria atraso. A saída fica reservada
              para o envio, que acontece uma vez e é o momento que importa. */}
          <div key={passo} className={enviando ? "passo-sai" : "passo-entra"}>
            {noNome ? (
              <>
                <h2 className="text-center text-2xl md:text-3xl">
                  Como podemos te chamar?
                </h2>
                <form className="mx-auto mt-5 w-full max-w-lg" onSubmit={concluir}>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      required
                      autoComplete="name"
                      className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/65 focus:border-brand-green"
                    />
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
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
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="girando h-5 w-5"
                      >
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
                    {enviando ? "Enviando…" : "Concluir"}
                  </button>
                  {/* aria-live: quem usa leitor de tela também precisa saber que
                    o envio começou — a rodinha é decorativa */}
                  <p aria-live="polite" className="sr-only">
                    {enviando ? "Enviando seus dados para a recepção." : ""}
                  </p>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-center text-2xl md:text-3xl">{etapa.titulo}</h2>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {etapa.opcoes.map((opcao) => (
                    <button
                      key={opcao.label}
                      type="button"
                      onClick={() => responder(etapa.id, opcao.label, opcao.trilha)}
                      /* min-h de 44px: alvo de toque confortável (WCAG 2.5.8) */
                      className="tatil flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-brand-green hover:bg-brand-green-btn"
                    >
                      {opcao.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-sm text-white/75 md:text-base">
            {passo > 0 && (
              <button
                type="button"
                onClick={() => setPasso((p) => p - 1)}
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
  );
}
