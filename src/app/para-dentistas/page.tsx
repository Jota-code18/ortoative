import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { previa } from "@/lib/lqip";
import { metadataDaPagina } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const metadata = metadataDaPagina({
  titulo: "Para Dentistas",
  descricao:
    "Formação e parceria de laboratório com o Prof. Dr. Rui Cambauva — autor de dois livros de Ortodontia, ex-professor de quatro universidades e fabricante de alinhadores em Anápolis.",
  caminho: "/para-dentistas",
});

/**
 * Página para o colega dentista.
 *
 * O visitante aqui é outro: não quer saber se dói nem quanto tempo demora.
 * Quer saber de quem vai aprender, o que vai aprender e o que acontece com o
 * caso que ele mandar. A página responde nessa ordem.
 *
 * O que não está aqui é de propósito: carga horária, datas, valor e formato de
 * turma dependem da agenda da clínica, e número errado numa página é pior do
 * que número nenhum. Cada bloco termina numa conversa.
 */

/** Os dois livros, com a ficha que o colega usa para procurar. */
const LIVROS = [
  {
    titulo: "Ortodontia — Diagnóstico Clínico & Cefalométrico",
    subtitulo: "fundamentado nos princípios da atratividade",
    ficha: "Editora Tota · 2011 · 328 páginas · ISBN 978-85-60246-09-0",
    resumo:
      "Manual de diagnóstico que parte da atratividade facial em vez do número isolado. Percorre anatomia cefalométrica, análise de Ricketts, exame clínico, obstrução nasal, disfunção temporomandibular e análise de modelos — mostrando onde a leitura facial e a cefalométrica se confirmam, e onde se contradizem.",
    conteudo: [
      "Análise da atratividade facial",
      "Anatomia cefalométrica e análise de Ricketts",
      "Exame clínico",
      "Obstrução nasal e diagnóstico ortodôntico",
      "Disfunção temporomandibular",
      "Análise de modelos",
    ],
  },
  {
    titulo: "Construindo VTO",
    subtitulo: "guia passo-a-passo",
    ficha: "Guia prático de traçado",
    resumo:
      "O VTO é onde o plano deixa de ser intenção e vira previsão: quanto cada dente anda, o que sobra de espaço, o que o perfil devolve. O guia leva o traçado do começo ao fim, na ordem em que ele é feito na clínica.",
    conteudo: [],
  },
];

/** Credenciais — o que sustenta a aula antes de a aula começar. */
const CREDENCIAIS = [
  "Esp., Me. e Dr. em Ortodontia",
  "Esp. e Me. em Radiologia",
  "Esp. em Implantodontia",
  "Formado pela UNAERP — Universidade de Ribeirão Preto",
];

const UNIVERSIDADES = [
  "UNAERP — Ribeirão Preto/SP",
  "UNIFEB — Barretos/SP",
  "SLMANDIC — Campinas/SP",
  "FUNORTE — Anápolis/GO",
];

/** O que o colega leva da formação — todos temas dos livros e da clínica. */
const TEMAS = [
  {
    titulo: "Diagnóstico antes da técnica",
    texto:
      "Ler a face, o modelo e a telerradiografia como três versões do mesmo caso. Quando as três concordam, o plano é fácil; a formação trata do que fazer quando discordam.",
  },
  {
    titulo: "Cefalometria que decide alguma coisa",
    texto:
      "Traçar é o começo. O que muda a conduta é saber qual grandeza pesa naquele caso e qual só está preenchendo a tabela.",
  },
  {
    titulo: "VTO passo a passo",
    texto:
      "Prever o resultado antes de colar o primeiro bráquete: quanto cada dente anda, o que sobra de espaço, o que o perfil devolve.",
  },
  {
    titulo: "Planejamento digital de alinhadores",
    texto:
      "Do escaneamento ao setup: como definir o movimento placa a placa, onde entram attachments, e por que o caso que se move no computador nem sempre se move na boca.",
  },
  {
    titulo: "Casos que o alinhador não resolve",
    texto:
      "Reconhecer cedo o que pede aparelho fixo, ancoragem esquelética ou cirurgia. Errar essa triagem é o que transforma um caso simples em refinamento sem fim.",
  },
  {
    titulo: "Respiração, DTM e o que não é dente",
    texto:
      "Obstrução nasal e disfunção temporomandibular mudam o diagnóstico e o prognóstico. São capítulos do livro porque são consulta de todo dia.",
  },
];

