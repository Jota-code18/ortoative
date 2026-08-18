/**
 * Quiz "Entenda qual o melhor para você".
 *
 * Substituiu a tabela comparativa. A tabela pedia que o paciente lesse oito
 * linhas e concluísse sozinho; aqui ele responde sobre si e recebe uma
 * sugestão. A conta é aberta de propósito — cada opção carrega o peso e o
 * motivo que aparece no resultado, então a sugestão sempre consegue explicar
 * de onde veio.
 *
 * Regras do desenho:
 *   - no máximo 8 perguntas em qualquer caminho (garantido em teste);
 *   - a primeira pergunta escolhe a trilha, porque quem perdeu um dente não
 *     deve responder sobre disciplina de uso de placa;
 *   - o resultado é sugestão, não diagnóstico. Quem fecha é o profissional.
 */

export type ProcedimentoId = "alinhadores" | "ortodontia-fixa" | "implantes" | "estetica";

export type TrilhaSugestao = "alinhamento" | "reposicao" | "estetica";

export type Opcao = {
  label: string;
  /** só a pergunta inicial define trilha */
  trilha?: TrilhaSugestao;
  peso: Partial<Record<ProcedimentoId, number>>;
  /** entra na lista de "por que" do resultado */
  motivo?: string;
};

export type Pergunta = { id: string; titulo: string; opcoes: Opcao[] };

export type Resposta = { perguntaId: string; opcao: Opcao };

export type Sugestao = {
  principal: ProcedimentoId;
  /** segunda colocada, quando teve pontos — vira o "também vale olhar" */
  alternativa?: ProcedimentoId;
  motivos: string[];
};

/** Ordem fixa: desempata sempre igual, sem depender da ordem das respostas. */
const ORDEM: ProcedimentoId[] = [
  "alinhadores",
  "ortodontia-fixa",
  "implantes",
  "estetica",
];

export const PROCEDIMENTOS: Record<
  ProcedimentoId,
  { nome: string; frase: string; href: string; tom: "verde" | "azul" }
> = {
  alinhadores: {
    nome: "Alinhadores Ortoative",
    frase: "Placas transparentes que você troca em casa, feitas no nosso laboratório.",
    href: "/alinhadores",
    tom: "verde",
  },
  "ortodontia-fixa": {
    nome: "Ortodontia Fixa",
    frase: "Colado aos dentes, trabalha o tempo todo — sem depender de lembrar.",
    href: "/procedimentos/ortodontia-fixa",
    tom: "azul",
  },
  implantes: {
    nome: "Implantes",
    frase: "Um dente novo com raiz própria, fixo e que morde como o seu.",
    href: "/procedimentos/implantes",
    tom: "azul",
  },
  estetica: {
    nome: "Lentes e facetas",
    frase: "Cor e formato desenhados no computador antes de qualquer desgaste.",
    href: "/procedimentos/estetica",
    tom: "verde",
  },
};

export const perguntaInicial: Pergunta = {
  id: "queixa",
  titulo: "Qual é a sua situação hoje?",
  opcoes: [
    {
      label: "Meus dentes são tortos",
      trilha: "alinhamento",
      peso: { alinhadores: 1, "ortodontia-fixa": 1 },
    },
    {
      label: "Tenho espaços entre eles",
      trilha: "alinhamento",
      peso: { alinhadores: 2, "ortodontia-fixa": 1 },
      motivo: "Fechar espaços é um dos movimentos que o alinhador faz muito bem.",
    },
    {
      label: "Minha mordida não encaixa",
      trilha: "alinhamento",
      peso: { "ortodontia-fixa": 3 },
      motivo: "Correção de mordida costuma pedir a força contínua do aparelho fixo.",
    },
    {
      label: "Usei aparelho e os dentes voltaram",
      trilha: "alinhamento",
      peso: { alinhadores: 3 },
      motivo: "Dentes que voltaram costumam ser um caso curto — território do alinhador.",
    },
    {
      label: "Perdi um ou mais dentes",
      trilha: "reposicao",
      peso: { implantes: 5 },
    },
    {
      label: "Não gosto da cor ou do formato",
      trilha: "estetica",
      peso: { estetica: 5 },
    },
  ],
};

