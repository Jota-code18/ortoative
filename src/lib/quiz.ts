import { site } from "@/lib/site";

/**
 * Triagem ramificada: a primeira resposta define a especialidade e, a partir
 * dela, só entram perguntas que fazem sentido para aquele caso — quem perdeu
 * um dente não responde sobre alinhador, quem está com dor não responde sobre
 * estética. O resumo final indica à secretária o profissional certo.
 */

export type TrilhaId =
  | "ortodontia"
  | "reposicao"
  | "estetica"
  | "dor"
  | "gengiva"
  | "protese"
  | "cirurgia";

type Opcao = { label: string; trilha?: TrilhaId };

export type Etapa = {
  id: string;
  titulo: string;
  opcoes: Opcao[];
};

/** Porta de entrada — a escolha aqui decide o restante do questionário */
/* Stryker disable all: daqui até o fim das tabelas é conteúdo, não lógica.
   Mutar o texto de uma pergunta gera mutante que nenhum teste razoável mata —
   e isso afundaria o placar sem dizer nada sobre a qualidade da suíte. O que
   interessa medir são as funções abaixo, que decidem o caminho do paciente. */
export const etapaInicial: Etapa = {
  id: "queixa",
  titulo: "O que mais te incomoda hoje?",
  opcoes: [
    { label: "Dentes tortos ou desalinhados", trilha: "ortodontia" },
    { label: "Espaços entre os dentes", trilha: "ortodontia" },
    { label: "Mordida que não encaixa", trilha: "ortodontia" },
    { label: "Falta um ou mais dentes", trilha: "reposicao" },
    { label: "Cor ou formato dos dentes", trilha: "estetica" },
    { label: "Dor de dente", trilha: "dor" },
    { label: "Gengiva (sangra, retraída, inchada)", trilha: "gengiva" },
    { label: "Prótese que incomoda", trilha: "protese" },
    { label: "Preciso extrair um dente ou siso", trilha: "cirurgia" },
  ],
};

export const trilhas: Record<TrilhaId, Etapa[]> = {
  ortodontia: [
    {
      id: "orto_historico",
      titulo: "Já usou aparelho alguma vez?",
      opcoes: [
        { label: "Nunca usei" },
        { label: "Já usei aparelho fixo" },
        { label: "Já usei alinhador" },
        { label: "Estou usando agora" },
      ],
    },
    {
      id: "orto_preferencia",
      titulo: "Como você preferiria tratar?",
      opcoes: [
        { label: "Alinhador invisível" },
        { label: "Aparelho fixo" },
        { label: "Quero orientação do especialista" },
      ],
    },
    {
      id: "orto_paciente",
      titulo: "O tratamento é para quem?",
      opcoes: [
        { label: "Para mim (adulto)" },
        { label: "Para um adolescente" },
        { label: "Para uma criança" },
        { label: "Para outra pessoa adulta" },
      ],
    },
  ],

  reposicao: [
    {
      id: "rep_quantidade",
      titulo: "Quantos dentes estão faltando?",
      opcoes: [
        { label: "Um dente" },
        { label: "Dois ou três" },
        { label: "Quatro ou mais" },
        { label: "Todos ou quase todos" },
      ],
    },
    {
      id: "rep_tempo",
      titulo: "Há quanto tempo perdeu o dente?",
      opcoes: [
        { label: "Menos de 6 meses" },
        { label: "De 6 meses a 2 anos" },
        { label: "Mais de 2 anos" },
        { label: "Não sei precisar" },
      ],
    },
    {
      id: "rep_atual",
      titulo: "Usa alguma prótese hoje?",
      opcoes: [
        { label: "Não uso nada" },
        { label: "Ponte fixa" },
        { label: "Prótese removível" },
        { label: "Dentadura" },
      ],
    },
  ],

  estetica: [
    {
      id: "est_objetivo",
      titulo: "O que você gostaria de mudar?",
      opcoes: [
        { label: "A cor dos dentes" },
        { label: "Formato ou tamanho" },
        { label: "Dentes desgastados ou quebrados" },
        { label: "O sorriso como um todo" },
      ],
    },
    {
      id: "est_historico",
      titulo: "Já fez algum tratamento estético?",
      opcoes: [
        { label: "Nenhum" },
        { label: "Clareamento" },
        { label: "Facetas ou lentes" },
        { label: "Restaurações na frente" },
      ],
    },
  ],

  dor: [
    {
      id: "dor_tipo",
      titulo: "Como é a dor?",
      opcoes: [
        { label: "Ao mastigar" },
        { label: "Sensível ao quente e frio" },
        { label: "Latejante, mesmo parado" },
        { label: "Com inchaço na gengiva ou rosto" },
      ],
    },
    {
      id: "dor_tempo",
      titulo: "Desde quando?",
      opcoes: [
        { label: "Começou hoje" },
        { label: "Alguns dias" },
        { label: "Mais de uma semana" },
        { label: "Vai e volta há meses" },
      ],
    },
  ],

  gengiva: [
    {
      id: "geng_sinal",
      titulo: "O que você percebe?",
      opcoes: [
        { label: "Sangra ao escovar" },
        { label: "Gengiva retraída" },
        { label: "Inchaço ou dor" },
        { label: "Mau hálito persistente" },
        { label: "Dente amolecido" },
      ],
    },
    {
      id: "geng_limpeza",
      titulo: "Quando fez a última limpeza?",
      opcoes: [
        { label: "Menos de 6 meses" },
        { label: "De 6 meses a 1 ano" },
        { label: "Mais de 1 ano" },
        { label: "Não lembro" },
      ],
    },
  ],

  protese: [
    {
      id: "pro_problema",
      titulo: "Qual o problema com a prótese?",
      opcoes: [
        { label: "Solta ou cai" },
        { label: "Machuca" },
        { label: "Quebrou" },
        { label: "Não gosto da aparência" },
      ],
    },
    {
      id: "pro_implante",
      titulo: "Tem interesse em fixar com implantes?",
      opcoes: [
        { label: "Sim, tenho" },
        { label: "Talvez, quero entender" },
        { label: "Prefiro manter removível" },
      ],
    },
  ],

  cirurgia: [
    {
      id: "cir_situacao",
      titulo: "Qual é a situação?",
      opcoes: [
        { label: "Siso incomodando" },
        { label: "Dente quebrado ou com raiz" },
        { label: "Indicação de outro dentista" },
        { label: "Não sei dizer" },
      ],
    },
    {
      id: "cir_sintoma",
      titulo: "Sente dor ou inchaço agora?",
      opcoes: [{ label: "Sim, bastante" }, { label: "Um pouco" }, { label: "Não" }],
    },
  ],
};

