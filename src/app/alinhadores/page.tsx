import Image from "next/image";
import Link from "next/link";
import ComoFunciona from "@/components/alinhadores/ComoFunciona";
import ServeParaMim from "@/components/alinhadores/ServeParaMim";
import Reveal from "@/components/Reveal";
import { previa } from "@/lib/lqip";
import { metadataDaPagina } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const metadata = metadataDaPagina({
  titulo: "Alinhadores invisíveis fabricados em Anápolis",
  descricao:
    "A Ortoative planeja e fabrica o próprio alinhador, em Anápolis. Sem intermediário: quem cuida do seu caso é quem produz. Avaliação gratuita.",
  caminho: "/alinhadores",
});

/**
 * Página dos alinhadores.
 *
 * A leitura dos concorrentes (Invisalign, ClearCorrect, SouSmile, Smart
 * Aligner, Angel) mostrou um padrão: todos são fabricantes vendendo por rede
 * credenciada, e o funil deles termina em "encontre um dentista perto de
 * você". Nenhum consegue dizer que atende e fabrica.
 *
 * A Ortoative consegue — e é sobre isso que a página inteira se apoia. As
 * outras decisões vêm daí:
 *
 * - Nada de texto corrido. Cada bloco responde uma pergunta e cabe numa
 *   olhada; quem quiser mais, abre.
 * - O preço não é escondido como nos concorrentes ("varia de caso a caso" e
 *   fim). Aqui explicamos o que faz variar. Esconder é o que faz o visitante
 *   sair para procurar em outro lugar.
 * - "Serve para o meu caso?" responde de verdade, inclusive quando a resposta
 *   é não. Isso é o que dá peso ao sim.
 */

/** Respostas curtas, no formato em que a dúvida aparece na cabeça do paciente. */
const DUVIDAS = [
  {
    pergunta: "Dói?",
    curta: "Aperta, não dói.",
    longa:
      "Nos dois ou três primeiros dias de cada placa nova há uma pressão — é ela que move o dente. Passa sozinha. Quem já usou aparelho fixo costuma dizer que o alinhador incomoda bem menos, porque não tem fio nem bráquete raspando na bochecha.",
  },
  {
    pergunta: "Aparece quando eu falo?",
    curta: "De perto, quase nada.",
    longa:
      "A placa é transparente e fina, moldada no formato exato dos seus dentes. Numa conversa normal a maioria das pessoas não percebe. Em foto com flash pode dar um brilho leve — e você pode tirar na hora.",
  },
  {
    pergunta: "Posso comer de tudo?",
    curta: "Pode. Você tira para comer.",
    longa:
      "Essa é a diferença prática mais sentida no dia a dia em relação ao aparelho fixo: nada de evitar pipoca, maçã ou sanduíche. Tira, come, escova e recoloca. O que não vale é beber café ou refrigerante com a placa na boca — mancha e o açúcar fica preso contra o dente.",
  },
  {
    pergunta: "Quanto tempo demora?",
    curta: "Da simulação à última placa, a maioria fica entre 6 e 18 meses.",
    longa:
      "Depende de quanto os dentes precisam andar. Casos de recidiva — quem usou aparelho e os dentes voltaram — costumam ser os mais curtos. Na consulta de avaliação você vê a simulação e o número de placas do seu caso antes de decidir.",
  },
  {
    pergunta: "E se eu esquecer de usar?",
    curta: "O tratamento atrasa, mas não se perde.",
    longa:
      "O alinhador precisa de cerca de 22 horas por dia para trabalhar. Esquecer um dia não estraga nada; esquecer com frequência faz o dente não acompanhar o planejamento, e aí a placa seguinte não encaixa direito. Quando isso acontece, refazemos a placa aqui mesmo — é uma das vantagens de a fábrica ser nossa.",
  },
  {
    pergunta: "Quanto custa?",
    curta: "Depende do número de placas — e a avaliação é gratuita.",
    longa:
      "O que faz o preço variar é quanto os dentes precisam se mover: mais movimento, mais placas. Por isso ninguém consegue dar um valor honesto sem antes escanear a sua boca. Na avaliação você recebe o plano e o valor fechado, sem compromisso de fechar na hora. Trabalhamos com parcelamento.",
  },
  {
    pergunta: "Preciso ir à clínica toda semana?",
    curta: "Não. As consultas são espaçadas.",
    longa:
      "Você leva várias placas de uma vez e faz as trocas em casa, na data combinada. As consultas servem para conferir se o movimento está saindo como o planejado — bem menos idas do que o aparelho fixo, que precisa de ajuste do fio.",
  },
  {
    pergunta: "E quando terminar, os dentes voltam?",
    curta: "Não, se usar a contenção.",
    longa:
      "Dente recém-movido tem memória e tende a voltar — é por isso que tanta gente que usou aparelho na adolescência está aqui de novo. A contenção faz parte do tratamento, não é item à parte, e a orientação de uso vem junto.",
  },
];

const NUMEROS = [
  { valor: "+500", rotulo: "sorrisos alinhados com alinhador" },
  { valor: "26+", rotulo: "anos de ortodontia em Anápolis" },
  { valor: "100%", rotulo: "produzido no nosso laboratório" },
];

