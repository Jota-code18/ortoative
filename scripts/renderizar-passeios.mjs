/**
 * Renderiza os passeios quadro a quadro.
 *
 * Substitui a gravação em tempo real com `MediaRecorder`, que produzia dois
 * defeitos ao mesmo tempo:
 *
 * - **Travamento.** O compositor entregava bem menos que 30 quadros por
 *   segundo, e o ffmpeg completava a diferença duplicando quadro. Medido no
 *   vídeo antigo: 302 eventos de quadro repetido num arquivo de 300 quadros.
 * - **Qualidade baixa.** O WebM do MediaRecorder já era comprimido, e a
 *   conversão para MP4 comprimia de novo por cima. Sobravam ~590 kbps a
 *   1280x700.
 *
 * Aqui a cena é avançada por tempo fixo (`window.__passeio(t)`) e cada quadro
 * sai como PNG sem perda. O ffmpeg monta a sequência a 30fps exatos: nenhum
 * quadro duplicado, e uma geração de compressão em vez de duas.
 *
 * Também gera uma versão vertical para o celular, com a câmera mais afastada —
 * a paisagem cortada num bloco em pé era o que decepava as laterais da clínica.
 *
 * Uso:
 *   npm run build && npx next start -p 3210
 *   node scripts/renderizar-passeios.mjs
 */

import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
import { chromium } from "@playwright/test";

const executar = promisify(execFile);

/* A janela desconta a barra de rolagem, então a largura pode sair ímpar (705px
   medidos) — e o H.264 exige dimensão par. Arredondar para baixo custa no
   máximo um pixel e evita o encoder recusar o arquivo inteiro. */
const PAR = "scale=trunc(iw/2)*2:trunc(ih/2)*2";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = path.join(RAIZ, "public", "videos");
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3210";

const DURACAO = 10;
const FPS = 30;
const QUADROS = DURACAO * FPS;

const UNIDADES = [
  { slug: "anapolis", nome: "Anápolis", modelo: "/models/clinica.glb" },
  { slug: "goianesia", nome: "Goianésia", modelo: "/models/clinicagoianesia.glb" },
];

/**
 * Só MP4/H.264.
 *
 * O VP9 saía 3,5x maior que o H.264 nesta cena (8 MB contra 2,3 MB), e como o
 * WebM vinha primeiro no `<source>`, quem tivesse suporte baixava justamente o
 * arquivo grande. H.264 toca em todo navegador desde 2011 — o segundo formato
 * só custava espaço e tempo de render.
 */

/**
 * Dois formatos de enquadramento, não um redimensionado.
 *
 * A versão de celular é renderizada em pé, no formato do bloco onde ela vai
 * aparecer. Encolher a paisagem não resolvia: o bloco do celular é vertical, o
 * `object-cover` cortava as laterais, e é justamente aí que ficam as pontas da
 * clínica. Renderizando em pé não há corte nenhum.
 *
 * O afastamento é MENOR que o do desktop, não maior: o campo de visão é
 * derivado da largura, então num quadro em pé ele abre muito na vertical e a
 * clínica sai pequena no meio de um vazio.
 */
const FORMATOS = [
  { sufixo: "", largura: 1280, altura: 720, afastamento: 1 },
  { sufixo: "-mobile", largura: 720, altura: 900, afastamento: 0.74 },
];

async function renderizar(navegador, unidade, formato) {
  const contexto = await navegador.newContext({
    viewport: { width: formato.largura, height: formato.altura },
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();

  const url = new URL("/gravacao", BASE);
  url.searchParams.set("modelo", unidade.modelo);
  url.searchParams.set("afastamento", String(formato.afastamento));
  await pagina.goto(url.toString(), { waitUntil: "domcontentloaded" });

  console.log(`  ${unidade.nome}${formato.sufixo || " (desktop)"}: carregando modelo…`);
  await pagina.waitForFunction(() => window.__passeioPronto === true, null, {
    timeout: 300_000,
    polling: 100,
  });

  const pasta = await mkdtemp(path.join(os.tmpdir(), "passeio-"));
  console.log(`  renderizando ${QUADROS} quadros…`);

  for (let i = 0; i < QUADROS; i++) {
    /* Avança o relógio da cena e desenha um quadro. Nada depende de tempo
       real: o resultado é idêntico em qualquer máquina, rápida ou lenta. */
    await pagina.evaluate((t) => window.__passeio(t), i / FPS);
    await pagina
      .locator("canvas")
      .screenshot({ path: path.join(pasta, `q${String(i).padStart(4, "0")}.png`) });
  }

  await contexto.close();
  return pasta;
}

async function montar(pasta, slug, formato) {
  const entrada = path.join(pasta, "q%04d.png");
  const gerados = [];

  const mp4 = path.join(SAIDA, `${slug}${formato.sufixo}.mp4`);
  await executar("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    entrada,
    "-vf",
    PAR,
    "-c:v",
    "libx264",
    "-crf",
    "20",
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    // índice no começo: o vídeo toca antes de baixar inteiro
    "-movflags",
    "+faststart",
    "-an",
    mp4,
  ]);
  gerados.push(mp4);

  if (!formato.sufixo) {
    const poster = path.join(SAIDA, `${slug}-poster.avif`);
    await executar("ffmpeg", [
      "-y",
      "-i",
      path.join(pasta, "q0000.png"),
      "-c:v",
      "libaom-av1",
      "-crf",
      "38",
      "-still-picture",
      "1",
      poster,
    ]);
    gerados.push(poster);
  }

  await rm(pasta, { recursive: true, force: true });
  return gerados;
}

async function main() {
  await mkdir(SAIDA, { recursive: true });
  console.log(`Renderizando a partir de ${BASE}\n`);

  const navegador = await chromium.launch({
    headless: false,
    args: ["--window-position=0,0"],
  });

  try {
    for (const unidade of UNIDADES) {
      console.log(unidade.nome);
      for (const formato of FORMATOS) {
        const pasta = await renderizar(navegador, unidade, formato);
        for (const arquivo of await montar(pasta, unidade.slug, formato)) {
          const { size } = await stat(arquivo);
          console.log(
            `  ${path.basename(arquivo).padEnd(26)} ${(size / 1024).toFixed(0)} KB`
          );
        }
      }
      console.log();
    }
  } finally {
    await navegador.close();
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
