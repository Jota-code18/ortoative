import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("carrega sem erro no console e sem requisição quebrada", async ({ page }) => {
    const erros: string[] = [];
    const quebradas: string[] = [];

    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    page.on("response", (r) => {
      if (r.status() >= 400) quebradas.push(`${r.status()} ${r.url()}`);
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(erros, "erros de console").toEqual([]);
    expect(quebradas, "requisições com falha").toEqual([]);
  });

  test("tem exatamente um h1 e a hierarquia de títulos não pula nível", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);

    const niveis = await page
      .locator("h1, h2, h3, h4")
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));

    for (let i = 1; i < niveis.length; i++) {
      expect(
        niveis[i] - niveis[i - 1],
        `salto de h${niveis[i - 1]} para h${niveis[i]}`
      ).toBeLessThanOrEqual(1);
    }
  });

  test("toda imagem carrega e tem texto alternativo", async ({ page }) => {
    await page.goto("/");
    // tira o lazy do caminho e força a página inteira a resolver
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForLoadState("networkidle");

    const problemas = await page.evaluate(() =>
      [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0 || !i.alt.trim())
        .map((i) => `${i.currentSrc || i.src} (alt: "${i.alt}")`)
    );
    expect(problemas).toEqual([]);
  });

  test("as duas unidades aparecem com endereço no rodapé", async ({ page }) => {
    await page.goto("/");
    const rodape = page.locator("footer");

    await expect(rodape).toContainText("Anápolis");
    await expect(rodape).toContainText("Rua Francisco da Luz Bastos, 150");
    await expect(rodape).toContainText("Goianésia");
    await expect(rodape).toContainText("Av. Goiás, 1231");
  });

  test("o JSON-LD declara as duas unidades com endereço", async ({ page }) => {
    await page.goto("/");
    const bruto = await page.locator('script[type="application/ld+json"]').first().textContent();
    const dados = JSON.parse(bruto ?? "{}");

    const clinica = dados["@graph"].find((n: { "@type": string | string[] }) =>
      String(n["@type"]).includes("Dentist")
    );
    const unidades = clinica.subOrganization;

    expect(unidades).toHaveLength(2);
    for (const u of unidades) {
      expect(u.address.streetAddress, u.name).toBeTruthy();
      expect(u.address.addressLocality, u.name).toBeTruthy();
      expect(u.address.addressRegion, u.name).toBe("GO");
    }
  });
});
