import Link from "next/link";
import type { ReactNode } from "react";
import { whatsappLink } from "@/lib/site";

/**
 * Comparativo alinhador × ortodontia fixa.
 *
 * A leitura de referência veio de como Invisalign, ClearCorrect e afins montam
 * esse bloco: duas colunas com identidade própria, uma linha por critério em
 * frase curta e — importante — nenhuma coluna marcada como "vencedora". Aqui
 * isso é ainda mais necessário: a Ortoative faz os dois, e a ortodontia fixa
 * responde por +20.000 dos sorrisos da casa. Por isso cada linha traz o ponto
 * forte dos dois lados, e a decisão é devolvida ao caso do paciente.
 */

type Linha = {
  criterio: string;
  icone: ReactNode;
  alinhador: string;
  fixo: string;
};

const traco = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icone = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
    {children}
  </svg>
);

const linhas: Linha[] = [
  {
    criterio: "Aparência no dia a dia",
    icone: (
      <Icone>
        <path {...traco} d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
        <circle {...traco} cx="12" cy="12" r="2.6" />
      </Icone>
    ),
    alinhador: "Quase imperceptível de perto",
    fixo: "Visível — com braquetes estéticos como opção",
  },
  {
    criterio: "Na hora de comer",
    icone: (
      <Icone>
        <path {...traco} d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11" />
        <path
          {...traco}
          d="M17 3c-1.4 1.6-2 3.4-2 5.4 0 1.6.7 2.6 2 2.6h1V3h-1ZM17 11v10"
        />
      </Icone>
    ),
    alinhador: "Remove na hora da refeição e come de tudo",
    fixo: "Come normalmente, com atenção a alimentos duros",
  },
  {
    criterio: "Higiene",
    icone: (
      <Icone>
        <path {...traco} d="M9 14h6v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-6Z" />
        <path {...traco} d="M10 14V4.5a2 2 0 1 1 4 0V14M11 6.5v3M13 6.5v3" />
      </Icone>
    ),
    alinhador: "Escova a boca e a placa separadamente",
    fixo: "Exige técnica e um pouco mais de tempo",
  },
  {
    criterio: "Depende de disciplina",
    icone: (
      <Icone>
        <circle {...traco} cx="12" cy="13" r="8" />
        <path {...traco} d="M12 9v4l2.5 2M9 2h6" />
      </Icone>
    ),
    alinhador: "Sim — precisa de 22h de uso por dia",
    fixo: "Não sai da boca: trabalha sozinho",
  },
  {
    criterio: "Complexidade que resolve",
    icone: (
      <Icone>
        <path {...traco} d="M12 2.5 21 7v10l-9 4.5L3 17V7l9-4.5Z" />
        <path {...traco} d="M12 7.5 16.5 10v4L12 16.5 7.5 14v-4L12 7.5Z" />
      </Icone>
    ),
    alinhador: "Boa parte dos casos, com planejamento digital",
    fixo: "Alcança os casos mais difíceis, inclusive cirúrgicos",
  },
  {
    criterio: "Ritmo de consultas",
    icone: (
      <Icone>
        <rect {...traco} x="3" y="5" width="18" height="16" rx="2.5" />
        <path {...traco} d="M3 10h18M8 3v4M16 3v4" />
      </Icone>
    ),
    alinhador: "Menos idas à clínica ao longo do tratamento",
    fixo: "Ajustes mais frequentes, com acompanhamento de perto",
  },
];

const melhorPara = {
  alinhador: "Quem prioriza discrição e tem rotina para manter as 22h de uso.",
  fixo: "Quem quer resultado sem depender de lembrar de recolocar a placa.",
};

/** cabeçalho de cada coluna: cor própria, nome e uma linha de posicionamento */
function Painel({
  nome,
  resumo,
  tom,
}: {
  nome: string;
  resumo: string;
  tom: "verde" | "azul";
}) {
  const verde = tom === "verde";
  return (
    <div
      className="rounded-xl px-3 py-3 text-center md:px-4"
      style={{
        background: verde
          ? "color-mix(in oklch, var(--brand-green) 12%, transparent)"
          : "color-mix(in oklch, var(--primary) 10%, transparent)",
      }}
    >
      <span
        aria-hidden="true"
        className="mx-auto mb-2 block h-1 w-10 rounded-full"
        style={{ background: verde ? "var(--brand-green-btn)" : "var(--primary)" }}
      />
      {/* Nível 1 da hierarquia: o nome do tratamento. É o maior e o mais
          escuro do bloco — quem bate o olho lê isto primeiro. */}
      <span
        className={`block text-base font-extrabold leading-tight md:text-xl ${
          verde ? "text-brand-green-text" : "text-primary"
        }`}
      >
        {nome}
      </span>
      {/* Nível 3: rótulo de apoio. Caixa alta e pequeno para ler como etiqueta,
          não como frase — assim não compete com o nome logo acima. */}
      <span className="mt-1.5 block text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {resumo}
      </span>
    </div>
  );
}

