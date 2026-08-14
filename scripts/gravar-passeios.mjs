/**
 * Grava os passeios 3D em vídeo.
 *
 * A cena three.js já renderiza exatamente o passeio que queremos: dez segundos
 * de câmera percorrendo cinco pontos. Em vez de remodelar nada, abrimos a
 * própria página num navegador, capturamos o canvas com `MediaRecorder` e
 * convertemos o resultado.
 *
 * Por que trocar 3D em tempo real por vídeo: o passeio não tem interação e não
 * muda de execução para execução — é exatamente o que vídeo faz melhor.
 * Decodificação de vídeo é acelerada por hardware em qualquer celular; WebGL
 * depende de driver, de memória livre e do que mais está aberto no aparelho.
 * Foi o que derrubou a aba em Goianésia (issue #23).
 *
 * Uso:
 *   npm run build && npx next start -p 3210
 *   node scripts/gravar-passeios.mjs
 */

import { execFile } from "node:child_process";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
import { chromium } from "@playwright/test";

const executar = promisify(execFile);

const RAIZ = path.resolve(import.meta.dirname, "..");
const SAIDA = path.join(RAIZ, "public", "videos");
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3210";

/** Duração do passeio na cena, em segundos (DURACAO em CenaClinica3D). */
const DURACAO = 10;
/** Folga para o último quadro entrar inteiro antes de parar a gravação. */
const FOLGA = 0.6;

const UNIDADES = [
  { slug: "anapolis", nome: "Anápolis" },
  { slug: "goianesia", nome: "Goianésia" },
];

/**
 * Grava em 1280x720. O bloco tem no máximo ~1150px de largura, então essa
 * resolução cobre o desktop sem sobrar; o corte para celular sai daqui por
 * redimensionamento, que é mais barato que gravar duas vezes.
 */
const LARGURA = 1280;

async function gravarUnidade(unidade) {
  /* Um navegador por unidade. Reaproveitar a janela fazia a segunda gravação
     sair vazia: a aba anterior deixava o compositor num estado em que o
     canvas parava de entregar quadros. */
  const navegador = await chromium.launch({
    headless: false,
    args: ["--autoplay-policy=no-user-gesture-required", "--window-position=0,0"],
  });
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });

  const bloco = pagina.getByRole("img", {
    name: `Passeio 3D pela unidade de ${unidade.nome}`,
  });
  await pagina.bringToFront();
  await bloco.scrollIntoViewIfNeeded();

  console.log(`  montando a cena de ${unidade.nome}…`);

  /* Espera a cena montar. O three chama setSize no canvas, então largura
     acima do padrão de 300 é o sinal de que passou do carregamento. Sondagem
     curta de propósito: a gravação começa logo depois, e o passeio já está
     rodando — cada milissegundo aqui é passeio perdido no começo do vídeo. */
  await pagina.waitForFunction(
    (nome) => {
      const b = document.querySelector(
        `[aria-label="Passeio 3D pela unidade de ${nome}"]`
      );
      const c = b?.querySelector("canvas");
      return !!c && c.width > 300;
    },
    unidade.nome,
    { timeout: 180_000, polling: 50 }
  );

  console.log(`  gravando ${DURACAO}s…`);

  const base64 = await pagina.evaluate(
    async ({ nome, duracao, folga }) => {
      const b = document.querySelector(
        `[aria-label="Passeio 3D pela unidade de ${nome}"]`
      );
      const canvas = b.querySelector("canvas");

      /* Sem argumento: o fluxo recebe um quadro a cada desenho do canvas, em
         vez de prometer 30 que o compositor não entrega. Com 30 fixo, a
         gravação saía com um terço da duração — o MediaRecorder contava só os
         quadros que chegaram. A cadência é normalizada depois, no ffmpeg. */
      const fluxo = canvas.captureStream();
      const gravador = new MediaRecorder(fluxo, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 8_000_000,
      });

      const pedacos = [];
      gravador.ondataavailable = (e) => e.data.size && pedacos.push(e.data);

      const pronto = new Promise((ok) => {
        gravador.onstop = async () => {
          const blob = new Blob(pedacos, { type: "video/webm" });
          const buffer = await blob.arrayBuffer();
          let binario = "";
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.length; i += 8192) {
            binario += String.fromCharCode(...bytes.subarray(i, i + 8192));
          }
          ok(btoa(binario));
        };
      });

      gravador.start();
      await new Promise((r) => setTimeout(r, (duracao + folga) * 1000));
      gravador.stop();
      return pronto;
    },
    { nome: unidade.nome, duracao: DURACAO, folga: FOLGA }
  );

  await navegador.close();
  return Buffer.from(base64, "base64");
}

