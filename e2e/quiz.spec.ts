import { expect, test } from "@playwright/test";

/**
 * A triagem é o caminho que transforma visita em contato. Se ela quebrar, o
 * site continua bonito e para de dar dinheiro — por isso o percurso inteiro
 * está aqui, e não só a renderização inicial.
 */
test.describe("triagem", () => {
  const opcoes = (page: import("@playwright/test").Page) =>
    page.locator("#avaliacao button").filter({ hasNot: page.locator("svg") });

  /**
   * Avança até o passo de contato.
   *
   * Espera o enunciado mudar entre um clique e o outro em vez de clicar em
   * sequência: o bloco do passo é remontado a cada resposta (é o que dispara a
   * animação de entrada), e sob carga o clique seguinte pegava o elemento
   * antigo, já descartado.
   */
  /**
   * Escolhe a queixa inicial e confirma que o quiz reagiu.
   *
   * O clique logo depois do `goto` pode chegar antes da hidratação: o botão já
   * está na tela, o Playwright o considera clicável, e o React ainda não
   * escuta. Localmente passa; sob carga paralela o clique se perde e todos os
   * testes seguintes falham por um motivo que não é o deles.
   */
  async function escolherQueixa(page: import("@playwright/test").Page, queixa: string) {
    const enunciado = page.locator("#avaliacao h2");
    await expect(enunciado).toHaveText("O que mais te incomoda hoje?");

    await expect
      .poll(
        async () => {
          /* Escopo no #avaliacao: a home tem um segundo quiz, e um seletor
             solto pode alcançar o outro. */
          await page.locator("#avaliacao").getByRole("button", { name: queixa }).click();
          return enunciado.innerText();
        },
        { timeout: 15_000, message: "o quiz não saiu da primeira pergunta" }
      )
      .not.toBe("O que mais te incomoda hoje?");
  }

  async function ateOContato(page: import("@playwright/test").Page) {
    const nome = page.getByPlaceholder("Seu nome");
    /* O contador "N/M" é o sinal confiável de que o passo avançou: o enunciado
       pode repetir entre trilhas, o número não. */
    const contador = page.locator("#avaliacao span").filter({ hasText: /^\d+\// });

    for (let i = 0; i < 12; i++) {
      if (await nome.isVisible()) return;
      const antes = await contador.innerText();
      await opcoes(page).first().click();
      await expect
        .poll(async () => ((await nome.isVisible()) ? "contato" : contador.innerText()), {
          timeout: 10_000,
        })
        .not.toBe(antes);
    }
    await expect(nome, "não chegou ao passo de contato").toBeVisible();
  }

  test("percorre uma trilha até o passo de contato", async ({ page }) => {
    await page.goto("/");
    await escolherQueixa(page, "Dentes tortos ou desalinhados");

    // avança escolhendo sempre a primeira opção até chegar no formulário
    await ateOContato(page);

    await expect(page.getByPlaceholder("Seu nome")).toBeVisible();
    await expect(page.getByPlaceholder("Telefone com DDD")).toBeVisible();
  });

  test("a queixa escolhida muda as perguntas seguintes", async ({ page }) => {
    await page.goto("/");
    await escolherQueixa(page, "Dentes tortos ou desalinhados");
    const orto = await page.locator("#avaliacao h2").innerText();

    await page.reload();
    await escolherQueixa(page, "Dor de dente");
    const dor = await page.locator("#avaliacao h2").innerText();

    expect(orto, "trilhas diferentes deveriam abrir perguntas diferentes").not.toBe(dor);
  });

  test("o botão de concluir só libera com telefone válido", async ({ page }) => {
    await page.goto("/");
    await escolherQueixa(page, "Dor de dente");
    await ateOContato(page);

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
    await escolherQueixa(page, "Dor de dente");
    await ateOContato(page);

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
    await escolherQueixa(page, "Dentes tortos ou desalinhados");
    await ateOContato(page);

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
    await escolherQueixa(page, "Dentes tortos ou desalinhados");
    const segunda = await page.locator("#avaliacao h2").innerText();

    await page.getByRole("button", { name: "← Voltar" }).click();
    await expect(page.locator("#avaliacao h2")).toHaveText(
      "O que mais te incomoda hoje?"
    );
    expect(segunda).not.toBe("O que mais te incomoda hoje?");
  });
});