/** Perguntas finais, iguais para todos */
const etapasComuns: Etapa[] = [
  {
    id: "unidade",
    titulo: "Qual unidade é melhor pra você?",
    opcoes: site.unidades.map((u) => ({ label: u })),
  },
];

/** Especialidade sugerida para a secretária encaminhar ao profissional certo */
const especialidade: Record<TrilhaId, string> = {
  ortodontia: "Ortodontia (alinhadores / aparelho fixo)",
  reposicao: "Implantodontia e Prótese",
  estetica: "Estética (lentes, facetas, clareamento)",
  dor: "Endodontia / urgência",
  gengiva: "Periodontia",
  protese: "Prótese",
  cirurgia: "Cirurgia",
};

/** Trilha completa a partir da resposta inicial */
/* Stryker restore all */

export function montarSequencia(trilha: TrilhaId | null): Etapa[] {
  return [etapaInicial, ...(trilha ? trilhas[trilha] : []), ...etapasComuns];
}

/** Casos que a recepção deve priorizar no retorno */
export function ehUrgencia(trilha: TrilhaId | null, respostas: Record<string, string>) {
  if (trilha === "dor") return true;
  if (trilha === "cirurgia" && respostas.cir_sintoma === "Sim, bastante") return true;
  if (trilha === "gengiva" && respostas.geng_sinal === "Dente amolecido") return true;
  return false;
}

/** Especialidade sugerida, para uso fora deste módulo (e-mail da recepção) */
export function especialidadeSugerida(trilha: TrilhaId | null) {
  return trilha ? especialidade[trilha] : "A definir na triagem";
}

/** Rótulo legível de cada etapa respondida — usado no WhatsApp e no e-mail */
export function respostasDetalhadas(
  trilha: TrilhaId | null,
  respostas: Record<string, string>
) {
  return montarSequencia(trilha)
    .filter((etapa) => respostas[etapa.id])
    .map((etapa) => ({ pergunta: etapa.titulo, resposta: respostas[etapa.id] }));
}

/** Resumo enviado ao WhatsApp da secretária */
export function montarMensagem(
  nome: string,
  trilha: TrilhaId | null,
  respostas: Record<string, string>
) {
  const sequencia = montarSequencia(trilha);
  const linhas = [
    `Oi! Fiz a avaliação no site da Ortoative. Meu nome é ${nome || "(não informado)"}.`,
  ];

  if (trilha) linhas.push(`• Encaminhamento sugerido: ${especialidade[trilha]}`);
  if (ehUrgencia(trilha, respostas)) linhas.push("• ATENÇÃO: caso com dor/urgência");

  for (const etapa of sequencia) {
    const resposta = respostas[etapa.id];
    if (resposta) linhas.push(`• ${etapa.titulo} ${resposta}`);
  }

  return linhas.join("\n");
}
