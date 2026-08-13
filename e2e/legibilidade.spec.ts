import { expect, test } from "@playwright/test";

const ROTAS = [
  "/",
  "/alinhadores",
  "/equipe",
  "/tecnologia",
  "/para-dentistas",
  "/procedimentos",
  "/procedimentos/implantes",
  "/agende",
  "/blog",
  "/privacidade",
];

/** Piso acertado com o cliente: nada abaixo disso, em nenhuma tela. */
const MINIMO_PX = 14;

/**
 * Trava de regressão. O site já teve rótulos de 11px e 12px espalhados, vários
 * deles combinados com pouco contraste. Foram corrigidos um a um; sem teste,
 * o próximo componente traz o problema de volta sem ninguém perceber.
 */
test.describe("legibilidade", () => {
  for (const rota of ROTAS) {
    test(`nenhum texto abaixo de ${MINIMO_PX}px em ${rota}`, async ({ page }) => {
      await page.goto(rota);
      await page.waitForLoadState("networkidle");

      const pequenos = await page.evaluate((minimo) => {
        const achados: { px: number; texto: string; classe: string }[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("body *")) {
          const temTextoProprio = [...el.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 1
          );
          if (!temTextoProprio) continue;

          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden") continue;
          // texto só para leitor de tela não é lido com os olhos
          if (el.classList.contains("sr-only")) continue;

          const px = Number.parseFloat(s.fontSize);
          if (px < minimo) {
            achados.push({
              px,
              texto: (el.textContent ?? "").trim().slice(0, 40),
              classe: el.className.toString().slice(0, 60),
            });
          }
        }
        return achados;
      }, MINIMO_PX);

      expect(pequenos).toEqual([]);
    });
  }

  test("a página não rola para o lado no celular", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "só faz sentido no celular");

    for (const rota of ROTAS) {
      await page.goto(rota);
      const { doc, janela } = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        janela: window.innerWidth,
      }));
      expect(doc, `${rota} transborda na horizontal`).toBeLessThanOrEqual(janela);
    }
  });
});