const trilhaAlinhamento: Pergunta[] = [
  {
    id: "discricao",
    titulo: "Faz diferença para você alguém perceber o aparelho?",
    opcoes: [
      {
        label: "Faz muita diferença",
        peso: { alinhadores: 3 },
        motivo: "Discrição pesa na sua decisão, e a placa é praticamente invisível.",
      },
      { label: "Faz um pouco", peso: { alinhadores: 1 } },
      { label: "Não faz diferença", peso: { "ortodontia-fixa": 1 } },
    ],
  },
  {
    id: "rotina",
    titulo: "Como são os seus dias?",
    opcoes: [
      {
        label: "Falo com gente o tempo todo",
        peso: { alinhadores: 2 },
        motivo: "Quem aparece o dia todo ganha com um tratamento que não se anuncia.",
      },
      {
        label: "Viajo ou fico fora com frequência",
        peso: { alinhadores: 2 },
        motivo: "Viajando, você troca as placas onde estiver, sem depender de ajuste.",
      },
      { label: "Rotina tranquila, sem essa preocupação", peso: { "ortodontia-fixa": 1 } },
    ],
  },
  {
    id: "disciplina",
    titulo:
      "O alinhador fica 22 horas por dia na boca e sai só para comer e escovar. Você topa?",
    opcoes: [
      {
        label: "Topo, sou organizado",
        peso: { alinhadores: 3 },
        motivo:
          "Você tem a disciplina que o alinhador exige — é o que decide o resultado.",
      },
      {
        label: "Acho que sim, mas esqueceria às vezes",
        peso: { alinhadores: 1, "ortodontia-fixa": 1 },
      },
      {
        label: "Prefiro que não dependa de mim",
        peso: { "ortodontia-fixa": 4 },
        motivo:
          "Colado no dente, o fixo trabalha inclusive nos dias em que você esquece.",
      },
    ],
  },
  {
    id: "consultas",
    titulo: "Consegue vir à clínica com que frequência?",
    opcoes: [
      { label: "Sem problema, moro perto", peso: { "ortodontia-fixa": 1 } },
      {
        label: "Poucas vezes, moro longe ou tenho pouca agenda",
        peso: { alinhadores: 2 },
        motivo: "Com alinhador as consultas são mais espaçadas.",
      },
    ],
  },
  {
    id: "quem",
    titulo: "Quem vai fazer o tratamento?",
    opcoes: [
      {
        label: "Criança ou adolescente",
        peso: { "ortodontia-fixa": 2 },
        motivo:
          "Em criança e adolescente o fixo é mais seguro: não tem como esquecer de usar.",
      },
      { label: "Sou adulto", peso: { alinhadores: 1 } },
    ],
  },
  {
    id: "decisao",
    titulo: "E o que pesa mais na sua escolha?",
    opcoes: [
      { label: "Ninguém perceber", peso: { alinhadores: 3 } },
      {
        label: "O menor custo",
        peso: { "ortodontia-fixa": 3 },
        motivo: "O aparelho fixo costuma ser o caminho mais acessível.",
      },
      {
        label: "Resolver com o máximo de previsibilidade",
        peso: { "ortodontia-fixa": 2 },
      },
      {
        label: "Conforto no dia a dia",
        peso: { alinhadores: 2 },
        motivo: "Sem bráquete e sem fio, não há machucado na bochecha.",
      },
    ],
  },
];

const trilhaReposicao: Pergunta[] = [
  {
    id: "tempo-sem-dente",
    titulo: "Há quanto tempo você está sem o dente?",
    opcoes: [
      { label: "Faz menos de um ano", peso: { implantes: 2 } },
      {
        label: "Faz mais de um ano",
        peso: { implantes: 2 },
        motivo:
          "Sem o dente, o osso vai reabsorvendo — quanto antes avaliar, mais simples fica.",
      },
      { label: "Não saberia dizer", peso: { implantes: 1 } },
    ],
  },
  {
    id: "alinhamento-restante",
    titulo: "E os outros dentes, estão alinhados?",
    opcoes: [
      { label: "Estão alinhados", peso: { implantes: 2 } },
      {
        label: "Não, também estão tortos",
        peso: { implantes: 2, alinhadores: 2 },
        motivo:
          "Costuma valer alinhar antes, para o dente novo nascer exatamente no lugar certo.",
      },
    ],
  },
  {
    id: "protese",
    titulo: "Você usa alguma prótese hoje?",
    opcoes: [
      {
        label: "Uso ponte ou dentadura",
        peso: { implantes: 2 },
        motivo:
          "Quem já usa prótese removível é quem mais sente a diferença do implante.",
      },
      { label: "Não uso prótese nenhuma", peso: { implantes: 1 } },
    ],
  },
];

