import type { TrilhaId } from "@/lib/quiz";

/** Máscara (62) 98498-3400 conforme o usuário digita */
export function formatarTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** DDD + 8 ou 9 dígitos */
export function telefoneValido(valor: string) {
  const d = valor.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
}

/**
 * Avisa a recepção por e-mail. Falha aqui não pode interromper o paciente —
 * o WhatsApp segue como caminho principal.
 *
 * Devolve se deu certo para a tela poder dar retorno, mas nunca lança: quem
 * chama decide o que fazer, e a resposta padrão é seguir em frente.
 */
export async function enviarLead(dados: {
  nome: string;
  telefone: string;
  trilha: TrilhaId | null;
  respostas: Record<string, string>;
  /** de onde veio o lead — aparece no e-mail da recepção */
  origem?: string;
  /** resumo pronto, para origens que não têm trilha */
  detalhes?: { pergunta: string; resposta: string }[];
  especialidade?: string;
}): Promise<boolean> {
  try {
    const r = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return r.ok;
  } catch (erro) {
    console.error("[lead] não foi possível avisar a recepção:", erro);
    return false;
  }
}
