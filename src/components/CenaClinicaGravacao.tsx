"use client";

import { useEffect, useRef } from "react";
import type * as TRES from "three";

declare global {
  interface Window {
    __passeio: (t: number) => void;
    __passeioPronto: boolean;
  }
}

const DURACAO = 10;

const suavizar = (u: number) => -(Math.cos(Math.PI * u) - 1) / 2;
const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * A mesma cena dos passeios, preparada para gravação quadro a quadro.
 *
 * Só existe para alimentar `scripts/renderizar-passeios.mjs`: a página
 * `/_gravacao` não é ligada de lugar nenhum do site e sai do sitemap. Guardar
 * a cena aqui é o que permite regravar o vídeo quando o modelo mudar, sem
 * remontar tudo do zero.
 */
export default function CenaClinicaGravacao({
  modelo,
  afastamento,
}: {
  modelo: string;
  /** multiplica a distância da câmera; acima de 1 afasta e evita corte */
  afastamento: number;
}) {
  const blocoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bloco = blocoRef.current;
    const canvas = canvasRef.current;
    if (!bloco || !canvas) return;

    const morto = false;

    const iniciar = async () => {
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

        /* No celular a tela é pequena e a GPU é modesta: antialias por
           hardware custa caro e o ganho some no DPR alto. */
        const noCelular = window.matchMedia("(max-width: 768px)").matches;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !noCelular,
          powerPreference: noCelular ? "default" : "high-performance",
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
        /* 1024 no celular: o mapa de sombra é textura como qualquer outra, e
           2048² são 16 MB de VRAM que no aparelho do paciente fazem falta. */
        const ladoSombra = noCelular ? 1024 : 2048;
        sol.shadow.mapSize.set(ladoSombra, ladoSombra);
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
            // gravação não mostra progresso: não há ninguém olhando
            undefined,
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
          new THREE.Vector3(
            x * r * afastamento,
            chao + y * r * afastamento,
            z * r * afastamento
          );
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

        /* Sem laço de tempo real: quem manda o tempo é o gravador. Cada
           chamada desenha exatamente um quadro do instante pedido, então o
           resultado não depende da velocidade da máquina. */
        const desenhar = (t: number) => {
          const nt = Math.min(1, Math.max(0, t / DURACAO));
          const { pos, alvo } = pontoDoFilme(nt);
          camera.position.copy(pos);
          camera.lookAt(alvo);
          materialCortina.uniforms.uOpacity.value = Math.max(0.5, suave(0.78, 1, nt));
          renderer.render(cena, camera);
        };

        window.__passeio = desenhar;
        desenhar(0);
        window.__passeioPronto = true;
      } catch (e) {
        console.error("cena 3D:", e);
      }
    };

    iniciar();
  }, [modelo, afastamento]);

  return (
    <div ref={blocoRef} className="fixed inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

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
