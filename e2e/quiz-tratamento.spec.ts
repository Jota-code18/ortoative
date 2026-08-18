import { expect, type Page, test } from "@playwright/test";

/**
 * "Entenda qual o melhor para você" virou quiz. A tabela pedia leitura e
 * conclusão própria; o quiz pergunta e responde. Estes testes travam o que
 * justifica a troca: o visitante chega a uma sugestão, ela muda conforme as
 * respostas, e o caminho é curto o bastante para ele terminar.
 */
const TITULO = "Entenda qual o melhor para você";

function quiz(page: Page) {
  return page.getByRole("region", { name: TITULO });
}

/**
 * O primeiro toque pode chegar antes da hidratação e se perder. Repete até a
 * pergunta mudar — depois disso o React já está no comando.
 */
async function primeiraEscolha(page: Page, label: string) {
  const bloco = quiz(page);
  await expect(async () => {
    await bloco
      .getByRole("button", { name: label, exact: true })
      .click({ timeout: 2000 });
    await expect(bloco.getByText("2/", { exact: false })).toBeVisible({
      timeout: 1000,
    });
  }).toPass({ timeout: 15000 });
}

/**
 * Responde a sequência inteira, esperando o passo avançar entre um clique e o
 * outro. O bloco da pergunta é remontado a cada resposta (é o que dispara a
 * animação de entrada); em carga fria o clique seguinte pegava o botão antigo,
 * já descartado, e o quiz parava no meio sem erro nenhum.
 */
async function responderAte(page: Page, escolhas: string[]) {
  const bloco = quiz(page);
  const enunciado = bloco.getByRole("heading", { level: 3 });

  for (const label of escolhas) {
    const antes = await enunciado.innerText();
    await bloco.getByRole("button", { name: label, exact: true }).click();
    await expect
      .poll(async () =>
        // na última resposta o enunciado some e entra o resultado
        (await enunciado.count()) === 0 ? "resultado" : enunciado.innerText()
      )
      .not.toBe(antes);
  }
}

test.describe("quiz de tratamento", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await quiz(page).scrollIntoViewIfNeeded();
  });

  test("entrega uma sugestão e convida para falar com um profissional", async ({
    page,
  }) => {
    await primeiraEscolha(page, "Meus dentes são tortos");
    await responderAte(page, [
      "Faz muita diferença",
      "Falo com gente o tempo todo",
      "Topo, sou organizado",
      "Poucas vezes, moro longe ou tenho pouca agenda",
      "Sou adulto",
      "Ninguém perceber",
    ]);

    const bloco = quiz(page);
    await expect(bloco.getByText("Pelas suas respostas")).toBeVisible();
    await expect(bloco.getByText("Alinhadores Ortoative").first()).toBeVisible();

    /* O resultado sem convite seria só uma curiosidade: o objetivo da seção é
       levar ao profissional, e o link precisa carregar as respostas. */
    const whats = bloco.getByRole("link", { name: "Falar com um profissional" });
    await expect(whats).toBeVisible();
    expect(await whats.getAttribute("href")).toContain("Alinhadores");
  });

  test("a sugestão muda conforme as respostas", async ({ page }) => {
    await primeiraEscolha(page, "Minha mordida não encaixa");
    await responderAte(page, [
      "Não faz diferença",
      "Rotina tranquila, sem essa preocupação",
      "Prefiro que não dependa de mim",
      "Sem problema, moro perto",
      "Criança ou adolescente",
      "O menor custo",
    ]);

    await expect(quiz(page).getByText("Ortodontia Fixa").first()).toBeVisible();
  });

  test("queixa de dente faltando não pergunta sobre disciplina de placa", async ({
    page,
  }) => {
    await primeiraEscolha(page, "Perdi um ou mais dentes");
    await responderAte(page, [
      "Faz mais de um ano",
      "Estão alinhados",
      "Não uso prótese nenhuma",
    ]);

    const bloco = quiz(page);
    await expect(bloco.getByText("Implantes").first()).toBeVisible();
    await expect(bloco.getByText("22 horas por dia")).toHaveCount(0);
  });

  test("dá para voltar e trocar a resposta", async ({ page }) => {
    await primeiraEscolha(page, "Meus dentes são tortos");
    const bloco = quiz(page);

    await bloco.getByRole("button", { name: "← Voltar" }).click();
    await expect(bloco.getByRole("heading", { level: 3 })).toContainText(
      "Qual é a sua situação"
    );
    // voltar da primeira também desfaz a trilha, então a régua volta ao começo
    await expect(bloco.getByText("1/", { exact: false })).toBeVisible();
  });

  test("cabe numa tela de celular", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "a restrição é do celular");

    /* O quiz só é respondido até o fim se cada pergunta aparecer inteira. Se
       voltar a passar da tela, o visitante rola para achar as opções e
       desiste no meio. */
    const altura = await quiz(page).evaluate((e) => e.getBoundingClientRect().height);
    const tela = page.viewportSize()?.height ?? 0;
    expect(altura).toBeLessThan(tela);
  });

  test("as opções são alvos de toque confortáveis", async ({ page }) => {
    const opcoes = quiz(page).getByRole("button");
    const alturas = await opcoes.evaluateAll((els) =>
      els.map((e) => e.getBoundingClientRect().height)
    );

    expect(alturas.length).toBeGreaterThan(0);
    for (const h of alturas) expect(h).toBeGreaterThanOrEqual(44);
  });
});
