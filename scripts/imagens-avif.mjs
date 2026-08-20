/**
 * Converte o acervo fotográfico para AVIF e gera o LQIP de cada imagem.
 *
 * Duas saídas:
 *  1. `.avif` ao lado de cada original (o original é apagado com --limpar)
 *  2. `src/lib/lqip.json` — um base64 minúsculo por imagem, usado como
 *     `blurDataURL` do next/image para o espaço nunca ficar vazio
 *
 * O que NÃO converte está em `PRESERVAR`, logo abaixo, com o motivo de cada
 * pasta.
 */

import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const RAIZ = path.resolve(import.meta.dirname, "..");
const ACERVO = path.join(RAIZ, "public", "images");
const MANIFESTO = path.join(RAIZ, "src", "lib", "lqip.json");

/**
 * Pastas que ficam no formato original, com o motivo.
 *
 * `marca` entra no JSON-LD, no favicon e no poster do model-viewer. `og` é o
 * cartão de compartilhamento: WhatsApp, Facebook e LinkedIn não decodificam
 * AVIF, e o link apareceria sem imagem nenhuma. Nos dois casos quem consome é
 * rastreador ou elemento nativo, que não negocia formato — PNG e JPG ali são
 * compatibilidade, não desleixo.
 */
const PRESERVAR = new Set(["marca", "og"]);

const CONVERSIVEIS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * O manifesto é reescrito inteiro a cada execução, então precisa listar também
 * o que já está em AVIF. Sem isso, converter uma foto nova apagava o LQIP de
 * todas as outras — o acervo já convertido não voltava a ser percorrido, e o
 * site perdia a prévia de 20 imagens de uma vez.
 */
const CATALOGAVEIS = new Set([...CONVERSIVEIS, ".avif"]);

/**
 * Qualidade alta de propósito. O arquivo em `public/` é a fonte: o next/image
 * ainda vai redimensionar e recodificar por cima dele. Economizar aqui faz a
 * perda se acumular nas duas gerações e aparecer como borrão nas fotos.
 */
const QUALIDADE = 62;

/** Largura do LQIP. Acima de ~20px o base64 engorda o HTML sem ganho visual. */
const LARGURA_LQIP = 16;

async function* percorrer(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const completo = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (PRESERVAR.has(item.name)) continue;
      yield* percorrer(completo);
    } else if (CATALOGAVEIS.has(path.extname(item.name).toLowerCase())) {
      yield completo;
    }
  }
}

/** Caminho público (`/images/...`) a partir do caminho no disco. */
const paraUrl = (arquivo) =>
  `/${path.relative(path.join(RAIZ, "public"), arquivo).split(path.sep).join("/")}`;

const kb = (bytes) => (bytes / 1024).toFixed(0);

async function main() {
  const limpar = process.argv.includes("--limpar");
  const lqip = {};
  let antes = 0;
  let depois = 0;
  const convertidos = [];

  for await (const origem of percorrer(ACERVO)) {
    const entrada = await readFile(origem);
    const jaEhAvif = path.extname(origem).toLowerCase() === ".avif";
    const destino = jaEhAvif ? origem : origem.replace(/\.(jpe?g|png|webp)$/i, ".avif");

    if (!jaEhAvif) {
      const meta = await sharp(entrada).metadata();

      // `alphaQuality` alto preserva a borda recortada do alinhador; sem isso o
      // canal alfa vira degrau visível contra o brilho de fundo.
      await sharp(entrada)
        .avif({
          quality: QUALIDADE,
          effort: 6,
          chromaSubsampling: "4:4:4",
          ...(meta.hasAlpha ? { alphaQuality: 90 } : {}),
        })
        .toFile(destino);
    }

    /* O LQIP sai do arquivo que ficou publicado, não do original: assim quem
       já estava em AVIF continua no manifesto sem ser reconvertido. */
    const miniatura = await sharp(await readFile(destino))
      .resize(LARGURA_LQIP, null, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();

    lqip[paraUrl(destino)] = `data:image/webp;base64,${miniatura.toString("base64")}`;

    if (jaEhAvif) continue;

    const tamanhoAntes = entrada.byteLength;
    const tamanhoDepois = (await stat(destino)).size;
    antes += tamanhoAntes;
    depois += tamanhoDepois;
    convertidos.push({ origem, tamanhoAntes, tamanhoDepois });

    const delta = (100 * (1 - tamanhoDepois / tamanhoAntes)).toFixed(0);
    console.log(
      `${paraUrl(destino).padEnd(42)} ${kb(tamanhoAntes).padStart(5)} KB → ` +
        `${kb(tamanhoDepois).padStart(5)} KB  (${delta > 0 ? "-" : "+"}${Math.abs(delta)}%)`
    );

    if (limpar) await unlink(origem);
  }

  await writeFile(MANIFESTO, `${JSON.stringify(lqip, null, 2)}\n`, "utf8");

  console.log(
    convertidos.length
      ? `\n${convertidos.length} imagens · ${kb(antes)} KB → ${kb(depois)} KB ` +
          `(-${(100 * (1 - depois / antes)).toFixed(0)}%)`
      : "\nNada a converter — o acervo já está em AVIF."
  );
  console.log(`LQIP de ${Object.keys(lqip).length} imagens em src/lib/lqip.json`);
  if (!limpar) console.log("\nOriginais mantidos. Rode com --limpar para removê-los.");
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