const trilhaEstetica: Pergunta[] = [
  {
    id: "incomodo-estetico",
    titulo: "O que mais te incomoda?",
    opcoes: [
      {
        label: "A cor deles",
        peso: { estetica: 2 },
        motivo: "Cor é o que lentes e facetas resolvem de forma mais direta e duradoura.",
      },
      { label: "O formato ou o tamanho", peso: { estetica: 2 } },
      {
        label: "Dentes desgastados ou lascados",
        peso: { estetica: 2 },
        motivo: "Faceta devolve o que o desgaste levou, sem precisar de aparelho.",
      },
    ],
  },
  {
    id: "base-alinhada",
    titulo: "Os seus dentes estão alinhados?",
    opcoes: [
      { label: "Estão alinhados", peso: { estetica: 2 } },
      {
        label: "Não, são tortos",
        peso: { estetica: 1, alinhadores: 3 },
        motivo:
          "Alinhar antes deixa as lentes mais finas e o resultado bem mais natural.",
      },
    ],
  },
  {
    id: "referencia",
    titulo: "Você já sabe como quer o resultado?",
    opcoes: [
      { label: "Tenho uma referência em mente", peso: { estetica: 1 } },
      {
        label: "Quero ver antes de decidir",
        peso: { estetica: 1 },
        motivo: "Você aprova a simulação do sorriso antes de qualquer desgaste.",
      },
    ],
  },
];

const TRILHAS: Record<TrilhaSugestao, Pergunta[]> = {
  alinhamento: trilhaAlinhamento,
  reposicao: trilhaReposicao,
  estetica: trilhaEstetica,
};

/**
 * Sequência completa do quiz. Antes da primeira resposta só existe a pergunta
 * inicial — a régua de progresso trata esse caso mostrando uma estimativa.
 */
export function montarPerguntas(trilha: TrilhaSugestao | null): Pergunta[] {
  return trilha ? [perguntaInicial, ...TRILHAS[trilha]] : [perguntaInicial];
}

export function calcularSugestao(respostas: Resposta[]): Sugestao {
  const pontos = new Map<ProcedimentoId, number>();
  const motivos: string[] = [];

  for (const { opcao } of respostas) {
    for (const [id, valor] of Object.entries(opcao.peso)) {
      const chave = id as ProcedimentoId;
      pontos.set(chave, (pontos.get(chave) ?? 0) + valor);
    }
    if (opcao.motivo && !motivos.includes(opcao.motivo)) motivos.push(opcao.motivo);
  }

  /* Percorre em ordem fixa e só troca quando é estritamente maior: empate fica
     com quem vem primeiro em ORDEM, e não com quem foi somado por último. */
  const ranking = ORDEM.filter((id) => (pontos.get(id) ?? 0) > 0).sort(
    (a, b) => (pontos.get(b) ?? 0) - (pontos.get(a) ?? 0)
  );

  return {
    principal: ranking[0] ?? "alinhadores",
    alternativa: ranking[1],
    /* Três é o teto: a lista é para dar confiança na sugestão, não para o
       paciente ler um relatório. */
    motivos: motivos.slice(0, 3),
  };
}

export function mensagemSugestao(respostas: Resposta[], sugestao: Sugestao): string {
  const linhas = respostas.map(({ opcao }) => `• ${opcao.label}`).join("\n");
  return [
    `Oi! Fiz o quiz no site e a sugestão foi ${PROCEDIMENTOS[sugestao.principal].nome}.`,
    "",
    "Minhas respostas:",
    linhas,
    "",
    "Quero a opinião de um profissional sobre o meu caso.",
  ].join("\n");
}
