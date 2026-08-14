import Link from "next/link";
import { whatsappLink } from "@/lib/site";

/**
 * Comparativo alinhador × ortodontia fixa.
 *
 * A versão anterior respondia cada critério com uma frase por coluna. No
 * celular isso não cabia: ou empilhava as duas colunas e dobrava a altura, ou
 * mostrava uma de cada vez e tirava justamente a comparação, que é o motivo de
 * a tabela existir.
 *
 * Pergunta com marca de resposta resolve os dois: a linha inteira cabe em duas
 * colunas estreitas, e o visitante vê os dois tratamentos de uma olhada só,
 * sem rolar.
 *
 * As perguntas são escolhidas para cada lado ganhar as suas — três e três, com
 * um empate no fim. Não é diplomacia: a Ortoative faz os dois, +20.000 dos
 * sorrisos da casa vieram do aparelho fixo, e tabela em que uma coluna ganha
 * tudo só ensina o paciente a desconfiar dela.
 */

type Marca = "sim" | "parcial" | "nao";

type Linha = {
  pergunta: string;
  alinhador: Marca;
  fixo: Marca;
  /** contexto curto, quando a resposta sozinha enganaria */
  nota?: string;
};

/**
 * As linhas absorvem os itens que ficavam com marca de conferido ao lado das
 * imagens do carrossel. Lá eles eram só elogio de cada lado; aqui viram
 * comparação, que é o que ajuda a decidir.
 */
const LINHAS: Linha[] = [
  { pergunta: "Dá para tirar na hora de comer?", alinhador: "sim", fixo: "nao" },
  {
    pergunta: "Passa despercebido de perto?",
    alinhador: "sim",
    fixo: "parcial",
    nota: "o fixo tem versão com braquete estético",
  },
  { pergunta: "Escova os dentes sem técnica especial?", alinhador: "sim", fixo: "nao" },
  { pergunta: "Exige menos idas à clínica?", alinhador: "sim", fixo: "nao" },
  {
    pergunta: "Trabalha sem depender da sua disciplina?",
    alinhador: "nao",
    fixo: "sim",
    nota: "o alinhador precisa de 22h por dia",
  },
  {
    pergunta: "Alcança os casos mais complexos?",
    alinhador: "parcial",
    fixo: "sim",
    nota: "o alinhador resolve boa parte deles",
  },
  { pergunta: "Costuma custar menos?", alinhador: "parcial", fixo: "sim" },
  { pergunta: "Mesma equipe do começo ao fim?", alinhador: "sim", fixo: "sim" },
];

/** Quem se dá melhor com cada tratamento — saiu da tabela e virou seção. */
const MELHOR_PARA = [
  {
    nome: "Alinhadores Ortoative",
    verde: true,
    texto: "Quem prioriza discrição e tem rotina para manter as 22 horas de uso por dia.",
  },
  {
    nome: "Ortodontia Fixa",
    verde: false,
    texto:
      "Quem quer o resultado sem precisar lembrar de nada — e os casos que pedem os movimentos mais difíceis.",
  },
];

/**
 * Três estados, não dois.
 *
 * "Em parte" é a resposta honesta em algumas linhas, e forçá-la para sim ou não
 * seria mentir para caber no desenho. O símbolo vem com texto para leitor de
 * tela: marca sozinha não comunica nada a quem não enxerga.
 */
function Resposta({ marca }: { marca: Marca }) {
  const { simbolo, leitura, classe } = {
    sim: { simbolo: "✓", leitura: "sim", classe: "text-brand-green-text" },
    parcial: { simbolo: "~", leitura: "em parte", classe: "text-muted-foreground" },
    nao: { simbolo: "—", leitura: "não", classe: "text-muted-foreground/50" },
  }[marca];

  return (
    <span className={`text-xl font-bold leading-none md:text-2xl ${classe}`}>
      <span aria-hidden="true">{simbolo}</span>
      <span className="sr-only">{leitura}</span>
    </span>
  );
}

export default function ComparativoTratamentos() {
  return (
    <div>
      {/* Sem cartão nem borda em volta: a tabela é continuação do bloco de
          cima, não um objeto separado boiando embaixo dele. */}
      <h3 className="text-center text-2xl md:text-3xl">
        Entenda qual o melhor para você
      </h3>

      <table className="mt-4 w-full border-collapse text-left md:mt-5">
        <caption className="sr-only">
          Comparativo entre alinhadores Ortoative e ortodontia fixa. Cada linha é uma
          pergunta, respondida para os dois tratamentos.
        </caption>

        <thead>
          <tr className="border-b-2 border-border">
            <th scope="col" className="pb-2">
              <span className="sr-only">Pergunta</span>
            </th>
            <th scope="col" className="w-[4.5rem] pb-2 text-center md:w-36">
              <span className="block text-sm font-extrabold leading-tight text-brand-green-text md:text-base">
                Alinhadores
              </span>
            </th>
            <th scope="col" className="w-[4.5rem] pb-2 text-center md:w-36">
              <span className="block text-sm font-extrabold leading-tight text-primary md:text-base">
                Ortodontia Fixa
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {LINHAS.map((l) => (
            <tr
              key={l.pergunta}
              className="border-b border-border/60 transition-colors hover:bg-realce"
            >
              <th scope="row" className="py-2.5 pr-3 align-middle font-normal">
                <span className="block text-sm font-semibold leading-snug text-foreground md:text-base">
                  {l.pergunta}
                </span>
                {l.nota && (
                  <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                    {l.nota}
                  </span>
                )}
              </th>
              <td className="py-2.5 text-center align-middle">
                <Resposta marca={l.alinhador} />
              </td>
              <td className="py-2.5 text-center align-middle">
                <Resposta marca={l.fixo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-sm text-muted-foreground">
        <span aria-hidden="true" className="font-bold">
          ~
        </span>{" "}
        quer dizer &ldquo;em parte&rdquo;: depende do seu caso, e é isso que a avaliação
        esclarece.
      </p>

      {/* ── Melhor para, agora fora da tabela ───────────────────────────── */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {MELHOR_PARA.map((m) => (
          <div
            key={m.nome}
            className="rounded-2xl p-5"
            style={{
              background: m.verde
                ? "color-mix(in oklch, var(--brand-green) 12%, transparent)"
                : "color-mix(in oklch, var(--primary) 10%, transparent)",
            }}
          >
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Melhor para
            </p>
            <p
              className={`mt-1 text-lg font-extrabold md:text-xl ${
                m.verde ? "text-brand-green-text" : "text-primary"
              }`}
            >
              {m.nome}
            </p>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {m.texto}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#avaliacao"
          className="tatil rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-blue md:text-base"
        >
          Descobrir qual é o meu caso
        </Link>
        <a
          href={whatsappLink(
            "Oi! Quero entender se alinhador ou aparelho fixo é melhor para mim."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="tatil inline-block px-2 py-3 text-sm font-bold text-brand-green-text underline-offset-4 hover:underline md:text-base"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
