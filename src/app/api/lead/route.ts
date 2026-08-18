import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ehUrgencia,
  especialidadeSugerida,
  respostasDetalhadas,
  type TrilhaId,
} from "@/lib/quiz";

/**
 * Recebe o lead da triagem e avisa a recepção por e-mail.
 *
 * Sem RESEND_API_KEY configurada o endpoint registra no log e responde 200:
 * o paciente nunca deve travar por causa de e-mail — o WhatsApp continua
 * sendo o caminho principal.
 */

type Payload = {
  nome?: string;
  telefone?: string;
  trilha?: TrilhaId | null;
  respostas?: Record<string, string>;
  /**
   * Quem manda o lead. A triagem do topo tem trilhas e urgência; o quiz de
   * comparação, não — ele já chega com o resumo pronto nos campos abaixo.
   */
  origem?: string;
  /** pares pergunta/resposta prontos, quando a origem não usa `trilha` */
  detalhes?: { pergunta?: string; resposta?: string }[];
  /** encaminhamento sugerido pela própria origem */
  especialidade?: string;
};

/**
 * Lido dentro do handler, não no escopo do módulo.
 *
 * No escopo do módulo o valor congela na primeira avaliação — que em alguns
 * modos de empacotamento acontece no build, antes de a variável existir. O
 * sintoma seria o pior possível: a rota responde 200, o log não acusa nada, e
 * o e-mail simplesmente não sai.
 */
const configuracaoDeEmail = () => ({
  chave: process.env.RESEND_API_KEY,
  destino: process.env.LEAD_EMAIL_TO,
  remetente: process.env.LEAD_EMAIL_FROM ?? "Site Ortoative <onboarding@resend.dev>",
  responderPara: process.env.LEAD_EMAIL_REPLY_TO,
});

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "json inválido" }, { status: 400 });
  }

  const nome = (payload.nome ?? "").trim();
  const telefone = (payload.telefone ?? "").trim();
  const trilha = payload.trilha ?? null;
  const respostas = payload.respostas ?? {};

  if (!nome || !telefone) {
    return NextResponse.json(
      { ok: false, erro: "nome e telefone são obrigatórios" },
      { status: 400 }
    );
  }

  /* Detalhes prontos ganham do cálculo por trilha: o quiz de comparação não
     tem trilha, e `respostasDetalhadas` devolveria uma lista vazia — a
     secretária receberia nome e telefone sem nada do que a pessoa respondeu. */
  const prontos = (payload.detalhes ?? [])
    .map((d) => ({
      pergunta: (d.pergunta ?? "").trim(),
      resposta: (d.resposta ?? "").trim(),
    }))
    .filter((d) => d.pergunta && d.resposta);

  const urgente = ehUrgencia(trilha, respostas);
  const detalhes = prontos.length ? prontos : respostasDetalhadas(trilha, respostas);
  const especialidade = payload.especialidade?.trim() || especialidadeSugerida(trilha);
  const assunto = `${urgente ? "[URGÊNCIA] " : ""}Novo lead do site: ${nome} — ${especialidade}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;color:#111">
      <h2 style="color:#003399;margin:0 0 4px">Nova avaliação pelo site</h2>
      ${urgente ? '<p style="color:#b91c1c;font-weight:700;margin:0 0 12px">Caso com dor/urgência — priorizar retorno</p>' : ""}
      <p style="margin:0 0 16px">
        <strong>Nome:</strong> ${escapar(nome)}<br>
        <strong>Telefone:</strong> ${escapar(telefone)}<br>
        <strong>Encaminhamento sugerido:</strong> ${escapar(especialidade)}${
          payload.origem ? `<br><strong>Origem:</strong> ${escapar(payload.origem)}` : ""
        }
      </p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:640px">
        ${detalhes
          .map(
            (d, i) => `<tr style="background:${i % 2 ? "#f5f7fb" : "#fff"}">
              <td style="border:1px solid #e3e8f0;width:52%">${escapar(d.pergunta)}</td>
              <td style="border:1px solid #e3e8f0;font-weight:600">${escapar(d.resposta)}</td>
            </tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:16px">
        <a href="https://wa.me/55${somenteDigitos(telefone)}" style="color:#00B099;font-weight:700">
          Chamar ${escapar(nome)} no WhatsApp
        </a>
      </p>
    </div>`;

  const { chave, destino, remetente, responderPara } = configuracaoDeEmail();

  if (!chave || !destino) {
    console.warn("[lead] e-mail não configurado; lead recebido:", {
      nome,
      telefone,
      especialidade,
      urgente,
    });
    return NextResponse.json({ ok: true, email: false });
  }

  try {
    const resend = new Resend(chave);
    const { error } = await resend.emails.send({
      from: remetente,
      to: destino.split(",").map((e) => e.trim()),
      subject: assunto,
      html,
      replyTo: responderPara,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, email: true });
  } catch (erro) {
    console.error("[lead] falha ao enviar e-mail:", erro);
    // O paciente segue para o WhatsApp mesmo assim
    return NextResponse.json({ ok: true, email: false });
  }
}

function escapar(texto: string) {
  return texto.replace(/[<>&"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : "&quot;"
  );
}

function somenteDigitos(texto: string) {
  return texto.replace(/\D/g, "");
}
