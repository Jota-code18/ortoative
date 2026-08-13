import { expect, test } from "@playwright/test";

/**
 * A triagem é o caminho que transforma visita em contato. Se ela quebrar, o
 * site continua bonito e para de dar dinheiro — por isso o percurso inteiro
 * está aqui, e não só a renderização inicial.
 */
test.describe("triagem", () => {
  const opcoes = (page: import("@playwright/test").Page) =>
    page.locator("#avaliacao button").filter({ hasNot: page.locator("svg") });

  test("percorre uma trilha até o passo de contato", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dentes tortos ou desalinhados" }).click();

    // avança escolhendo sempre a primeira opção até chegar no formulário
    for (let i = 0; i < 10; i++) {
      if (await page.getByPlaceholder("Seu nome").isVisible()) break;
      await opcoes(page).first().click();
    }

    await expect(page.getByPlaceholder("Seu nome")).toBeVisible();
    await expect(page.getByPlaceholder("Telefone com DDD")).toBeVisible();
  });

  test("a queixa escolhida muda as perguntas seguintes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dentes tortos ou desalinhados" }).click();
    const orto = await page.locator("#avaliacao h2").innerText();

    await page.reload();
    await page.getByRole("button", { name: "Dor de dente" }).click();
    const dor = await page.locator("#avaliacao h2").innerText();

    expect(orto, "trilhas diferentes deveriam abrir perguntas diferentes").not.toBe(dor);
  });

  test("o botão de concluir só libera com telefone válido", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dor de dente" }).click();
    for (let i = 0; i < 10; i++) {
      if (await page.getByPlaceholder("Seu nome").isVisible()) break;
      await opcoes(page).first().click();
    }

    const enviar = page.getByRole("button", { name: /Concluir|Enviando/ });
    await expect(enviar).toBeDisabled();

    await page.getByPlaceholder("Seu nome").fill("Maria Teste");
    await page.getByPlaceholder("Telefone com DDD").fill("6298");
    await expect(enviar, "telefone incompleto não pode liberar").toBeDisabled();

    await page.getByPlaceholder("Telefone com DDD").fill("62984983400");
    await expect(enviar).toBeEnabled();
  });

  test("o telefone ganha máscara enquanto é digitado", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dor de dente" }).click();
    for (let i = 0; i < 10; i++) {
      if (await page.getByPlaceholder("Seu nome").isVisible()) break;
      await opcoes(page).first().click();
    }

    const campo = page.getByPlaceholder("Telefone com DDD");
    await campo.fill("62984983400");
    await expect(campo).toHaveValue("(62) 98498-3400");
  });

  test("concluir dá retorno de envio e leva ao WhatsApp", async ({ page }) => {
    // A API responde 200 mesmo sem e-mail configurado; aqui só garantimos que
    // o teste não depende de rede externa.
    await page.route("**/api/lead", (rota) =>
      rota.fulfill({ status: 200, json: { ok: true, email: false } })
    );

    await page.goto("/");
    await page.getByRole("button", { name: "Dentes tortos ou desalinhados" }).click();
    for (let i = 0; i < 10; i++) {
      if (await page.getByPlaceholder("Seu nome").isVisible()) break;
      await opcoes(page).first().click();
    }

    await page.getByPlaceholder("Seu nome").fill("Maria Teste");
    await page.getByPlaceholder("Telefone com DDD").fill("62984983400");
    await page.getByRole("button", { name: "Concluir" }).click();

    await expect(page.getByText(/Tudo pronto/)).toBeVisible();

    const agendar = page.getByRole("link", { name: "Agendar agora" });
    await expect(agendar).toBeVisible();
    // o link precisa levar o nome do paciente para a secretária
    expect(decodeURIComponent((await agendar.getAttribute("href")) ?? "")).toContain(
      "Maria"
    );
  });

  test("dá para voltar e corrigir a resposta anterior", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dentes tortos ou desalinhados" }).click();
    const segunda = await page.locator("#avaliacao h2").innerText();

    await page.getByRole("button", { name: "← Voltar" }).click();
    await expect(page.locator("#avaliacao h2")).toHaveText(
      "O que mais te incomoda hoje?"
    );
    expect(segunda).not.toBe("O que mais te incomoda hoje?");
  });
});
