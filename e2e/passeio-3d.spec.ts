import { expect, test } from "@playwright/test";

/**
 * Regressão do travamento no celular.
 *
 * O cliente reportou que a página recarregava sozinha ao chegar no passeio de
 * Goianésia — assinatura de o sistema ter matado a aba por memória. A causa
 * eram os dois passeios vivos ao mesmo tempo, somando mais de 290 MB de
 * textura em memória de vídeo.
 *
 * Estes testes travam as duas metades da correção: textura menor no arquivo, e
 * um contexto WebGL por vez em tempo de execução.
 */

/** Rola até o bloco e espera a cena montar (o three chama setSize no canvas). */
async function abrirPasseio(page: import("@playwright/test").Page, unidade: string) {
  const bloco = page.getByRole("img", { name: `Passeio 3D pela unidade de ${unidade}` });
  await bloco.scrollIntoViewIfNeeded();

  const canvas = bloco.locator("canvas");
  await expect
    .poll(async () => canvas.evaluate((c: HTMLCanvasElement) => c.width), {
      timeout: 60_000,
      message: `a cena de ${unidade} não montou`,
    })
    .toBeGreaterThan(300);

  return bloco;
}

test.describe("passeio 3D", () => {
  /* Baixar o modelo, decodificar Draco e montar a cena leva dezenas de
     segundos numa máquina de CI. O padrão de 30s reprovaria por lentidão, não
     por defeito. */
  test.setTimeout(150_000);

  test("as duas unidades montam a cena quando alcançadas", async ({ page }) => {
    await page.goto("/");
    await abrirPasseio(page, "Anápolis");
    await abrirPasseio(page, "Goianésia");
  });

  test("só um passeio mantém cena montada por vez", async ({ page }) => {
    await page.goto("/");
    await abrirPasseio(page, "Anápolis");
    await abrirPasseio(page, "Goianésia");

    /* O esqueleto de volta é a prova de que a cena foi solta: quem tem cena
       montada não mostra esqueleto. Contar contexto WebGL direto do navegador
       não serve — perguntar por `getContext` cria o contexto que se quer
       medir, e `forceContextLoss` avisa por evento assíncrono. */
    const comCena = await page.evaluate(
      () =>
        [...document.querySelectorAll('[role="img"][aria-label*="Passeio 3D"]')].filter(
          (b) => !b.querySelector(".esqueleto")
        ).length
    );

    expect(comCena, "duas cenas montadas derrubam a aba no celular").toBe(1);

    // e a que ficou é a que está na tela
    const goianesia = page.getByRole("img", {
      name: "Passeio 3D pela unidade de Goianésia",
    });
    await expect(goianesia.locator(".esqueleto")).toHaveCount(0);
  });

  test("o passeio de Goianésia não é desproporcional ao de Anápolis", async ({
    request,
  }) => {
    // O modelo maior é o que travava. Não deve voltar a crescer sem querer.
    const tamanho = async (url: string) =>
      Number((await request.head(url)).headers()["content-length"] ?? 0);

    const anapolis = await tamanho("/models/clinica.glb");
    const goianesia = await tamanho("/models/clinicagoianesia.glb");

    expect(anapolis).toBeGreaterThan(0);
    expect(goianesia).toBeGreaterThan(0);
    expect(goianesia / 1024 / 1024, "Goianésia acima de 12 MB").toBeLessThan(12);
  });
});
