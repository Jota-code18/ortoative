import { expect, test } from "@playwright/test";

/**
 * A página dos alinhadores é de conversão: existe para tirar dúvida e levar à
 * avaliação. O que estes testes travam é isso — que as interações respondam e
 * que o caminho até o agendamento não quebre.
 */
test.describe("página dos alinhadores", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/alinhadores");
  });

  test("as etapas trocam o conteúdo e a foto", async ({ page }) => {
    const bloco = page.locator("section", { hasText: "Como funciona, por etapa" });

    await expect(
      page.getByRole("heading", { name: "Sem massinha, sem enjoo" })
    ).toBeVisible();

    await bloco.getByRole("button", { name: /Fabricação/ }).click();

    await expect(
      page.getByRole("heading", { name: "Produzido aqui, não terceirizado" })
    ).toBeVisible();
    // a foto da etapa, não a do card de diferencial que tem alt parecido
    await expect(bloco.getByAltText(/Impressoras 3D/)).toBeVisible();
    await expect(bloco.getByRole("button", { name: /Escaneamento/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  test("cada caso devolve a resposta certa, inclusive quando é 'depende'", async ({
    page,
  }) => {
    const bloco = page.locator("section", { hasText: "Serve para o meu caso?" });

    await bloco.getByRole("button", { name: "Espaços entre os dentes" }).click();
    await expect(page.getByText("Caso típico de alinhador")).toBeVisible();

    /* O caso que precisa de avaliação é o que dá peso aos outros: se a página
       dissesse "sim" para tudo, o "sim" não valeria nada. */
    await bloco.getByRole("button", { name: "Minha gengiva sangra" }).click();
    await expect(page.getByText("Precisa de avaliação antes")).toBeVisible();
    await expect(page.getByText("Caso típico de alinhador")).toBeHidden();
  });

  test("a resposta do caso leva o assunto para o WhatsApp", async ({ page }) => {
    await page
      .locator("section", { hasText: "Serve para o meu caso?" })
      .getByRole("button", { name: "Usei aparelho e os dentes voltaram" })
      .click();

    const link = page
      .locator("section", { hasText: "Serve para o meu caso?" })
      .getByRole("link", { name: "Falar no WhatsApp" });
    const href = decodeURIComponent((await link.getAttribute("href")) ?? "");
    expect(href).toContain("wa.me");
    expect(href).toContain("usei aparelho");
  });

  test("as dúvidas abrem e fecham sem JavaScript de aplicação", async ({ page }) => {
    const duvida = page.locator("details", { hasText: "Dói?" }).first();

    // a resposta curta fica sempre à vista; a longa só ao abrir
    await expect(duvida.getByText("Aperta, não dói.")).toBeVisible();
    await expect(duvida.getByText(/Nos dois ou três primeiros dias/)).toBeHidden();

    await duvida.locator("summary").click();
    await expect(duvida.getByText(/Nos dois ou três primeiros dias/)).toBeVisible();
  });

  test("responde as dúvidas que fazem o paciente desistir", async ({ page }) => {
    /* Os concorrentes fogem de preço e de prazo. Se a página parar de
       responder, ela perde o motivo de existir. */
    for (const pergunta of [
      "Dói?",
      "Quanto custa?",
      "Quanto tempo demora?",
      "Posso comer de tudo?",
      "Aparece quando eu falo?",
    ]) {
      await expect(page.getByText(pergunta, { exact: true })).toBeVisible();
    }
  });

  test("há chamada para a avaliação no começo e no fim", async ({ page }) => {
    /* Assertiva no destino, não no rótulo: o texto do botão pode mudar, mas a
       página perde a razão de existir se parar de levar para a avaliação. */
    const paraAvaliacao = page.locator('a[href*="#avaliacao"]');
    expect(await paraAvaliacao.count()).toBeGreaterThanOrEqual(2);

    await expect(paraAvaliacao.first()).toBeVisible();
    await expect(paraAvaliacao.last()).toBeVisible();
  });

  test("carrega sem erro de console e sem imagem quebrada", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));

    await page.reload();
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((i) => {
        i.loading = "eager";
      });
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForLoadState("networkidle");

    const quebradas = await page.evaluate(() =>
      [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0 || !i.alt.trim())
        .map((i) => i.currentSrc || i.src)
    );

    expect(erros).toEqual([]);
    expect(quebradas).toEqual([]);
  });
});