/** Dúvidas do colega sobre mandar o caso para cá. */
const DUVIDAS = [
  {
    pergunta: "Quem faz o setup do meu caso?",
    resposta:
      "A própria Ortoative, em Anápolis. O planejamento e a fabricação acontecem na mesma casa — o caso não é repassado a fornecedor nem sai do país.",
  },
  {
    pergunta: "E se um dente não se mover como o planejado?",
    resposta:
      "A placa nova é produzida aqui, sem reabrir pedido com terceiro. É a diferença prática de fabricar: o refinamento não depende da fila de outra empresa.",
  },
  {
    pergunta: "Preciso ser especialista em Ortodontia?",
    resposta:
      "Para tratar, sim — alinhador é tratamento ortodôntico e exige o especialista. Para acompanhar a formação, não: parte dela é justamente diagnóstico, que interessa a quem encaminha e quer encaminhar melhor.",
  },
  {
    pergunta: "Vocês atendem dentista de fora de Goiás?",
    resposta:
      "Sim. As clínicas ficam em Anápolis e Goianésia, mas o envio de caso e o acompanhamento do planejamento não dependem de você estar por perto.",
  },
  {
    pergunta: "Como funciona a parceria na prática?",
    resposta:
      "Depende do volume e do tipo de caso que você atende, e é isso que a primeira conversa resolve. Chame no WhatsApp que a gente monta o formato com você.",
  },
];

