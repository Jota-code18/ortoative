import { afterEach, describe, expect, it, vi } from "vitest";
import { enviarLead, formatarTelefone, telefoneValido } from "@/lib/lead";

describe("formatarTelefone", () => {
  it("aplica a máscara conforme os dígitos entram", () => {
    expect(formatarTelefone("6")).toBe("6");
    expect(formatarTelefone("62")).toBe("62");
    expect(formatarTelefone("6298")).toBe("(62) 98");
    expect(formatarTelefone("6298498")).toBe("(62) 9849-8");
    expect(formatarTelefone("62984983400")).toBe("(62) 98498-3400");
  });

  it("aceita fixo de 10 dígitos com a máscara curta", () => {
    expect(formatarTelefone("6232345678")).toBe("(62) 3234-5678");
  });

  it("descarta o que não é dígito, então colar de outro lugar funciona", () => {
    expect(formatarTelefone("+55 (62) 98498-3400")).toBe("(55) 62984-9834");
    expect(formatarTelefone("62 98498 3400")).toBe("(62) 98498-3400");
  });

  it("corta o excedente em 11 dígitos", () => {
    expect(formatarTelefone("629849834009999")).toBe("(62) 98498-3400");
  });

  it("é estável: reaplicar a máscara não muda o resultado", () => {
    // O campo chama a função a cada tecla sobre o valor já formatado.
    const uma = formatarTelefone("62984983400");
    expect(formatarTelefone(uma)).toBe(uma);
  });
});

describe("telefoneValido", () => {
  it("aceita 10 e 11 dígitos", () => {
    expect(telefoneValido("(62) 3234-5678")).toBe(true);
    expect(telefoneValido("(62) 98498-3400")).toBe(true);
  });

  it("recusa incompleto e excedente", () => {
    expect(telefoneValido("(62) 9849")).toBe(false);
    expect(telefoneValido("629849834001")).toBe(false);
    expect(telefoneValido("")).toBe(false);
  });
});

describe("enviarLead", () => {
  afterEach(() => vi.unstubAllGlobals());

  const dados = { nome: "Maria", telefone: "(62) 98498-3400", trilha: null, respostas: {} };

  it("manda o lead como JSON para /api/lead", async () => {
    const fetchFalso = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchFalso);

    await expect(enviarLead(dados)).resolves.toBe(true);

    const [url, opcoes] = fetchFalso.mock.calls[0];
    expect(url).toBe("/api/lead");
    expect(opcoes.method).toBe("POST");
    expect(JSON.parse(opcoes.body)).toMatchObject({ nome: "Maria" });
  });

  it("não lança quando a rede cai — o paciente não pode travar por isso", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(enviarLead(dados)).resolves.toBe(false);
  });

  it("devolve false quando a API responde erro", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(enviarLead(dados)).resolves.toBe(false);
  });
});
