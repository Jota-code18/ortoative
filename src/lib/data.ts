/** Dados vindos do Notion — "Ortoative - Site Institucional" */

export type Profissional = {
  slug: string;
  nome: string;
  /** Área de atuação — destaque do card */
  titulo: string;
  cro?: string;
  formacao: string[];
  especializacoes: string[];
  /** Linhas extras (autoria, docência, cargos) — só quem tem */
  destaques?: string[];
  foto: string; // caminho esperado em public/images/equipe/
};

/** 5 de 9 profissionais — restante chega depois */
export const equipe: Profissional[] = [
  {
    slug: "rui-cambauva",
    nome: "Prof. Dr. Rui David Paro Cambauva",
    titulo: "CEO · Ortodontia, Radiologia e Implantodontia",
    formacao: ["Universidade de Ribeirão Preto – UNAERP-SP"],
    especializacoes: [
      "Esp., Me. e Dr. em Ortodontia",
      "Esp. e Me. em Radiologia",
      "Esp. em Implantodontia",
    ],
    destaques: [
      "Autor de ORTODONTIA – Diagnóstico Clínico & Cefalométrico",
      "Autor de Construindo VTO: guia passo-a-passo",
      "Ex-professor da UNAERP, UNIFEB (Barretos-SP), SLMANDIC (Campinas-SP) e FUNORTE (Anápolis-GO)",
      "Clínicas em Anápolis e Goianésia – GO",
      "CEO da Ortoative Especialidades",
    ],
    foto: "/images/equipe/rui.avif",
  },
  {
    slug: "adriana-cambauva",
    nome: "Adriana Lopes de Oliveira Cambauva",
    titulo: "Ortodontia",
    cro: "CRO-GO 5587",
    formacao: ["Universidade de Ribeirão Preto – UNAERP"],
    especializacoes: [
      "Especialização e mestrado em Ortodontia — Universidade São Leopoldo Mandic",
    ],
    foto: "/images/equipe/adriana.avif",
  },
  {
    slug: "jessica-fonseca",
    nome: "Jessica de Almeida Andrade Fonseca",
    titulo: "Prótese Dentária",
    cro: "CRO 15402",
    formacao: [
      "Bacharel em Odontologia — Centro Universitário de Anápolis, UniEvangélica (2013–2017)",
    ],
    especializacoes: [
      "Especialista em Prótese Dentária — Instituto Lenza de Pós-Graduação, Goiânia-GO (2018–2020)",
    ],
    foto: "/images/equipe/jessica.avif",
  },
  {
    slug: "isabella-barcelos",
    nome: "Isabella Sifuentes Barcelos",
    titulo: "Prótese Dentária · Odontologia Hospitalar",
    cro: "CRO 14941",
    formacao: [
      "Bacharel em Odontologia — Centro Universitário de Anápolis, UniEvangélica (2013–2017)",
    ],
    especializacoes: [
      "Especialista em Odontologia Hospitalar — Hospital Israelita Albert Einstein-SP (2019)",
      "Especialista em Prótese Dentária — UFG (2022–2024)",
    ],
    foto: "/images/equipe/isabella.avif",
  },
  {
    slug: "priscilla-carvalho",
    nome: "Priscilla Suelen Oliveira Carvalho",
    titulo: "Periodontia · Prótese",
    cro: "CRO 14389",
    formacao: ["UFPE — Universidade Federal de Pernambuco"],
    especializacoes: [
      "Especialista em Periodontia",
      "Prótese dentária e implantossuportada",
    ],
    foto: "/images/equipe/priscilla.avif",
  },
];

export type Unidade = {
  slug: string;
  nome: string;
  /** partes separadas porque o JSON-LD pede logradouro, cidade e CEP em campos próprios */
  rua: string;
  bairro?: string;
  cidade: string;
  uf: string;
  cep?: string;
  fachada: string;
  interiores: { src: string; alt: string }[];
  modelo3d: string;
};

/** endereço em uma linha, do jeito que aparece na tela */
export const enderecoDe = (u: Unidade) =>
  [u.rua, u.bairro, `${u.cidade} — ${u.uf}`].filter(Boolean).join(", ");

