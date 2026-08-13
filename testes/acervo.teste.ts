import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { enderecoDe, equipe, fabrica, procedimentosGrade, unidades } from "@/lib/data";
import lqip from "@/lib/lqip.json";

const publico = (url: string) => path.join(process.cwd(), "public", url.replace(/^\//, ""));

/** Todo caminho de arquivo que os dados prometem que existe. */
const arquivos = [
  ...equipe.map((p) => p.foto),
  ...unidades.flatMap((u) => [u.fachada, u.modelo3d, ...u.interiores.map((i) => i.src)]),
  ...fabrica.map((f) => f.src),
  ...procedimentosGrade.map((p) => p.imagem),
];

/**
 * `lib/data.ts` guarda caminho como texto. Renomear ou converter um arquivo sem
 * atualizar o dado passa por typecheck, por lint e por build — e só aparece
 * como imagem quebrada em produção. Aconteceu na conversão para AVIF.
 */
describe("integridade do acervo", () => {
  it.each(arquivos)("%s existe em public/", (url) => {
    expect(existsSync(publico(url))).toBe(true);
  });

  it("toda foto tem prévia borrada gerada", () => {
    const semPrevia = arquivos
      .filter((u) => u.endsWith(".avif"))
      .filter((u) => !(u in (lqip as Record<string, string>)));
    expect(semPrevia, "rode `npm run imagens:avif`").toEqual([]);
  });

  it("nenhuma prévia aponta para arquivo que sumiu", () => {
    const orfas = Object.keys(lqip as Record<string, string>).filter(
      (u) => !existsSync(publico(u))
    );
    expect(orfas).toEqual([]);
  });
});

describe("dados da clínica", () => {
  it("toda foto de equipe tem alt utilizável — o nome do profissional", () => {
    for (const p of equipe) expect(p.nome.trim().length).toBeGreaterThan(3);
  });

  it("toda foto do interior tem alt descritivo, não genérico", () => {
    for (const u of unidades) {
      for (const foto of u.interiores) {
        expect(foto.alt.length, `${foto.src}`).toBeGreaterThan(10);
        expect(foto.alt.toLowerCase()).toContain(u.nome.toLowerCase());
      }
    }
  });

  it("o endereço de cada unidade monta cidade e UF", () => {
    for (const u of unidades) {
      const linha = enderecoDe(u);
      expect(linha).toContain(u.cidade);
      expect(linha).toContain(u.uf);
      expect(linha).toContain(u.rua);
    }
  });

  it("o slug de cada unidade e procedimento é único", () => {
    const slugs = [...unidades.map((u) => u.slug), ...procedimentosGrade.map((p) => p.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
