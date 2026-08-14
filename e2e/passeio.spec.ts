import { expect, test } from "@playwright/test";

/**
 * Os passeios são vídeo em laço, não mais cena 3D em tempo real.
 *
 * A troca resolveu o travamento no celular (issue #23): sem contexto WebGL e
 * sem dezenas de MB de textura em memória de vídeo, não há o que estourar. O
 * que estes testes travam é o que pode regredir sem ninguém notar — arquivo
 * que some, laço que para, e o peso voltando a crescer.
 */
test.describe("passeio das unidades", () => {
  const UNIDADES = ["Anápolis", "Goianésia"];

  for (const unidade of UNIDADES) {
    test(`o passeio de ${unidade} toca em laço`, async ({ page }) => {
      await page.goto("/");
      const video = page.getByLabel(`Passeio pela unidade de ${unidade}`);
      await video.scrollIntoViewIfNeeded();

      await expect(video).toHaveJSProperty("loop", true);
      // sem `muted` + `playsInline` o celular recusa tocar sozinho
      await expect(video).toHaveJSProperty("muted", true);

      /* Espera avançar de verdade, em vez de checar `paused`: o navegador pode
         reportar "tocando" antes do primeiro quadro sair. */
      await expect
        .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
          timeout: 20_000,
          message: "o vídeo não avançou",
        })
        .toBeGreaterThan(0.2);
    });
  }

  test("os arquivos existem nas duas larguras e nos dois formatos", async ({
    request,
  }) => {
    for (const slug of ["anapolis", "goianesia"]) {
      for (const arquivo of [
        `${slug}.webm`,
        `${slug}.mp4`,
        `${slug}-mobile.webm`,
        `${slug}-mobile.mp4`,
        `${slug}-poster.avif`,
      ]) {
        const r = await request.head(`/videos/${arquivo}`);
        expect(r.status(), arquivo).toBe(200);
      }
    }
  });

  test("nenhum passeio passa de 1,5 MB", async ({ request }) => {
    /* O ponto da troca foi peso. Sem esta trava, uma regravação em qualidade
       alta desfaz o ganho e ninguém percebe até o site ficar lento de novo. */
    for (const arquivo of ["anapolis.mp4", "goianesia.mp4"]) {
      const tamanho = Number(
        (await request.head(`/videos/${arquivo}`)).headers()["content-length"] ?? 0
      );
      expect(tamanho / 1024 / 1024, arquivo).toBeLessThan(1.5);
    }
  });

  test("o celular recebe o arquivo menor", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "só faz sentido no celular");

    await page.goto("/");
    const video = page.getByLabel("Passeio pela unidade de Anápolis");
    await video.scrollIntoViewIfNeeded();

    const fonte = await video.evaluate(
      (v: HTMLVideoElement) => v.querySelector("source")?.getAttribute("src") ?? ""
    );
    expect(fonte).toContain("-mobile");
  });
});
