"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// só tipos: não entra no bundle, o three em si é carregado sob demanda
import type * as TRES from "three";
import Skeleton from "@/components/Skeleton";
import { unidades } from "@/lib/data";
import { previa } from "@/lib/lqip";

/**
 * Passeio 3D pelo espaço da Ortoative.
 *
 * A cena vem do bundle do Claude Design: modelo da clínica, câmera percorrendo
 * cinco pontos em 10s, sombras projetadas e uma cortina que integra o topo ao
 * fundo da página.
 *
 * Diferenças em relação ao protótipo, que era uma página inteira:
 * - tudo vive dentro do bloco da seção, nada em `position: fixed`;
 * - o título da seção fica sobre o topo já embranquecido pela cortina;
 * - three.js e o modelo (10 MB) só baixam quando o bloco se aproxima da tela;
 * - a animação congela fora da viewport e em aba oculta.
 */

const DURACAO = 10; // segundos de passeio

/**
 * Fachada da unidade, para segurar o lugar quando o WebGL falha ou o download
 * do modelo não completa. Sai da mesma fonte que alimenta a seção — assim o
 * caminho não se perde quando o formato do acervo muda.
 */
const fachadaDaUnidade = (nome: string) =>
  unidades.find((u) => u.nome === nome)?.fachada ?? unidades[0].fachada;