export default function ComparativoTratamentos() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="px-4 pt-6 text-center md:px-8">
        <p className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-green-text">
          Comparativo
        </p>
        <h3 className="text-2xl md:text-4xl">Entenda qual o melhor para você!</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Os dois corrigem — e aqui fazemos os dois. A diferença não é qualidade, é
          rotina: o que o seu caso pede e o que combina com o seu dia a dia.
        </p>
      </div>

      <div className="px-3 pb-2 pt-5 md:px-6">
        <table className="w-full text-left text-sm max-md:block md:text-base">
          <caption className="sr-only">
            Comparativo entre alinhadores Ortoative e ortodontia fixa, por critério.
          </caption>

          <thead className="max-md:block">
            <tr className="max-md:grid max-md:grid-cols-2 max-md:gap-2">
              <th scope="col" className="w-[26%] p-2 align-bottom max-md:hidden">
                <span className="sr-only">Critério</span>
              </th>
              <th scope="col" className="p-2 align-bottom">
                <Painel
                  nome="Alinhadores Ortoative"
                  resumo="Discreto e removível"
                  tom="verde"
                />
              </th>
              <th scope="col" className="p-2 align-bottom">
                <Painel
                  nome="Ortodontia Fixa"
                  resumo="Constante e resolutiva"
                  tom="azul"
                />
              </th>
            </tr>
          </thead>

          <tbody className="max-md:block">
            {linhas.map(({ criterio, icone, alinhador, fixo }) => (
              <tr
                key={criterio}
                className="border-t border-border/70 transition-colors hover:bg-realce max-md:mt-3 max-md:grid max-md:grid-cols-2 max-md:gap-x-2 max-md:rounded-2xl max-md:border max-md:border-border/70 max-md:p-3"
              >
                {/* Nível 2: o critério. Cor de texto cheia e peso alto contra
                    as respostas, que ficam em cinza — é o que dá o "leia esta
                    linha, depois compare os dois lados". */}
                <th
                  scope="row"
                  className="p-3 text-left align-middle max-md:col-span-2 max-md:p-0 max-md:pb-2.5"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-brand-green-text">{icone}</span>
                    <span className="text-base font-bold text-foreground md:text-lg">
                      {criterio}
                    </span>
                  </span>
                </th>

                <td className="p-3 align-middle leading-snug text-muted-foreground max-md:p-0">
                  <span
                    aria-hidden="true"
                    className="mb-1 block text-sm font-bold uppercase tracking-wide text-brand-green-text md:hidden"
                  >
                    Alinhadores
                  </span>
                  {alinhador}
                </td>

                <td className="p-3 align-middle leading-snug text-muted-foreground max-md:p-0">
                  <span
                    aria-hidden="true"
                    className="mb-1 block text-sm font-bold uppercase tracking-wide text-primary md:hidden"
                  >
                    Fixa
                  </span>
                  {fixo}
                </td>
              </tr>
            ))}

            {/* Fecha o comparativo devolvendo a escolha ao paciente, em vez de
                declarar um vencedor. */}
            <tr className="border-t border-border/70 max-md:mt-3 max-md:grid max-md:grid-cols-2 max-md:gap-x-2 max-md:rounded-2xl max-md:border max-md:border-border/70 max-md:p-3">
              <th
                scope="row"
                className="p-3 text-left align-top font-semibold max-md:col-span-2 max-md:p-0 max-md:pb-2"
              >
                Melhor para
              </th>
              <td className="p-3 align-top max-md:p-0">
                <span
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-green-text max-md:px-2 md:text-base"
                  style={{
                    background:
                      "color-mix(in oklch, var(--brand-green) 12%, transparent)",
                  }}
                >
                  {melhorPara.alinhador}
                </span>
              </td>
              <td className="p-3 align-top max-md:p-0">
                <span
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary max-md:px-2 md:text-base"
                  style={{
                    background: "color-mix(in oklch, var(--primary) 10%, transparent)",
                  }}
                >
                  {melhorPara.fixo}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-border bg-realce px-4 py-5 text-center md:px-8">
        <p className="text-sm font-semibold md:text-base">
          Ainda na dúvida? Quem decide é o seu caso — não o folheto.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/agende"
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-blue md:text-base"
          >
            Fazer a avaliação gratuita
          </Link>
          <a
            href={whatsappLink(
              "Oi! Quero entender se alinhador ou aparelho fixo é melhor pro meu caso."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2 py-3 text-sm font-bold text-brand-green-text underline-offset-4 hover:underline md:text-base"
          >
            Tirar a dúvida no WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
