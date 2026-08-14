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
    /* Nada de `networkidle`: os vídeos dos passeios seguram a rede aberta.
       O sinal do que este teste mede é o h1 estar na tela, e ele já está. */
    await page.waitForTimeout(1500);

    expect(erros, "erros de console").toEqual([]);
    expect(quebradas, "requisições com falha").toEqual([]);
  });

  test("tem exatamente um h1 e a hierarquia de títulos não pula nível", async ({
    page,
  }) => {
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
    /* Mede defeito, não lentidão.
     *
     * A versão anterior forçava as 33 imagens da home a baixar de uma vez e
     * esperava todas terminarem — primeiro com `networkidle`, que os vídeos em
     * laço impedem de disparar, depois com uma espera pelo decode. As duas
     * passavam aqui e estouravam o tempo no CI, onde a banda é dividida.
     *
     * O que o teste promete é outra coisa: nenhuma imagem quebrada e nenhuma
     * sem texto alternativo. Resposta com erro e alt vazio são verificáveis
     * sem esperar o download inteiro. */
    const respostasComErro: string[] = [];
    page.on("response", (r) => {
      const tipo = r.request().resourceType();
      if (tipo === "image" && r.status() >= 400) {
        respostasComErro.push(`${r.status()} ${r.url()}`);
      }
    });

    await page.goto("/");
    // rola a página inteira para o lazy loading disparar todas as requisições
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(2000);

    const semAlt = await page.evaluate(() =>
      [...document.images].filter((i) => !i.alt.trim()).map((i) => i.src)
    );
    /* Entre as que já terminaram, nenhuma pode ter decodificado vazia — é
       assim que imagem corrompida ou formato não suportado aparece. */
    const decodeVazio = await page.evaluate(() =>
      [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)
    );

    expect(respostasComErro, "requisições de imagem com erro").toEqual([]);
    expect(semAlt, "imagens sem texto alternativo").toEqual([]);
    expect(decodeVazio, "imagens que não decodificaram").toEqual([]);
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
    const bruto = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
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