/**
 * WebM VP9 e MP4 H.264, em duas larguras.
 *
 * Os dois formatos porque nenhum sozinho cobre tudo: VP9 é bem menor, H.264 é
 * o que Safari antigo lê. O navegador escolhe pelo primeiro `<source>` que
 * souber tocar, então o WebM vem primeiro.
 */
async function converter(bruto, slug) {
  const temporario = path.join(SAIDA, `${slug}-bruto.webm`);
  await writeFile(temporario, bruto);

  const perfis = [
    { sufixo: "", largura: LARGURA },
    // o celular nunca mostra o bloco acima de ~430px de CSS; 720 cobre 2x DPR
    { sufixo: "-mobile", largura: 720 },
  ];

  const gerados = [];
  for (const { sufixo, largura } of perfis) {
    const escala = `scale=${largura}:-2:flags=lanczos,fps=30`;

    const webm = path.join(SAIDA, `${slug}${sufixo}.webm`);
    await executar("ffmpeg", [
      "-y",
      "-i",
      temporario,
      "-vf",
      escala,
      "-t",
      String(DURACAO),
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "34",
      "-b:v",
      "0",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-an",
      webm,
    ]);

    const mp4 = path.join(SAIDA, `${slug}${sufixo}.mp4`);
    await executar("ffmpeg", [
      "-y",
      "-i",
      temporario,
      "-vf",
      escala,
      "-t",
      String(DURACAO),
      "-c:v",
      "libx264",
      "-crf",
      "25",
      "-preset",
      "slow",
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      // faststart põe o índice no começo: o vídeo começa a tocar antes de
      // baixar inteiro, que é o ponto todo de trocar o 3D por vídeo
      "-movflags",
      "+faststart",
      "-an",
      mp4,
    ]);

    gerados.push(webm, mp4);
  }

  /* Pôster do primeiro quadro. O `poster` do <video> aparece antes de o
     arquivo chegar — sem ele o bloco fica preto durante o download. */
  const poster = path.join(SAIDA, `${slug}-poster.avif`);
  await executar("ffmpeg", [
    "-y",
    "-i",
    temporario,
    "-vf",
    `${`scale=${LARGURA}:-2`},select=eq(n\\,0)`,
    "-frames:v",
    "1",
    "-c:v",
    "libaom-av1",
    "-crf",
    "40",
    "-still-picture",
    "1",
    poster,
  ]);
  gerados.push(poster);

  await rm(temporario);
  return gerados;
}

async function main() {
  await mkdir(SAIDA, { recursive: true });

  console.log(`Gravando a partir de ${BASE}\n`);
  /* Com janela de verdade, não headless. `captureStream` de um canvas WebGL
     depende do compositor do navegador entregar quadros, e headless não
     compõe: a gravação sai com o cabeçalho do WebM e zero quadro (110 bytes,
     medido). Numa janela real a GPU da máquina desenha e os quadros chegam. */
  for (const unidade of UNIDADES) {
    console.log(unidade.nome);
    const bruto = await gravarUnidade(unidade);
    console.log(`  bruto: ${(bruto.length / 1024 / 1024).toFixed(1)} MB`);

    const gerados = await converter(bruto, unidade.slug);
    for (const arquivo of gerados) {
      const { size } = await stat(arquivo);
      console.log(
        `  ${path.basename(arquivo).padEnd(28)} ${(size / 1024).toFixed(0)} KB`
      );
    }
    console.log();
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
