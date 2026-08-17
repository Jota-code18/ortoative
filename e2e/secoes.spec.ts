import { expect, test } from "@playwright/test";

/**
 * As seções de procedimento saem todas do mesmo molde. Estes testes travam o
 * que dá para verificar sozinho — a hierarquia e a regra do celular, que foi o
 * que motivou o desenho: cada seção precisa caber numa tela, sem o paciente
 * rolar para ver a imagem.
 */
const SECOES = [
  "alinhadores",
  "ortodontia-fixa",
  "implantes",
  "para-dentistas",
  "estetica",
];

test.describe("seções de procedimento", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("cada seção cabe numa tela de celular", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "a restrição é do celular");

    /* Empilhada, a imagem caía fora do campo de visão e o paciente rolava sem
       ver texto e imagem juntos. É o que a medida abaixo protege. */
    const alturas = await page.evaluate(
      (ids) =>
        ids.map((id) => {
          const s = document.getElementById(id) as HTMLElement;
          return {
            id,
            altura: s.getBoundingClientRect().height,
            tela: window.innerHeight,
          };
        }),
      SECOES
    );

    for (const { id, altura, tela } of alturas) {
      expect(altura, `seção ${id} não cabe na tela`).toBeLessThanOrEqual(tela);
    }
  });

  test("a imagem fica ao lado do texto, não abaixo", async ({ page }) => {
    for (const id of SECOES) {
      const separadas = await page.evaluate((sel) => {
        const s = document.getElementById(sel) as HTMLElement;

        /* Posição de layout, não a da tela: a entrada desloca a imagem 22px de
           lado, e medir no meio da animação daria falso negativo. `offsetLeft`
           ignora transform e já entrega onde o elemento pousa — assim o teste
           não precisa esperar animação nenhuma. */
        const esquerda = (el: HTMLElement) => {
          let x = 0;
          for (
            let n: HTMLElement | null = el;
            n;
            n = n.offsetParent as HTMLElement | null
          ) {
            x += n.offsetLeft;
          }
          return x;
        };
        const faixa = (el: HTMLElement) => {
          const e = esquerda(el);
          return { inicio: e, fim: e + el.offsetWidth };
        };

        const img = faixa(s.querySelector("img") as HTMLElement);
        const titulo = faixa(s.querySelector("h2") as HTMLElement);

        /* Lado a lado quer dizer que não se cruzam na horizontal: uma coluna
           termina antes de a outra começar. Comparar a sobreposição vertical
           não serve — a imagem acompanha só o bloco de cima, então pode não
           alcançar a altura do título. */
        return img.fim <= titulo.inicio + 1 || titulo.fim <= img.inicio + 1;
      }, id);

      expect(separadas, `imagem de ${id} não está ao lado do texto`).toBe(true);
    }
  });

  test("todas seguem a mesma hierarquia", async ({ page }) => {
    for (const id of SECOES) {
      const s = page.locator(`#${id}`);

      // o nome é o maior e vem na cor do tom, não em preto
      const nome = s.locator("h2");
      await expect(nome).toHaveCount(1);

      const cor = await nome.evaluate((e) => getComputedStyle(e).color);
      const preto = await s
        .locator("p")
        .last()
        .evaluate((e) => getComputedStyle(e).color);
      expect(cor, `o nome de ${id} deveria ter cor de marca`).not.toBe(preto);

      // e sempre há caminho para a página e para o WhatsApp
      await expect(s.getByRole("link", { name: "Falar no WhatsApp" })).toHaveCount(1);
    }
  });

  test("o nome do procedimento é o texto maior da seção", async ({ page }) => {
    for (const id of SECOES) {
      const tamanhos = await page.evaluate((sel) => {
        const s = document.getElementById(sel) as HTMLElement;
        const px = (e: Element) => Number.parseFloat(getComputedStyle(e).fontSize);
        return {
          nome: px(s.querySelector("h2") as Element),
          maiorDosOutros: Math.max(
            ...[...s.querySelectorAll("p, a, span")].map(px).filter(Number.isFinite)
          ),
        };
      }, id);

      expect(tamanhos.nome, `em ${id} algo é maior que o nome`).toBeGreaterThanOrEqual(
        tamanhos.maiorDosOutros
      );
    }
  });
});