/** As duas unidades da Ortoative, cada uma com fotos e passeio 3D próprios */
export const unidades: Unidade[] = [
  {
    slug: "anapolis",
    nome: "Anápolis",
    rua: "Rua Francisco da Luz Bastos, 150",
    cidade: "Anápolis",
    uf: "GO",
    cep: "75110-270",
    fachada: "/images/clinica/fachada.avif",
    interiores: [
      { src: "/images/clinica/interior-01.avif", alt: "Sala de espera da unidade de Anápolis" },
      { src: "/images/clinica/interior-02.avif", alt: "Recepção da unidade de Anápolis" },
      { src: "/images/clinica/interior-03.avif", alt: "Consultório da unidade de Anápolis" },
    ],
    modelo3d: "/models/clinica.glb",
  },
  {
    slug: "goianesia",
    nome: "Goianésia",
    /* Lido da placa na fachada (Av. Goiás, Qd. 256, Lt. 29) — confirmar com a clínica */
    rua: "Av. Goiás, 1231",
    bairro: "Setor Sul",
    cidade: "Goianésia",
    uf: "GO",
    fachada: "/images/goianesia/fachada.avif",
    interiores: [
      { src: "/images/goianesia/interior-01.avif", alt: "Recepção da unidade de Goianésia" },
      { src: "/images/goianesia/interior-02.avif", alt: "Consultórios da unidade de Goianésia" },
      { src: "/images/goianesia/interior-03.avif", alt: "Consultório da unidade de Goianésia" },
    ],
    modelo3d: "/models/clinicagoianesia.glb",
  },
];

/** Etapas da fabricação própria, com as fotos reais do laboratório */
export const fabrica = [
  {
    src: "/images/fabrica/impressoras.avif",
    alt: "Impressoras 3D do laboratório da Ortoative",
    titulo: "Impressão 3D própria",
    texto:
      "O parque de impressoras roda todos os dias produzindo os modelos de cada paciente. Nada sai daqui para ser feito por terceiros.",
  },
  {
    src: "/images/fabrica/laboratorio.avif",
    alt: "Laboratório de produção dos alinhadores da Ortoative",
    titulo: "Laboratório próprio",
    texto:
      "A produção fica na mesma cidade em que você é atendido — o que encurta o prazo entre o planejamento e a entrega da primeira placa.",
  },
  {
    src: "/images/fabrica/acabamento.avif",
    alt: "Etapa de acabamento e polimento do alinhador",
    titulo: "Acabamento manual",
    texto:
      "Cada alinhador é recortado, polido e conferido à mão. É essa etapa que faz a borda não machucar a gengiva.",
  },
  {
    src: "/images/fabrica/modelos.avif",
    alt: "Modelos das arcadas impressos em 3D, um para cada etapa do tratamento",
    titulo: "Um modelo por etapa",
    texto:
      "Cada modelo impresso corresponde a um passo do tratamento. Enfileirados, formam o caminho que os dentes vão percorrer.",
  },
];

export type Procedimento = {
  slug: string;
  nome: string;
  resumo: string;
  imagem: string; // caminho esperado em public/images/procedimentos/
};

/**
 * Procedimentos além de alinhadores/orto fixa/implantes/estética.
 * Os resumos explicam o que o tratamento faz na prática — termo técnico só
 * quando o paciente vai ouvir na consulta.
 */
export const procedimentosGrade: Procedimento[] = [
  {
    slug: "protese",
    nome: "Prótese",
    resumo:
      "Repõe dentes perdidos com peças fixas ou removíveis, devolvendo mastigação, fala e aparência natural.",
    imagem: "/images/procedimentos/protese.avif",
  },
  {
    slug: "canal",
    nome: "Canal",
    resumo:
      "Trata a parte interna do dente inflamada ou infeccionada. Acaba com a dor e preserva o dente em vez de extrair.",
    imagem: "/images/procedimentos/canal.avif",
  },
  {
    slug: "gengivas",
    nome: "Tratamento de Gengivas",
    resumo:
      "Cuida da gengiva e do osso que sustentam os dentes. Sangramento, retração e mau hálito têm tratamento.",
    imagem: "/images/procedimentos/gengivas.avif",
  },
  {
    slug: "cirurgias",
    nome: "Cirurgias",
    resumo:
      "Extração de sisos e outras cirurgias da boca, com planejamento por imagem e recuperação acompanhada de perto.",
    imagem: "/images/procedimentos/cirurgias.avif",
  },
];

/** Números oficiais da clínica */
export const stats = [
  { valor: "26+", rotulo: "anos de história" },
  { valor: "+40.000", rotulo: "sorrisos transformados" },
  { valor: "+50.000", rotulo: "pacientes atendidos" },
  { valor: "+6", rotulo: "procedimentos oferecidos" },
];

export type Depoimento = {
  nome: string;
  idade?: number;
  procedimento: string;
  texto: string;
};

/** TODO: depoimentos reais (Instagram permitido) */
export const depoimentos: Depoimento[] = [
  { nome: "Paciente 1", idade: 24, procedimento: "Alinhadores", texto: "Depoimento real a inserir." },
  { nome: "Paciente 2", idade: 58, procedimento: "Implantes", texto: "Depoimento real a inserir." },
  { nome: "Paciente 3", idade: 31, procedimento: "Estética", texto: "Depoimento real a inserir." },
];
