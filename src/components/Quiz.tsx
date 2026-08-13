"use client";

import { useState } from "react";
import { enviarLead, formatarTelefone, telefoneValido } from "@/lib/lead";
import {
  etapaInicial,
  montarMensagem,
  montarSequencia,
  type TrilhaId,
} from "@/lib/quiz";
import { whatsappLink } from "@/lib/site";

/**
 * Triagem ramificada (Notion): identifica a queixa, segue só pelas perguntas
 * daquela especialidade e entrega o resumo à secretária, que aborda o paciente
 * e prepara o profissional correto.
 *
 * Versão página inteira; a compacta da home é QuizInline (mesma lógica).
 */
export default function Quiz() {
  const [passo, setPasso] = useState(0);
  const [trilha, setTrilha] = useState<TrilhaId | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

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

  function concluir(e: React.FormEvent) {
    e.preventDefault();
    if (!telefoneValido(telefone)) return;
    // Avisa a recepção por e-mail; o WhatsApp continua disponível ao paciente
    enviarLead({ nome, telefone, trilha, respostas });
    setPasso((p) => p + 1);
  }

  if (concluido) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <h2 className="text-2xl">Tudo pronto, {nome.split(" ")[0] || "obrigado"}!</h2>
        <p className="mt-3 text-muted-foreground">
          Nossa secretária entrará em contato com você dentro dos próximos 10 minutos.
          Se já quiser dar mais informações, pode entrar em contato clicando no botão
          abaixo:
        </p>
        <a
          href={whatsappLink(montarMensagem(nome, trilha, respostas))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-brand-green-btn px-8 py-4 text-lg font-extrabold text-white transition-transform hover:scale-105"
        >
          Agendar agora
        </a>
        <p className="mt-4 text-base text-muted-foreground">
          Sem compromisso. Seus dados são usados só para este atendimento.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      {/* Antes da trilha ser escolhida o total ainda não existe: régua estimada */}
      <div className="mb-6 flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: trilha ? total : 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= passo ? "bg-brand-green" : "bg-muted"}`}
          />
        ))}
      </div>

      {noNome ? (
        <>
          <h2 className="text-2xl">Como podemos te chamar?</h2>
          <form className="mt-6" onSubmit={concluir}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
                autoComplete="name"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="Telefone com DDD"
                required
                inputMode="numeric"
                autoComplete="tel"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={!nome.trim() || !telefoneValido(telefone)}
              className="mt-4 w-full rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              Concluir
            </button>
            <p className="mt-3 text-base text-muted-foreground">
              Usamos seu nome e telefone apenas para este atendimento.
            </p>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl">{etapa.titulo}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {etapa.opcoes.map((opcao) => (
              <button
                key={opcao.label}
                type="button"
                onClick={() => responder(etapa.id, opcao.label, opcao.trilha)}
                className="rounded-lg border-2 border-border bg-background px-4 py-4 text-left font-semibold transition-colors hover:border-primary hover:bg-realce"
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </>
      )}

      {passo > 0 && (
        <button
          type="button"
          onClick={() => setPasso((p) => p - 1)}
          className="mt-6 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Voltar
        </button>
      )}
    </div>
  );
}