export default function AlinhadoresPage() {
  return (
    <div className="pb-20 pt-24 md:pt-28">
      {/* ── Abertura ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-green-text">
              Alinhadores Ortoative
            </p>
            <h1 className="mt-2 text-4xl leading-tight md:text-5xl">
              O alinhador que sai da{" "}
              <span className="text-primary">nossa própria fábrica</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              As marcas grandes vendem por rede credenciada: o dentista escaneia e manda o
              seu caso para uma indústria em outro estado. Aqui, quem planeja o seu
              sorriso é quem produz a placa — no mesmo prédio.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/#avaliacao"
                className="tatil rounded-full bg-brand-green-btn px-7 py-4 text-lg font-extrabold text-white transition-colors hover:bg-brand-green-text"
              >
                Fazer avaliação gratuita
              </Link>
              <a
                href={whatsappLink(
                  "Oi! Vim pela página dos alinhadores e quero saber mais."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="tatil rounded-full border-2 border-primary px-7 py-4 text-lg font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Falar no WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image
                src="/images/alinhadores/uso-alinhador.avif"
                alt="Paciente colocando o alinhador invisível"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                {...previa("/images/alinhadores/uso-alinhador.avif")}
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <dl className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
            {NUMEROS.map((n) => (
              <div
                key={n.rotulo}
                className="rounded-2xl border border-border/70 p-5 max-md:last:col-span-2"
              >
                <dt className="sr-only">{n.rotulo}</dt>
                <dd>
                  <span className="block text-3xl font-extrabold text-primary md:text-4xl">
                    {n.valor}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground md:text-base">
                    {n.rotulo}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── O diferencial, com as fotos da fábrica ──────────────────────── */}
      <section className="mt-14 bg-realce py-12 md:mt-20 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="max-w-3xl text-3xl md:text-4xl">
              Por que fabricar aqui muda o seu tratamento
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                titulo: "O prazo encurta",
                texto:
                  "Não há transporte nem fila de terceiro entre o planejamento e a primeira placa na sua mão.",
                imagem: "/images/fabrica/laboratorio.avif",
                alt: "Laboratório de produção dos alinhadores",
              },
              {
                titulo: "A correção é rápida",
                texto:
                  "Se um dente não se mover como o planejado, a placa nova é produzida aqui — sem reabrir pedido com fornecedor.",
                imagem: "/images/fabrica/acabamento.avif",
                alt: "Etapa de acabamento e polimento do alinhador",
              },
              {
                titulo: "Não existe telefone-sem-fio",
                texto:
                  "Quem decide o movimento dos seus dentes é quem fabrica a placa. Nada se perde no caminho.",
                imagem: "/images/fabrica/impressoras.avif",
                alt: "Impressoras 3D do laboratório",
              },
            ].map((c, i) => (
              <Reveal key={c.titulo} delay={i * 80}>
                <article className="h-full overflow-hidden rounded-2xl bg-card">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={c.imagem}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      {...previa(c.imagem)}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg text-primary md:text-xl">{c.titulo}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {c.texto}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona, interativo ───────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-6xl px-4 md:mt-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green-text">
            Do escaneamento à última placa
          </p>
          <h2 className="mt-1 text-3xl md:text-4xl">Como funciona, por etapa</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
            Toque em cada etapa para ver o que acontece nela.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6">
            <ComoFunciona />
          </div>
        </Reveal>
      </section>

      {/* ── Serve para o meu caso? ──────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-5xl px-4 md:mt-20">
        <Reveal>
          <ServeParaMim />
        </Reveal>
      </section>

      {/* ── Dúvidas ─────────────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-5xl px-4 md:mt-20">
        <Reveal>
          <h2 className="text-3xl md:text-4xl">As perguntas que todo mundo faz</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
            A resposta curta está sempre à vista. Abra só a que te interessa.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {DUVIDAS.map((d, i) => (
            <Reveal key={d.pergunta} delay={Math.min(i, 4) * 60}>
              {/* <details> nativo: acessível por teclado, funciona sem JS e não
                  custa um byte de bundle. */}
              <details className="group h-full rounded-2xl border border-border bg-card p-5 transition-colors open:bg-realce hover:border-primary/40">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span>
                    <span className="block text-lg font-bold text-primary md:text-xl">
                      {d.pergunta}
                    </span>
                    <span className="mt-1 block text-base text-foreground">
                      {d.curta}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-2xl leading-none text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="conteudo-chega mt-3 border-t border-border pt-3 text-base leading-relaxed text-muted-foreground">
                  {d.longa}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Fechamento ──────────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-6xl px-4 md:mt-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-hero-dark">
            <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
              <div className="p-7 md:p-12">
                <h2 className="text-3xl text-white md:text-4xl">
                  A avaliação é gratuita e leva uma consulta
                </h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
                  Você escaneia, vê a simulação do seu sorriso e recebe o plano com o
                  valor fechado. Sem compromisso de fechar na hora — e sem massinha.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/#avaliacao"
                    className="tatil rounded-full bg-brand-green-btn px-7 py-4 text-lg font-extrabold text-white transition-transform hover:scale-105"
                  >
                    Agendar avaliação
                  </Link>
                  <a
                    href={whatsappLink(
                      "Oi! Quero agendar uma avaliação para alinhadores."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tatil rounded-full border-2 border-white/40 px-7 py-4 text-lg font-bold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative aspect-[4/3] max-md:order-first md:aspect-auto md:self-stretch">
                <Image
                  src="/images/alinhadores/estojo-aberto.avif"
                  alt="Estojo aberto com o par de alinhadores Ortoative"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  {...previa("/images/alinhadores/estojo-aberto.avif")}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
