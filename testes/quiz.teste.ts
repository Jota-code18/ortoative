import { describe, expect, it } from "vitest";
import {
  ehUrgencia,
  especialidadeSugerida,
  etapaInicial,
  montarMensagem,
  montarSequencia,
  respostasDetalhadas,
  type TrilhaId,
  trilhas,
} from "@/lib/quiz";

const TODAS = Object.keys(trilhas) as TrilhaId[];

describe("montarSequencia", () => {
  it("sem trilha escolhida, entrega só a porta de entrada e as etapas comuns", () => {
    const s = montarSequencia(null);
    expect(s[0]).toBe(etapaInicial);
    expect(s.every((e) => e.id !== "orto_historico")).toBe(true);
  });

  it("com trilha, insere as perguntas dela entre a entrada e as comuns", () => {
    const s = montarSequencia("ortodontia");
    expect(s[0]).toBe(etapaInicial);
    expect(s.map((e) => e.id)).toContain("orto_historico");
  });

  it.each(TODAS)("a trilha %s nunca repete id de etapa", (trilha) => {
    const ids = montarSequencia(trilha).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(TODAS)("a trilha %s só traz etapas com pelo menos duas opções", (trilha) => {
    for (const etapa of montarSequencia(trilha)) {
      expect(etapa.opcoes.length, `etapa ${etapa.id}`).toBeGreaterThan(1);
    }
  });
});

describe("porta de entrada", () => {
  it("toda queixa leva a uma trilha que existe", () => {
    for (const opcao of etapaInicial.opcoes) {
      expect(opcao.trilha, `queixa "${opcao.label}"`).toBeDefined();
      expect(TODAS).toContain(opcao.trilha as TrilhaId);
    }
  });

  it("toda trilha é alcançável por alguma queixa", () => {
    const alcancadas = new Set(etapaInicial.opcoes.map((o) => o.trilha));
    for (const trilha of TODAS) {
      expect(alcancadas, `trilha ${trilha} é inalcançável`).toContain(trilha);
    }
  });
});

describe("ehUrgencia", () => {
  it("dor é sempre urgência", () => {
    expect(ehUrgencia("dor", {})).toBe(true);
  });

  it("cirurgia só é urgência com sintoma forte", () => {
    expect(ehUrgencia("cirurgia", { cir_sintoma: "Sim, bastante" })).toBe(true);
    expect(ehUrgencia("cirurgia", { cir_sintoma: "Não" })).toBe(false);
    expect(ehUrgencia("cirurgia", {})).toBe(false);
  });

  it("gengiva só é urgência com dente amolecido", () => {
    expect(ehUrgencia("gengiva", { geng_sinal: "Dente amolecido" })).toBe(true);
    expect(ehUrgencia("gengiva", { geng_sinal: "Sangramento" })).toBe(false);
  });

  it("sem trilha não é urgência", () => {
    expect(ehUrgencia(null, {})).toBe(false);
  });

  it("as respostas que marcam urgência existem de fato nas opções da trilha", () => {
    // Blinda contra o erro silencioso: mudar o texto de uma opção sem mudar a
    // comparação faria a triagem parar de sinalizar urgência, sem quebrar nada.
    const opcoes = (trilha: TrilhaId, id: string) =>
      montarSequencia(trilha)
        .find((e) => e.id === id)
        ?.opcoes.map((o) => o.label) ?? [];

    expect(opcoes("cirurgia", "cir_sintoma")).toContain("Sim, bastante");
    expect(opcoes("gengiva", "geng_sinal")).toContain("Dente amolecido");
  });
});

describe("especialidadeSugerida", () => {
  it.each(TODAS)("a trilha %s tem especialidade definida", (trilha) => {
    const e = especialidadeSugerida(trilha);
    expect(e).toBeTruthy();
    expect(e).not.toBe("A definir na triagem");
  });

  it("sem trilha, deixa a definição para a triagem humana", () => {
    expect(especialidadeSugerida(null)).toBe("A definir na triagem");
  });
});

describe("respostasDetalhadas", () => {
  it("casa cada resposta com o título da pergunta", () => {
    const d = respostasDetalhadas("ortodontia", { orto_historico: "Nunca usei" });
    expect(d).toContainEqual({
      pergunta: "Já usou aparelho alguma vez?",
      resposta: "Nunca usei",
    });
  });

  it("ignora resposta de pergunta que não pertence à trilha", () => {
    // Sem isso, trocar de queixa no meio do quiz vazaria a resposta antiga
    // para o e-mail da secretária.
    const d = respostasDetalhadas("dor", { orto_historico: "Nunca usei" });
    expect(d.map((r) => r.resposta)).not.toContain("Nunca usei");
  });

  it("não inclui pergunta que ficou sem resposta", () => {
    const d = respostasDetalhadas("ortodontia", {});
    expect(d).toEqual([]);
  });
});

describe("montarMensagem", () => {
  it("leva nome, especialidade e as respostas para a secretária", () => {
    const m = montarMensagem("Maria", "ortodontia", { orto_historico: "Nunca usei" });
    expect(m).toContain("Maria");
    expect(m).toContain("Nunca usei");
  });

  it("marca urgência quando a trilha é dor", () => {
    const m = montarMensagem("João", "dor", {}).toUpperCase();
    expect(m).toContain("URGÊNCIA");
  });

  it("funciona sem nome — o paciente pode pular o campo", () => {
    expect(() => montarMensagem("", null, {})).not.toThrow();
  });
});
