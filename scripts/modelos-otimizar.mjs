/**
 * Reduz a resolução das texturas dos modelos 3D.
 *
 * O gargalo dos passeios nunca foi o download — era a memória de vídeo. Uma
 * textura de 4096x4096 chega comprimida em ~3 MB e ocupa ~89 MB de VRAM
 * depois de descompactada (4096² × 4 bytes, mais mipmaps). Com dois passeios
 * na mesma página isso passava de 290 MB só em textura, e o celular matava a
 * aba — o sintoma que o cliente descreveu como "trava e recarrega".
 *
 * Os passeios aparecem num bloco de no máximo ~1150px de largura. Textura de
 * 4096 ali é resolução que ninguém vê e todo mundo paga.
 *
 * Uso: node scripts/modelos-otimizar.mjs [--escrever]
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import sharp from "sharp";

const RAIZ = path.resolve(import.meta.dirname, "..");
const MODELOS = path.join(RAIZ, "public", "models");

/**
 * Teto por tipo de mapa. Cor precisa de mais detalhe que relevo: normal e
 * metallic/roughness descrevem variação suave e aguentam metade da resolução
 * sem diferença perceptível na distância em que a cena é vista.
 */
const TETO = {
  baseColorTexture: 2048,
  emissiveTexture: 1024,
  normalTexture: 1024,
  metallicRoughnessTexture: 1024,
  occlusionTexture: 1024,
  padrao: 1024,
};

/** VRAM aproximada: largura × altura × 4 bytes, mais ~33% de mipmaps. */
const vram = (l, a) => (l * a * 4 * 1.333) / 1024 / 1024;

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

async function otimizar(arquivo, escrever) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

  const documento = await io.read(arquivo);
  const raiz = documento.getRoot();

  let vramAntes = 0;
  let vramDepois = 0;

  for (const textura of raiz.listTextures()) {
    const dados = textura.getImage();
    if (!dados) continue;

    const imagem = sharp(Buffer.from(dados));
    const meta = await imagem.metadata();
    const maior = Math.max(meta.width ?? 0, meta.height ?? 0);
    vramAntes += vram(meta.width ?? 0, meta.height ?? 0);

    /* O slot diz para que a textura serve. Uma mesma imagem pode ocupar mais
       de um slot; nesse caso vale o teto mais generoso. */
    const slots = listarSlots(documento, textura);
    const teto = Math.max(...slots.map((s) => TETO[s] ?? TETO.padrao), TETO.padrao);

    if (maior <= teto) {
      vramDepois += vram(meta.width ?? 0, meta.height ?? 0);
      console.log(
        `  ${textura.getName() || "(sem nome)"} — ${meta.width}x${meta.height} mantida`
      );
      continue;
    }

    /* `toColourspace("srgb")` explícito: sem isso o sharp falha em algumas
       WebP que não declaram espaço de cor, que foi onde o CLI do
       gltf-transform quebrou. */
    const redimensionada = await imagem
      .resize(teto, teto, { fit: "inside", withoutEnlargement: true })
      .toColourspace("srgb")
      .webp({ quality: 82, effort: 5 })
      .toBuffer();

    const novaMeta = await sharp(redimensionada).metadata();
    vramDepois += vram(novaMeta.width ?? 0, novaMeta.height ?? 0);

    textura.setImage(new Uint8Array(redimensionada)).setMimeType("image/webp");

    console.log(
      `  ${textura.getName() || "(sem nome)"} — ${meta.width}x${meta.height} → ` +
        `${novaMeta.width}x${novaMeta.height}  (VRAM ${vram(meta.width, meta.height).toFixed(0)} MB → ${vram(novaMeta.width, novaMeta.height).toFixed(0)} MB)`
    );
  }

  const tamanhoAntes = (await stat(arquivo)).size;

  if (escrever) {
    await io.write(arquivo, documento);
  }

  const tamanhoDepois = escrever ? (await stat(arquivo)).size : tamanhoAntes;

  return { tamanhoAntes, tamanhoDepois, vramAntes, vramDepois };
}

/** Em quais slots de material a textura é usada. */
function listarSlots(documento, textura) {
  const slots = new Set();
  for (const material of documento.getRoot().listMaterials()) {
    for (const [nome, metodo] of [
      ["baseColorTexture", "getBaseColorTexture"],
      ["normalTexture", "getNormalTexture"],
      ["metallicRoughnessTexture", "getMetallicRoughnessTexture"],
      ["emissiveTexture", "getEmissiveTexture"],
      ["occlusionTexture", "getOcclusionTexture"],
    ]) {
      if (material[metodo]?.() === textura) slots.add(nome);
    }
  }
  return [...slots];
}

async function main() {
  const escrever = process.argv.includes("--escrever");
  let vramAntes = 0;
  let vramDepois = 0;
  let antes = 0;
  let depois = 0;

  for (const nome of await readdir(MODELOS)) {
    if (!nome.endsWith(".glb")) continue;
    console.log(`\n${nome}`);
    const r = await otimizar(path.join(MODELOS, nome), escrever);
    antes += r.tamanhoAntes;
    depois += r.tamanhoDepois;
    vramAntes += r.vramAntes;
    vramDepois += r.vramDepois;
    console.log(
      `  arquivo ${mb(r.tamanhoAntes)} MB → ${mb(r.tamanhoDepois)} MB · ` +
        `VRAM ${r.vramAntes.toFixed(0)} MB → ${r.vramDepois.toFixed(0)} MB`
    );
  }

  console.log(
    `\nTotal: ${mb(antes)} MB → ${mb(depois)} MB no disco · ` +
      `${vramAntes.toFixed(0)} MB → ${vramDepois.toFixed(0)} MB de VRAM`
  );
  if (!escrever) console.log("\nSimulação. Rode com --escrever para aplicar.");
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
