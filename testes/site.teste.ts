import { describe, expect, it } from "vitest";
import { nav, site, whatsappLink, whatsappMessages } from "@/lib/site";

describe("whatsappLink", () => {
  it("aponta para o número da clínica", () => {
    expect(whatsappLink("oi")).toBe(`https://wa.me/${site.whatsapp}?text=oi`);
  });

  it("codifica acento, espaço e emoji — o link é o caminho de conversão", () => {
    const url = whatsappLink("Olá! Quero avaliação — urgência 🦷");
    expect(url).not.toContain(" ");
    expect(decodeURIComponent(url.split("text=")[1])).toBe(
      "Olá! Quero avaliação — urgência 🦷"
    );
  });

  it("o número é só dígitos com DDI, no formato que o wa.me exige", () => {
    expect(site.whatsapp).toMatch(/^\d{12,13}$/);
    expect(site.whatsapp.startsWith("55")).toBe(true);
  });
});

describe("navegação", () => {
  it("nenhuma rota do menu se repete", () => {
    const hrefs = nav.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("existe exatamente uma chamada principal", () => {
    expect(nav.filter((i) => "cta" in i && i.cta)).toHaveLength(1);
  });

  it("toda mensagem pré-pronta de WhatsApp tem texto útil", () => {
    for (const [rota, msg] of Object.entries(whatsappMessages)) {
      expect(msg.length, rota).toBeGreaterThan(20);
    }
  });
});
