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

test.describe("navegação e SEO", () => {
  for (const rota of ROTAS) {
    test(`${rota} responde 200 com título e descrição próprios`, async ({ page }) => {
      const resposta = await page.goto(rota);
      expect(resposta?.status()).toBe(200);

      await expect(page).toHaveTitle(/Ortoative/);
      const descricao = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(descricao?.length ?? 0).toBeGreaterThan(50);
    });
  }

  /* Regressão real: o layout raiz declarava canonical "/", e todas as páginas
     apontavam para a home. O Google leria o site como duplicata da raiz. */
  test("cada rota declara a canônica dela mesma", async ({ page }) => {
    for (const rota of ROTAS) {
      await page.goto(rota);
      const canonica = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonica ?? "").pathname, `canônica de ${rota}`).toBe(rota);
    }
  });

  test("o menu leva a cada seção sem 404", async ({ page }) => {
    await page.goto("/");
    const destinos = await page
      .locator("header a[href^='/']")
      .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);

    expect(destinos.length).toBeGreaterThan(3);
    for (const destino of destinos) {
      const r = await page.goto(destino as string);
      expect(r?.status(), destino as string).toBe(200);
    }
  });

  test("o sitemap lista as rotas e o robots aponta para ele", async ({ page }) => {
    const sitemap = await (await page.request.get("/sitemap.xml")).text();
    for (const rota of ["/alinhadores", "/equipe", "/procedimentos"]) {
      expect(sitemap, `sitemap sem ${rota}`).toContain(rota);
    }

    const robots = await (await page.request.get("/robots.txt")).text();
    expect(robots.toLowerCase()).toContain("sitemap");
  });

  test("o cartão de compartilhamento usa formato que as redes leem", async ({ page }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    // AVIF aqui faria o link aparecer sem imagem no WhatsApp
    expect(og).toMatch(/\.(jpe?g|png)$/);

    /* A meta sai com o domínio de produção (metadataBase). O que interessa
       testar é que o arquivo existe, então buscamos pelo caminho. */
    const r = await page.request.get(new URL(og as string).pathname);
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain("image/");
  });
});
