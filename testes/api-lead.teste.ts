import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Espião no Resend, para nenhum teste mandar e-mail de verdade. */
const enviar = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: enviar };
  },
}));

const { POST } = await import("@/app/api/lead/route");

const pedido = (corpo: unknown) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });

const lead = {
  nome: "Maria Souza",
  telefone: "(62) 98498-3400",
  trilha: "ortodontia",
  respostas: { orto_historico: "Nunca usei" },
};

describe("POST /api/lead", () => {
  beforeEach(() => {
    enviar.mockReset().mockResolvedValue({ error: null });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("recusa corpo que não é JSON", async () => {
    const r = await POST(pedido("isso não é json"));
    expect(r.status).toBe(400);
  });

  it("exige nome e telefone", async () => {
    expect((await POST(pedido({ nome: "", telefone: "" }))).status).toBe(400);
    expect((await POST(pedido({ nome: "Maria" }))).status).toBe(400);
    expect((await POST(pedido({ telefone: "62984983400" }))).status).toBe(400);
  });

  it("sem chave configurada, responde 200 e não tenta enviar", async () => {
    // Regra do projeto: e-mail é aviso interno. O paciente nunca trava por ele.
    vi.stubEnv("RESEND_API_KEY", "");
    const r = await POST(pedido(lead));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ ok: true, email: false });
    expect(enviar).not.toHaveBeenCalled();
  });

  it("com chave configurada, envia para a recepção", async () => {
    vi.stubEnv("RESEND_API_KEY", "chave-de-teste");
    vi.stubEnv("LEAD_EMAIL_TO", "recepcao@ortoative.com.br");

    const r = await POST(pedido(lead));
    await expect(r.json()).resolves.toMatchObject({ ok: true, email: true });

    const enviado = enviar.mock.calls[0][0];
    expect(enviado.to).toEqual(["recepcao@ortoative.com.br"]);
    expect(enviado.subject).toContain("Maria Souza");
    expect(enviado.html).toContain("Nunca usei");
    // link direto para a secretária responder pelo WhatsApp
    expect(enviado.html).toContain("wa.me/5562984983400");
  });

  it("aceita mais de um destinatário separado por vírgula", async () => {
    vi.stubEnv("RESEND_API_KEY", "chave-de-teste");
    vi.stubEnv("LEAD_EMAIL_TO", "a@x.com, b@x.com");

    await POST(pedido(lead));
    expect(enviar.mock.calls[0][0].to).toEqual(["a@x.com", "b@x.com"]);
  });

  it("marca urgência no assunto quando a queixa é dor", async () => {
    vi.stubEnv("RESEND_API_KEY", "chave-de-teste");
    vi.stubEnv("LEAD_EMAIL_TO", "recepcao@ortoative.com.br");

    await POST(pedido({ ...lead, trilha: "dor", respostas: {} }));
    expect(enviar.mock.calls[0][0].subject).toContain("[URGÊNCIA]");
  });

  it("escapa HTML vindo do formulário", async () => {
    vi.stubEnv("RESEND_API_KEY", "chave-de-teste");
    vi.stubEnv("LEAD_EMAIL_TO", "recepcao@ortoative.com.br");

    await POST(pedido({ ...lead, nome: '<script>alert("x")</script>' }));
    const html = enviar.mock.calls[0][0].html;
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("falha no envio ainda responde 200 — o WhatsApp segue disponível", async () => {
    vi.stubEnv("RESEND_API_KEY", "chave-de-teste");
    vi.stubEnv("LEAD_EMAIL_TO", "recepcao@ortoative.com.br");
    enviar.mockResolvedValue({ error: { message: "cota estourada" } });

    const r = await POST(pedido(lead));
    expect(r.status).toBe(200);
    await expect(r.json()).resolves.toMatchObject({ ok: true, email: false });
  });
});