export default function ParaDentistasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-wide text-brand-green-text">
          Ortoative para dentistas
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl">Aprenda com quem fabrica.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Formação e parceria de laboratório com o Prof. Dr. Rui Cambauva — autor de dois
          livros de Ortodontia, ex-professor de quatro universidades e responsável por uma
          clínica que planeja e produz o próprio alinhador.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappLink(
              "Oi! Sou dentista e quero saber mais sobre a formação e a parceria da Ortoative."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="tatil rounded-full bg-brand-green-btn px-7 py-4 text-lg font-extrabold text-white transition-colors hover:bg-brand-green-text"
          >
            Falar com o Dr. Rui
          </a>
          <Link
            href="/alinhadores"
            className="tatil rounded-full border-2 border-primary px-7 py-4 text-lg font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Ver o laboratório
          </Link>
        </div>
      </Reveal>

      {/* ── Quem ensina ──────────────────────────────────────────────────── */}
      <section aria-labelledby="quem-ensina" className="mt-16 md:mt-24">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <h2 id="quem-ensina" className="text-3xl md:text-4xl">
              Quem ensina
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Rui David Paro Cambauva atende, dá aula e escreve sobre a mesma coisa há 26
              anos. Os livros nasceram da clínica, não o contrário — e é essa ordem que a
              formação mantém: o caso primeiro, a regra depois.
            </p>

            <ul className="mt-6 space-y-2">
              {CREDENCIAIS.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-base text-muted-foreground md:text-lg"
                >
                  <span aria-hidden="true" className="font-bold text-brand-green-text">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Foi professor em
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {UNIVERSIDADES.map((u) => (
                <li key={u} className="text-base text-muted-foreground">
                  {u}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/dentistas/rui-apresentacao.avif"
                alt="Dr. Rui Cambauva analisando um escaneamento 3D no computador"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                {...previa("/images/dentistas/rui-apresentacao.avif")}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Os livros ────────────────────────────────────────────────────── */}
      <section aria-labelledby="os-livros" className="mt-16 md:mt-24">
        <Reveal>
          <h2 id="os-livros" className="text-3xl md:text-4xl">
            Os dois livros
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
            O conteúdo da formação sai daqui. Vale a leitura mesmo para quem não vier.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {LIVROS.map((livro, i) => (
            <Reveal key={livro.titulo} delay={i * 90}>
              <article className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl font-extrabold text-primary md:text-2xl">
                  {livro.titulo}
                </h3>
                <p className="mt-1 text-base italic text-muted-foreground">
                  {livro.subtitulo}
                </p>
                <p className="mt-3 text-sm font-semibold text-brand-green-text">
                  {livro.ficha}
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {livro.resumo}
                </p>

                {livro.conteudo.length > 0 && (
                  <>
                    <p className="mt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      No sumário
                    </p>
                    <ul className="mt-2 space-y-1">
                      {livro.conteudo.map((c) => (
                        <li
                          key={c}
                          className="flex gap-2 text-base text-muted-foreground"
                        >
                          <span aria-hidden="true">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── O que você leva ──────────────────────────────────────────────── */}
      <section aria-labelledby="o-que-voce-leva" className="mt-16 md:mt-24">
        <Reveal>
          <h2 id="o-que-voce-leva" className="text-3xl md:text-4xl">
            O que você leva
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
            Os temas saem dos livros e da rotina das duas clínicas — nenhum deles é teoria
            que fica na estante.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMAS.map((tema, i) => (
            <Reveal key={tema.titulo} delay={i * 60}>
              <article className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-realce">
                <h3 className="text-lg font-extrabold text-primary">{tema.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {tema.texto}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Parceria de laboratório ──────────────────────────────────────── */}
      <section aria-labelledby="parceria" className="mt-16 md:mt-24">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal from="left" delay={120} className="md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/dentistas/rui-atendimento.avif"
                alt="Dr. Rui Cambauva atendendo em consultório"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                {...previa("/images/dentistas/rui-atendimento.avif")}
              />
            </div>
          </Reveal>

          <Reveal className="md:order-1">
            <h2 id="parceria" className="text-3xl md:text-4xl">
              Mande o seu caso para cá
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Você atende o paciente; o planejamento e a fabricação das placas ficam
              conosco, em Anápolis. Não há transporte nem fila de terceiro entre o setup
              aprovado e a primeira placa na mão do seu paciente — e o refinamento, se
              precisar, é produzido aqui mesmo.
            </p>
            <a
              href={whatsappLink(
                "Oi! Sou dentista e quero enviar um caso para o laboratório da Ortoative."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="tatil mt-6 inline-block rounded-full bg-primary px-7 py-4 text-lg font-bold text-primary-foreground transition-colors hover:bg-brand-blue"
            >
              Enviar um caso
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── Dúvidas ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="duvidas" className="mt-16 md:mt-24">
        <Reveal>
          <h2 id="duvidas" className="text-3xl md:text-4xl">
            Antes de perguntar
          </h2>
        </Reveal>

        {/* <details> nativo: acordeão sem uma linha de JavaScript. */}
        <div className="mt-8 grid gap-3">
          {DUVIDAS.map((duvida, i) => (
            <Reveal key={duvida.pergunta} delay={i * 50}>
              <details className="group rounded-2xl border border-border bg-card p-5 transition-colors open:bg-realce hover:border-primary/40">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="block text-lg font-bold text-primary">
                    {duvida.pergunta}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-2xl leading-none text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="conteudo-chega mt-3 border-t border-border pt-3 text-base leading-relaxed text-muted-foreground">
                  {duvida.resposta}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Fechamento ───────────────────────────────────────────────────── */}
      <Reveal>
        <section className="mt-16 overflow-hidden rounded-3xl bg-hero-dark p-8 text-white md:mt-24 md:p-12">
          <h2 className="text-3xl md:text-4xl">Comece por uma conversa</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            Turmas, formatos e parceria são montados conforme o que você atende hoje.
            Conte o seu caso que a gente diz por onde começar.
          </p>
          <a
            href={whatsappLink(
              "Oi! Sou dentista e quero saber mais sobre os cursos e parcerias da Ortoative."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="tatil mt-6 inline-block rounded-full bg-brand-green-btn px-8 py-4 text-lg font-extrabold text-white transition-transform hover:scale-105"
          >
            Quero aprender com o Dr. Rui
          </a>
        </section>
      </Reveal>
    </div>
  );
}
