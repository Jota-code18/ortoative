import { expect, test } from "@playwright/test";

/**
 * A hero tem duas composições, uma por tamanho de tela. Estes testes travam o
 * que diferencia as duas — e, no celular, a regra que motivou a mudança: os
 * rostos não podem ficar atrás da Header.
 */
test.describe("hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("no celular só a foto da direita entra em cena", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "a composição é do celular");

    const esquerda = page.locator(".hero-curtain-left");
    await expect(esquerda).toBeHidden();

    const direita = page.locator(".hero-curtain-right");
    await expect(direita).toBeVisible();

    // ocupa a largura toda: no desktop ela divide a tela com a outra
    const largura = await direita.evaluate((e) => e.getBoundingClientRect().width);
    expect(largura).toBe(info.project.use.viewport?.width ?? largura);
  });

  test("no desktop as duas fotos continuam", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "a composição é do desktop");

    await expect(page.locator(".hero-curtain-left")).toBeVisible();
    await expect(page.locator(".hero-curtain-right")).toBeVisible();
  });

  test("os rostos não ficam atrás da Header no celular", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "a Header sobrepõe a hero no celular");

    /* Os rostos estão no terço de cima da foto. O que dá para verificar sem
       reconhecimento de imagem é a regra que os protege: o recorte começa
       abaixo do topo, deixando a faixa da Header sobre céu e folhagem. */
    const posicao = await page
      .locator(".hero-photo-right")
      .evaluate((e) => getComputedStyle(e).objectPosition);
    expect(posicao).toContain("18%");

    const header = await page
      .locator("header")
      .evaluate((e) => e.getBoundingClientRect().bottom);
    const logo = await page
      .locator(".hero-logo")
      .evaluate((e) => e.getBoundingClientRect().top);

    // sobra a faixa dos rostos entre a Header e a logo
    expect(logo - header).toBeGreaterThan(180);
  });

  test("a logo fica entre a foto e as frases", async ({ page }) => {
    const logo = await page
      .locator(".hero-logo")
      .evaluate((e) => e.getBoundingClientRect().bottom);
    const titulo = await page
      .locator("h1")
      .evaluate((e) => e.getBoundingClientRect().top);

    expect(titulo, "o texto não pode subir por cima da logo").toBeGreaterThan(logo);
  });

  test("existe um único model-viewer na página", async ({ page }) => {
    /* Duas composições, um GLB. Montar a hero duas vezes baixaria o runtime do
       model-viewer e o modelo em dobro, e o visitante pagaria pelo que não vê. */
    await expect(page.locator("model-viewer")).toHaveCount(1);
  });
});
