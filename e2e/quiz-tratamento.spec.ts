import { expect, type Page, test } from "@playwright/test";

/**
 * "Entenda qual o melhor para você" virou quiz. A tabela pedia leitura e
 * conclusão própria; o quiz pergunta e responde. Estes testes travam o que
 * justifica a troca: o visitante chega a uma sugestão, ela muda conforme as
 * respostas, e dali sai um lead para a recepção.
 */
const TITULO = "Entenda qual o melhor para você";

function quiz(page: Page) {
  return page.getByRole("region", { name: TITULO });
}

/**
 * O primeiro toque pode chegar antes da hidratação e se perder. Repete até a
 * régua sair de 1/7 — depois disso o React já está no comando.
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

/** Caminho que leva a alinhadores, do começo ao resultado. */
async function ateOResultado(page: Page) {
  await primeiraEscolha(page, "Tenho espaços entre eles");
  await responderAte(page, [
    "Faz muita diferença",
    "Falo com gente o tempo todo",
    "Topo, sou organizado",
    "Poucas vezes, moro longe ou tenho pouca agenda",
    "Sou adulto",
    "Ninguém perceber",
  ]);
}

test.describe("quiz de tratamento", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await quiz(page).scrollIntoViewIfNeeded();
  });

  test("entrega a sugestão antes de pedir o contato", async ({ page }) => {
    await ateOResultado(page);
    const bloco = quiz(page);

    /* A promessa do título é descobrir qual tratamento serve. Cobrar o
       telefone antes de cumprir isso é o que faz o visitante fechar a página —
       por isso o resultado e o formulário aparecem juntos. */
    await expect(bloco.getByText("Alinhadores Ortoative").first()).toBeVisible();
    await expect(bloco.getByPlaceholder("Seu nome")).toBeVisible();
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

  test("compara só os dois tratamentos", async ({ page }) => {
    // implante e lente são assunto da triagem do topo, não desta comparação
    const bloco = quiz(page);
    await ateOResultado(page);

    await expect(bloco.getByText("Implantes")).toHaveCount(0);
    await expect(bloco.getByText("Lentes e facetas")).toHaveCount(0);
  });

  test("manda o lead para a recepção e leva ao WhatsApp", async ({ page }) => {
    let enviado: Record<string, unknown> | null = null;
    await page.route("**/api/lead", async (rota) => {
      enviado = rota.request().postDataJSON();
      await rota.fulfill({ json: { ok: true, email: true } });
    });

    await ateOResultado(page);
    const bloco = quiz(page);

    await bloco.getByPlaceholder("Seu nome").fill("Ana Souza");
    await bloco.getByPlaceholder("Telefone com DDD").fill("62984983400");
    await bloco.getByRole("button", { name: /confirmação de um profissional/i }).click();

    await expect(bloco.getByText(/Tudo pronto/)).toBeVisible();

    /* Sem as respostas no corpo, a secretária refaz o quiz no atendimento. */
    expect(enviado).not.toBeNull();
    const corpo = enviado as unknown as {
      nome: string;
      detalhes: { pergunta: string; resposta: string }[];
      especialidade: string;
    };
    expect(corpo.nome).toBe("Ana Souza");
    expect(corpo.especialidade).toContain("Alinhadores");
    expect(corpo.detalhes.length).toBe(7);

    const whats = bloco.getByRole("link", { name: "Falar com um profissional" });
    expect(await whats.getAttribute("href")).toContain("Alinhadores");
  });

  test("o envio só libera com telefone válido", async ({ page }) => {
    await ateOResultado(page);
    const bloco = quiz(page);
    const enviar = bloco.getByRole("button", { name: /confirmação de um profissional/i });

    await expect(enviar).toBeDisabled();
    await bloco.getByPlaceholder("Seu nome").fill("Ana");
    await bloco.getByPlaceholder("Telefone com DDD").fill("6298");
    await expect(enviar).toBeDisabled();
    await bloco.getByPlaceholder("Telefone com DDD").fill("62984983400");
    await expect(enviar).toBeEnabled();
  });

  test("dá para voltar e trocar a resposta", async ({ page }) => {
    await primeiraEscolha(page, "Meus dentes são tortos");
    const bloco = quiz(page);

    await bloco.getByRole("button", { name: "← Voltar" }).click();
    await expect(bloco.getByRole("heading", { level: 3 })).toContainText(
      "Qual é a sua situação"
    );
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
