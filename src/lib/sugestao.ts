/**
 * Quiz "Entenda qual o melhor para você".
 *
 * Substituiu a tabela comparativa. A tabela pedia que o paciente lesse oito
 * linhas e concluísse sozinho; aqui ele responde sobre si e recebe uma
 * sugestão. A conta é aberta de propósito — cada opção carrega o peso e o
 * motivo que aparece no resultado, então a sugestão sempre consegue explicar
 * de onde veio.
 *
 * Compara só alinhador e ortodontia fixa. É a dúvida real de quem chega até
 * aqui, logo depois das duas seções: abrir para implante ou lente
 * transformaria a comparação em triagem, que o quiz do topo já faz.
 *
 * Regras do desenho:
 *   - no máximo 8 perguntas (garantido em teste);
 *   - todo mundo responde a mesma sequência, então a régua de progresso é
 *     exata desde a primeira tela;
 *   - o resultado é sugestão, não diagnóstico. Quem fecha é o profissional.
 */

export type ProcedimentoId = "alinhadores" | "ortodontia-fixa";

export type Opcao = {
  label: string;
  peso: Partial<Record<ProcedimentoId, number>>;
  /** entra na lista de "por que" do resultado */
  motivo?: string;
};

export type Pergunta = { id: string; titulo: string; opcoes: Opcao[] };

export type Resposta = { perguntaId: string; opcao: Opcao };

export type Sugestao = {
  principal: ProcedimentoId;
  /** o outro tratamento, para o resultado nunca soar como veredito */
  alternativa: ProcedimentoId;
  motivos: string[];
  /** diferença pequena: os dois servem e quem decide é o exame */
  equilibrado: boolean;
};

/** Ordem fixa: desempata sempre igual, sem depender da ordem das respostas. */
const ORDEM: ProcedimentoId[] = ["alinhadores", "ortodontia-fixa"];

export const PROCEDIMENTOS: Record<
  ProcedimentoId,
  { nome: string; frase: string; href: string }
> = {
  alinhadores: {
    nome: "Alinhadores Ortoative",
    frase: "Placas transparentes que você troca em casa, feitas no nosso laboratório.",
    href: "/alinhadores",
  },
  "ortodontia-fixa": {
    nome: "Ortodontia Fixa",
    frase: "Colado aos dentes, trabalha o tempo todo — sem depender de lembrar.",
    href: "/procedimentos/ortodontia-fixa",
  },
};

/**
 * As sete perguntas, na ordem em que aparecem.
 *
 * Começa pela queixa porque é o que o visitante já tem na cabeça, e termina
 * pelo critério de decisão, que só faz sentido depois de ele pensar na rotina.
 */
export const PERGUNTAS: Pergunta[] = [
  {
    id: "queixa",
    titulo: "Qual é a sua situação hoje?",
    opcoes: [
      {
        label: "Meus dentes são tortos",
        peso: { alinhadores: 1, "ortodontia-fixa": 1 },
      },
      {
        label: "Tenho espaços entre eles",
        peso: { alinhadores: 2, "ortodontia-fixa": 1 },
        motivo: "Fechar espaços é um dos movimentos que o alinhador faz muito bem.",
      },
      {
        label: "Minha mordida não encaixa",
        peso: { "ortodontia-fixa": 3 },
        motivo: "Correção de mordida costuma pedir a força contínua do aparelho fixo.",
      },
      {
        label: "Usei aparelho e os dentes voltaram",
        peso: { alinhadores: 3 },
        motivo:
          "Dentes que voltaram costumam ser um caso curto — território do alinhador.",
      },
      {
        label: "Tenho dentes muito girados",
        peso: { "ortodontia-fixa": 3 },
        motivo: "Dente muito girado pede o controle que o bráquete dá melhor.",
      },
    ],
  },
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
      {
        label: "Rotina tranquila, sem essa preocupação",
        peso: { "ortodontia-fixa": 1 },
      },
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

  /* Parte de ORDEM e ordena por pontos: empate fica com quem vem primeiro na
     lista, e não com quem foi somado por último. */
  const ranking = [...ORDEM].sort((a, b) => (pontos.get(b) ?? 0) - (pontos.get(a) ?? 0));
  const [principal, alternativa] = ranking;
  const diferenca = (pontos.get(principal) ?? 0) - (pontos.get(alternativa) ?? 0);

  return {
    principal,
    alternativa,
    /* Três é o teto: a lista é para dar confiança na sugestão, não para o
       paciente ler um relatório. */
    motivos: motivos.slice(0, 3),
    /* Dois pontos de folga é menos que uma resposta forte vale. Abaixo disso a
       sugestão não se sustenta sozinha, e o texto do resultado assume isso em
       vez de fingir convicção. */
    equilibrado: diferenca <= 2,
  };
}

/** Pares pergunta/resposta para o e-mail da secretária. */
export function detalhesDaSugestao(respostas: Resposta[]) {
  return respostas.map(({ perguntaId, opcao }) => ({
    pergunta: PERGUNTAS.find((p) => p.id === perguntaId)?.titulo ?? perguntaId,
    resposta: opcao.label,
  }));
}

/** Resumo que o paciente leva para o WhatsApp da secretária. */
export function mensagemSugestao(
  nome: string,
  respostas: Resposta[],
  sugestao: Sugestao
): string {
  return [
    `Oi! Fiz o quiz no site da Ortoative. Meu nome é ${nome || "(não informado)"}.`,
    `• Sugestão do quiz: ${PROCEDIMENTOS[sugestao.principal].nome}`,
    ...respostas.map(({ opcao }) => `• ${opcao.label}`),
    "",
    "Quero a opinião de um profissional sobre o meu caso.",
  ].join("\n");
}