const suavizar = (u: number) => -(Math.cos(Math.PI * u) - 1) / 2;
const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function CenaClinica3D({
  modelo,
  unidade,
}: {
  /** caminho do .glb da unidade */
  modelo: string;
  /** nome da unidade, usado no rótulo acessível e no estado de carga */
  unidade: string;
}) {
  const blocoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<"espera" | "carregando" | "pronto" | "erro">(
    "espera"
  );
  const [progressoCarga, setProgressoCarga] = useState(0);
  const [progressoFilme, setProgressoFilme] = useState(0);
  const [terminou, setTerminou] = useState(false);
  const reiniciarRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const bloco = blocoRef.current;
    const canvas = canvasRef.current;
    if (!bloco || !canvas) return;

    let morto = false;
    let raf = 0;
    let visivel = true;
    let limpar = () => {};

    const iniciar = async () => {
      setEstado("carregando");
      try {
        /* Sem bloom (a segunda versão do bundle zerou a intensidade), o
           EffectComposer deixa de ter função: renderizamos direto, o que
           poupa dois passes de GPU por quadro. */
        const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }] =
          await Promise.all([
            import("three"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/loaders/DRACOLoader.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
          ]);
        if (morto) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        // sombras reais, novidade da terceira versão do bundle
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const cena = new THREE.Scene();
        // névoa mais leve que a do protótipo: lá a cena ocupava a tela toda,
        // aqui ela é um bloco e o excesso deixava a fachada lavada
        cena.fog = new THREE.FogExp2(0xdfe7ea, 0.012);
        /* O three define o FOV na vertical. Se ele ficasse fixo, o bloco alto
           e estreito do celular cortaria as laterais da fachada. Fixamos o
           campo HORIZONTAL e derivamos o vertical a cada resize. */
        const FOV_HORIZONTAL = 40;
        /* Piso vertical: em telas muito largas (16:6, por exemplo) derivar o
           vertical só do horizontal resulta num campo altíssimo de zoom, e a
           clínica sai cortada em cima e embaixo. */
        const FOV_VERTICAL_MIN = 22;
        const camera = new THREE.PerspectiveCamera(26, 1, 0.02, 400);

        const pmrem = new THREE.PMREMGenerator(renderer);
        cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        cena.environmentIntensity = 0.85;
        cena.add(new THREE.HemisphereLight(0xc3ddf2, 0x74804f, 1.15));
        const sol = new THREE.DirectionalLight(0xfff3e2, 1.9);
        sol.position.set(4.5, 6, 3.5);
        sol.castShadow = true;
        sol.shadow.mapSize.set(2048, 2048);
        sol.shadow.bias = -0.0006;
        sol.shadow.normalBias = 0.02;
        cena.add(sol);
        const preenchimento = new THREE.DirectionalLight(0xdce8f5, 0.4);
        preenchimento.position.set(-4, 2.5, -3);
        cena.add(preenchimento);

        // o modelo veio comprimido em Draco (20 MB → 10 MB)
        const draco = new DRACOLoader();
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);

        const gltf = await new Promise<{ scene: TRES.Group }>((ok, falha) => {
          loader.load(
            modelo,
            (r) => ok(r as unknown as { scene: TRES.Group }),
            (e) => {
              if (e.total) setProgressoCarga(Math.round((e.loaded / e.total) * 100));
            },
            falha
          );
        });
        if (morto) return;

        const objeto = gltf.scene;
        objeto.traverse((o: TRES.Object3D) => {
          const m = o as TRES.Mesh;
          if (m.isMesh && m.material) {
            const mat = m.material as TRES.MeshStandardMaterial;
            if (mat.emissiveMap) mat.emissiveIntensity = 0.2;
            if (mat.map) mat.map.anisotropy = 8;
          }
        });
        const caixa = new THREE.Box3().setFromObject(objeto);
        objeto.position.sub(caixa.getCenter(new THREE.Vector3()));
        caixa.setFromObject(objeto);
        const r = Math.max(caixa.max.x - caixa.min.x, caixa.max.z - caixa.min.z) / 2;
        const chao = caixa.min.y;
        cena.add(objeto);

        // sombra projetada pelo sol — o modelo entra e recebe
        objeto.traverse((o: TRES.Object3D) => {
          const m = o as TRES.Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });
        const sombra = sol.shadow;
        const alcance = 2.6 * r;
        const cam = sombra.camera as TRES.OrthographicCamera;
        cam.left = -alcance;
        cam.right = alcance;
        cam.top = alcance;
        cam.bottom = -alcance;
        cam.near = 0.1 * r;
        cam.far = 22 * r;
        sol.position.set(4.5 * r, 6 * r, 3.5 * r);
        cam.updateProjectionMatrix();

        const materialCortina = montarAmbiente(THREE, cena, r, chao);

        // trilho da câmera: cinco pontos do alto do terreno até a fachada
        const V = (x: number, y: number, z: number) =>
          new THREE.Vector3(x * r, chao + y * r, z * r);
        /* O passeio termina com a clínica ocupando o quadro: perto o bastante
           para ser o assunto, longe o bastante para não cortar. */
        const pontos = [
          { p: V(0.5, 4.4, 1.6), t: V(0, 0.2, 0) },
          { p: V(-3.4, 2.4, 3.8), t: V(0, 0.3, 0) },
          { p: V(-3.9, 1.0, 3.7), t: V(0, 0.3, 0) },
          { p: V(2.2, 0.9, 3.8), t: V(0, 0.35, 0) },
          { p: V(0, 0.9, 4.2), t: V(0, 0.38, 0) },
        ];
        const tempos = [0, 0.28, 0.52, 0.78, 1];
        const curvaPos = new THREE.CatmullRomCurve3(
          pontos.map((k) => k.p),
          false,
          "centripetal",
          0.4
        );
        const curvaAlvo = new THREE.CatmullRomCurve3(
          pontos.map((k) => k.t),
          false,
          "centripetal",
          0.4
        );
        const pontoDoFilme = (nt: number) => {
          const v = Math.min(1, Math.max(0, nt));
          let i = 0;
          while (i < tempos.length - 2 && v > tempos[i + 1]) i++;
          const u = (v - tempos[i]) / (tempos[i + 1] - tempos[i]);
          const par = (i + suavizar(Math.min(1, Math.max(0, u)))) / (tempos.length - 1);
          return { pos: curvaPos.getPoint(par), alvo: curvaAlvo.getPoint(par) };
        };

        const redimensionar = () => {
          const l = bloco.clientWidth || 1;
          const a = bloco.clientHeight || 1;
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          renderer.setPixelRatio(dpr);
          renderer.setSize(l, a);
          camera.aspect = l / a;
          const meioH = (FOV_HORIZONTAL / 2) * (Math.PI / 180);
          const vertical =
            2 * Math.atan(Math.tan(meioH) / camera.aspect) * (180 / Math.PI);
          camera.fov = Math.max(vertical, FOV_VERTICAL_MIN);
          camera.updateProjectionMatrix();
        };
        redimensionar();
        const ro = new ResizeObserver(redimensionar);
        ro.observe(bloco);

        // paralaxe leve do mouse, medida dentro do bloco
        let mx = 0;
        let my = 0;
        const aoMover = (e: PointerEvent) => {
          const c = bloco.getBoundingClientRect();
          mx = ((e.clientX - c.left) / c.width) * 2 - 1;
          my = ((e.clientY - c.top) / c.height) * 2 - 1;
        };
        bloco.addEventListener("pointermove", aoMover, { passive: true });

        const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting), {
          threshold: 0.05,
        });
        io.observe(bloco);

        const semMovimento = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        let t = semMovimento ? DURACAO : 0;
        let rodando = !semMovimento;
        const relogio = new THREE.Clock();

        reiniciarRef.current = () => {
          t = 0;
          rodando = true;
          setTerminou(false);
        };

        const quadro = () => {
          if (morto) return;
          raf = requestAnimationFrame(quadro);
          const dt = Math.min(relogio.getDelta(), 0.1);
          const decorrido = relogio.getElapsedTime();
          if (!visivel || document.hidden) return;

          if (rodando) {
            t += dt;
            if (t >= DURACAO) {
              t = DURACAO;
              rodando = false;
              setTerminou(true);
            }
          }
          const nt = t / DURACAO;
          setProgressoFilme(nt);

          const { pos, alvo } = pontoDoFilme(nt);
          if (!semMovimento) {
            pos.x += Math.sin(decorrido * 0.22) * 0.014 * r;
            pos.y += Math.cos(decorrido * 0.17) * 0.008 * r;
            pos.x += mx * 0.035 * r;
            pos.y += -my * 0.02 * r;
          }
          camera.position.copy(pos);
          camera.lookAt(alvo);

          /* A cortina fecha no fim do passeio, como no bundle. O piso de 0.5
             mantém o topo claro desde o início — sem ele o título ficaria
             sobre o azul do céu, com contraste ruim. */
          materialCortina.uniforms.uOpacity.value = Math.max(0.5, suave(0.78, 1, nt));

          renderer.render(cena, camera);
        };
        quadro();

        setEstado("pronto");

        limpar = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          bloco.removeEventListener("pointermove", aoMover);
          renderer.dispose();
          draco.dispose();
        };
      } catch (e) {
        console.error("cena 3D:", e);
        if (!morto) setEstado("erro");
      }
    };

    // só busca three + modelo quando o bloco se aproxima da tela
    const gatilho = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gatilho.disconnect();
          iniciar();
        }
      },
      { rootMargin: "300px" }
    );
    gatilho.observe(bloco);

    return () => {
      morto = true;
      gatilho.disconnect();
      limpar();
    };
  }, [modelo]);

  return (
    <div className="relative isolate">
      <div
        ref={blocoRef}
        role="img"
        aria-label={`Passeio 3D pela unidade de ${unidade}`}
        /* Borda arredondada e anel suave; altura generosa para o modelo não
           ficar miúdo. No celular o quadro é mais baixo — com ele muito alto,
           manter a fachada inteira sobrava céu demais em cima e embaixo. */
        className="relative h-[52vh] min-h-[360px] overflow-hidden rounded-3xl ring-1 ring-black/5 md:h-[68vh] md:rounded-[2rem]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        {/* Estado de carga — os modelos têm 10 e 13 MB, então isso fica na
            tela por vários segundos em rede de celular. O esqueleto ocupa o
            quadro inteiro para o bloco não parecer um buraco na página. */}
        {estado !== "pronto" && estado !== "erro" && (
          <>
            <Skeleton arredondado="" className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 md:p-10">
              <div className="progresso-trilho h-[3px] w-[min(320px,60%)]">
                <div
                  className="progresso-barra"
                  style={{ "--progresso": progressoCarga / 100 } as React.CSSProperties}
                />
              </div>
              <p className="text-sm tracking-[0.2em] text-muted-foreground">
                CARREGANDO {unidade.toUpperCase()} — {progressoCarga}%
              </p>
            </div>
          </>
        )}

        {/* Sem WebGL ou com falha no download: a fachada real segura o lugar */}
        {estado === "erro" && (
          <div className="absolute inset-0">
            <Image
              src={fachadaDaUnidade(unidade)}
              alt={`Fachada da Ortoative — ${unidade}`}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
              {...previa(fachadaDaUnidade(unidade))}
            />
          </div>
        )}

        {/* Linha de progresso do passeio */}
        {estado === "pronto" && (
          <div className="progresso-trilho absolute inset-x-0 bottom-0 h-[3px] rounded-none">
            <div
              className="progresso-barra rounded-none"
              /* sem transição aqui: o valor já chega suave, quadro a quadro,
                 do laço de animação — amortecer de novo criaria atraso */
              style={
                {
                  "--progresso": progressoFilme,
                  transition: "none",
                } as React.CSSProperties
              }
            />
          </div>
        )}

        {terminou && (
          <button
            type="button"
            onClick={() => reiniciarRef.current?.()}
            className="absolute bottom-6 left-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-blue md:bottom-10 md:left-10"
          >
            Rever o passeio
          </button>
        )}

        {/* Grão sutil, como no protótipo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Ambiente da terceira versão do bundle: no lugar do jardim (grama, arbustos,
 * árvores, nuvens) entrou um piso neutro que recebe a sombra projetada, uma
 * mancha de contato sob o prédio, o céu e a cortina de integração.
 *
 * A cortina é um cilindro que envolve a cena inteira e só fica opaca ACIMA da
 * altura do prédio (uY0). É isso que faz o telhado passar por cima do degradê
 * de qualquer ângulo — e, diferente de um plano seguindo a câmera, não tem
 * borda para aparecer.
 *
 * Devolve o material da cortina, cuja opacidade é animada a cada quadro.
 */
function montarAmbiente(
  THREE: typeof import("three"),
  cena: TRES.Scene,
  r: number,
  chao: number
): TRES.ShaderMaterial {
  const piso = new THREE.Mesh(
    new THREE.CircleGeometry(r * 60, 64),
    new THREE.MeshStandardMaterial({ color: 0xe6e4e1, roughness: 1, metalness: 0 })
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.y = chao - 0.004 * r;
  piso.receiveShadow = true;
  cena.add(piso);

  // sombra de contato: assenta o prédio no chão onde a sombra projetada não chega
  const ao = document.createElement("canvas");
  ao.width = ao.height = 256;
  const ctx = ao.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(32,30,29,.34)");
    g.addColorStop(0.45, "rgba(32,30,29,.16)");
    g.addColorStop(1, "rgba(32,30,29,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  const contato = new THREE.Mesh(
    new THREE.PlaneGeometry(r * 3.4, r * 3.4),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(ao),
      transparent: true,
      depthWrite: false,
      fog: false,
    })
  );
  contato.rotation.x = -Math.PI / 2;
  contato.position.y = chao + 0.0015 * r;
  contato.renderOrder = 1;
  cena.add(contato);

  const ceu = new THREE.Mesh(
    new THREE.SphereGeometry(140 * r, 24, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
      uniforms: {
        topo: { value: new THREE.Color(0xa9cbe6) },
        meio: { value: new THREE.Color(0xd2e3ef) },
        horizonte: { value: new THREE.Color(0xeef0ef) },
      },
      vertexShader:
        "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 topo, meio, horizonte; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y, 0.0, 1.0); vec3 c = mix(horizonte, meio, smoothstep(0.0, 0.16, h)); c = mix(c, topo, smoothstep(0.16, 0.62, h)); gl_FragColor = vec4(c, 1.0); }",
    })
  );
  cena.add(ceu);

  const materialCortina = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    side: THREE.BackSide,
    uniforms: {
      uCor: { value: new THREE.Color("#ffffff") },
      uOpacity: { value: 0 },
      // só embranquece acima do telhado: o prédio nunca é coberto
      uY0: { value: chao + 1.15 * r },
      uY1: { value: chao + 5.2 * r },
    },
    vertexShader:
      "varying float vY; void main(){ vY = (modelMatrix * vec4(position,1.0)).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader:
      "uniform vec3 uCor; uniform float uOpacity, uY0, uY1; varying float vY; void main(){ float a = smoothstep(uY0, uY1, vY) * uOpacity; if (a <= 0.001) discard; gl_FragColor = vec4(uCor, a); }",
  });
  const cortina = new THREE.Mesh(
    new THREE.CylinderGeometry(26 * r, 26 * r, 70 * r, 36, 1, true),
    materialCortina
  );
  cortina.position.y = chao + 28 * r;
  cortina.renderOrder = 2;
  cena.add(cortina);

  const tampa = new THREE.Mesh(new THREE.CircleGeometry(26 * r, 36), materialCortina);
  tampa.rotation.x = Math.PI / 2;
  tampa.position.y = chao + 63 * r;
  tampa.renderOrder = 2;
  cena.add(tampa);

  return materialCortina;
}
