import { expect, test } from "@playwright/test";

/**
 * O comparativo existe para o visitante decidir entre os dois tratamentos.
 * Ele só cumpre isso se as duas colunas aparecerem ao mesmo tempo e couberem
 * numa olhada — foi o que motivou a reformulação.
 */
test.describe("comparativo de tratamentos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("table").first().scrollIntoViewIfNeeded();
  });

  test("mostra os dois tratamentos ao mesmo tempo", async ({ page }) => {
    const cabecalho = page.locator("table thead th");
    await expect(cabecalho.filter({ hasText: "Alinhadores" })).toBeVisible();
    await expect(cabecalho.filter({ hasText: "Ortodontia Fixa" })).toBeVisible();
  });

  test("cabe numa tela de celular", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "a restrição é do celular");

    const medida = await page.evaluate(() => {
      const tabela = document.querySelector("table") as HTMLElement;
      const titulo = [...document.querySelectorAll("h2")].find((h) =>
        h.textContent?.includes("Entenda qual")
      ) as HTMLElement;
      return {
        altura:
          tabela.getBoundingClientRect().bottom - titulo.getBoundingClientRect().top,
        tela: window.innerHeight,
      };
    });

    /* Todo o bloco — título e tabela — precisa caber sem rolar. Se voltar a
       passar disso, o visitante deixa de ver a comparação de uma vez, que é a
       única razão de ela existir. */
    expect(medida.altura).toBeLessThan(medida.tela);
  });

  test("nenhuma coluna ganha tudo", async ({ page }) => {
    /* A Ortoative faz os dois tratamentos, e mais de 20.000 sorrisos da casa
       vieram do aparelho fixo. Tabela em que um lado vence todas as linhas
       ensina o paciente a desconfiar dela. */
    const vitorias = await page.evaluate(() => {
      const linhas = [...document.querySelectorAll("table tbody tr")];
      const contar = (coluna: number) =>
        linhas.filter((l) => {
          const celulas = l.querySelectorAll("td");
          const eu = celulas[coluna].textContent ?? "";
          const outro = celulas[1 - coluna].textContent ?? "";
          return eu.includes("sim") && !outro.includes("sim");
        }).length;
      return { alinhador: contar(0), fixo: contar(1) };
    });

    expect(vitorias.alinhador).toBeGreaterThan(0);
    expect(vitorias.fixo).toBeGreaterThan(0);
  });

  test("cada resposta é legível por leitor de tela, não só pelo símbolo", async ({
    page,
  }) => {
    // marca sozinha não comunica nada a quem não enxerga
    const primeira = page.locator("table tbody tr").first().locator("td").first();
    await expect(primeira).toContainText(/sim|não|em parte/);
  });

  test('"Melhor para" saiu da tabela e virou seção própria', async ({ page }) => {
    const tabela = page.locator("table").first();
    await expect(tabela).not.toContainText("Melhor para");

    const secao = page.getByText("Melhor para", { exact: true });
    expect(await secao.count()).toBe(2);
  });

  test("os cards do carrossel não repetem mais a lista de vantagens", async ({
    page,
  }) => {
    // os itens viraram linhas do comparativo; duplicá-los seria ruído
    const carrossel = page.getByRole("region", { name: "Alinhadores e Ortodontia Fixa" });
    await expect(carrossel.locator("ul")).toHaveCount(0);
  });
});
