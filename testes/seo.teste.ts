import { describe, expect, it } from "vitest";
import { metadataDaPagina } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Estes testes existem por causa de uma regressão real: o layout raiz declarava
 * `canonical: "/"`, e com isso TODAS as páginas apontavam a canônica para a
 * home. O Google leria o site inteiro como duplicata da raiz.
 */
describe("metadataDaPagina", () => {
  const rotas = [
    "/alinhadores",
    "/equipe",
    "/tecnologia",
    "/para-dentistas",
    "/procedimentos",
    "/procedimentos/implantes",
    "/agende",
    "/blog",
    "/privacidade",
  ];

  it.each(rotas)("a canônica de %s aponta para ela mesma, não para a home", (caminho) => {
    const m = metadataDaPagina({ titulo: "T", descricao: "D", caminho });
    expect(m.alternates?.canonical).toBe(caminho);
    expect(m.alternates?.canonical).not.toBe("/");
  });

  it.each(rotas)("o og:url de %s é absoluto e bate com a rota", (caminho) => {
    const m = metadataDaPagina({ titulo: "T", descricao: "D", caminho });
    expect(m.openGraph?.url).toBe(`${site.url}${caminho}`);
    expect(String(m.openGraph?.url)).toMatch(/^https?:\/\//);
  });

  it("duas rotas nunca compartilham a mesma canônica", () => {
    const vistas = rotas.map(
      (caminho) =>
        metadataDaPagina({ titulo: "T", descricao: "D", caminho }).alternates?.canonical
    );
    expect(new Set(vistas).size).toBe(rotas.length);
  });

  it("o título da aba fica curto e o do compartilhamento leva a marca", () => {
    const m = metadataDaPagina({
      titulo: "Equipe",
      descricao: "D",
      caminho: "/equipe",
    });
    expect(m.title).toBe("Equipe");
    expect(m.openGraph?.title).toBe(`Equipe | ${site.name}`);
  });

  it("declara pt-BR — o site é regional", () => {
    const m = metadataDaPagina({ titulo: "T", descricao: "D", caminho: "/x" });
    expect(m.openGraph).toMatchObject({ locale: "pt_BR", type: "website" });
    expect(m.openGraph?.siteName).toBe(site.name);
  });

  it("o cartão do X leva título, descrição e imagem grande", () => {
    // Sobreviveu à mutação antes: o bloco do Twitter não era verificado por
    // ninguém, então esvaziá-lo não quebrava teste nenhum.
    const m = metadataDaPagina({
      titulo: "Equipe",
      descricao: "Conheça a equipe",
      caminho: "/equipe",
    });
    expect(m.twitter).toMatchObject({
      card: "summary_large_image",
      title: `Equipe | ${site.name}`,
      description: "Conheça a equipe",
    });
  });

  it("a descrição vai igual para a meta e para as redes", () => {
    const descricao = "Alinhadores fabricados na própria clínica, em Anápolis.";
    const m = metadataDaPagina({ titulo: "T", descricao, caminho: "/x" });
    expect(m.description).toBe(descricao);
    expect(m.openGraph?.description).toBe(descricao);
    expect(m.twitter?.description).toBe(descricao);
  });
});
