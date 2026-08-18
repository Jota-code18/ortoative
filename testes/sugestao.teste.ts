import { describe, expect, it } from "vitest";
import {
  calcularSugestao,
  mensagemSugestao,
  montarPerguntas,
  type Opcao,
  type Pergunta,
  PROCEDIMENTOS,
  perguntaInicial,
  type Resposta,
  type TrilhaSugestao,
} from "@/lib/sugestao";

const TRILHAS: TrilhaSugestao[] = ["alinhamento", "reposicao", "estetica"];

/** Percorre um caminho escolhendo a opção pelo rótulo. */
function responder(rotulos: string[]): Resposta[] {
  let trilha: TrilhaSugestao | null = null;
  const respostas: Resposta[] = [];

  for (const rotulo of rotulos) {
    /* Anotados de propósito: sem isso o TS vê um ciclo — `trilha` sai de
       `opcao`, que sai de `pergunta`, que sai de `trilha`. */
    const pergunta: Pergunta = montarPerguntas(trilha)[respostas.length];
    const opcao: Opcao | undefined = pergunta.opcoes.find((o) => o.label === rotulo);
    if (!opcao) throw new Error(`opção "${rotulo}" não existe em ${pergunta.id}`);
    if (opcao.trilha) trilha = opcao.trilha;
    respostas.push({ perguntaId: pergunta.id, opcao });
  }

  return respostas;
}

describe("montarPerguntas", () => {
  it("mostra só a queixa antes de a trilha existir", () => {
    expect(montarPerguntas(null)).toEqual([perguntaInicial]);
  });

  it("nenhum caminho passa de 8 perguntas", () => {
    /* Oito é o limite acordado: acima disso o visitante abandona no meio e o
       quiz deixa de entregar sugestão nenhuma. */
    for (const trilha of TRILHAS) {
      expect(montarPerguntas(trilha).length).toBeLessThanOrEqual(8);
    }
  });

  it("começa sempre pela queixa", () => {
    for (const trilha of TRILHAS) {
      expect(montarPerguntas(trilha)[0]).toBe(perguntaInicial);
    }
  });

  it("toda opção tem peso para algum procedimento", () => {
    // opção sem peso é resposta que não influencia nada — sintoma de esquecimento
    const todas: Opcao[] = TRILHAS.flatMap((t) =>
      montarPerguntas(t).flatMap((p) => p.opcoes)
    );
    for (const opcao of todas) {
      expect(Object.keys(opcao.peso).length).toBeGreaterThan(0);
    }
  });

  it("cada trilha tem ids de pergunta únicos", () => {
    for (const trilha of TRILHAS) {
      const ids = montarPerguntas(trilha).map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("calcularSugestao", () => {
  it("sugere alinhadores para quem quer discrição e tem disciplina", () => {
    const s = calcularSugestao(
      responder([
        "Meus dentes são tortos",
        "Faz muita diferença",
        "Falo com gente o tempo todo",
        "Topo, sou organizado",
        "Poucas vezes, moro longe ou tenho pouca agenda",
        "Sou adulto",
        "Ninguém perceber",
      ])
    );

    expect(s.principal).toBe("alinhadores");
    expect(s.alternativa).toBe("ortodontia-fixa");
  });

  it("sugere ortodontia fixa para mordida e falta de disciplina", () => {
    const s = calcularSugestao(
      responder([
        "Minha mordida não encaixa",
        "Não faz diferença",
        "Rotina tranquila, sem essa preocupação",
        "Prefiro que não dependa de mim",
        "Sem problema, moro perto",
        "Criança ou adolescente",
        "O menor custo",
      ])
    );

    expect(s.principal).toBe("ortodontia-fixa");
  });

  it("sugere implantes para quem perdeu dente", () => {
    const s = calcularSugestao(
      responder([
        "Perdi um ou mais dentes",
        "Faz mais de um ano",
        "Estão alinhados",
        "Não uso prótese nenhuma",
      ])
    );

    expect(s.principal).toBe("implantes");
    expect(s.alternativa).toBeUndefined();
  });

  it("dentes tortos junto com dente faltando levantam o alinhamento como alternativa", () => {
    const s = calcularSugestao(
      responder([
        "Perdi um ou mais dentes",
        "Faz menos de um ano",
        "Não, também estão tortos",
        "Uso ponte ou dentadura",
      ])
    );

    expect(s.principal).toBe("implantes");
    expect(s.alternativa).toBe("alinhadores");
  });

  it("sugere lentes para queixa de cor com base alinhada", () => {
    const s = calcularSugestao(
      responder([
        "Não gosto da cor ou do formato",
        "A cor deles",
        "Estão alinhados",
        "Quero ver antes de decidir",
      ])
    );

    expect(s.principal).toBe("estetica");
  });

  it("reúne os motivos das respostas, no máximo três", () => {
    const s = calcularSugestao(
      responder([
        "Tenho espaços entre eles",
        "Faz muita diferença",
        "Viajo ou fico fora com frequência",
        "Topo, sou organizado",
        "Poucas vezes, moro longe ou tenho pouca agenda",
        "Sou adulto",
        "Conforto no dia a dia",
      ])
    );

    expect(s.motivos.length).toBe(3);
    expect(new Set(s.motivos).size).toBe(3);
  });

  it("cai em alinhadores quando não há resposta nenhuma", () => {
    // a tela do resultado nunca deve aparecer vazia, mesmo com estado inválido
    expect(calcularSugestao([]).principal).toBe("alinhadores");
  });

  it("não depende da ordem em que as respostas foram somadas", () => {
    const caminho = responder([
      "Meus dentes são tortos",
      "Faz um pouco",
      "Rotina tranquila, sem essa preocupação",
      "Acho que sim, mas esqueceria às vezes",
      "Sem problema, moro perto",
      "Sou adulto",
      "Resolver com o máximo de previsibilidade",
    ]);

    expect(calcularSugestao([...caminho].reverse()).principal).toBe(
      calcularSugestao(caminho).principal
    );
  });
});

describe("mensagemSugestao", () => {
  it("leva o nome do procedimento e todas as respostas", () => {
    const respostas = responder([
      "Perdi um ou mais dentes",
      "Faz menos de um ano",
      "Estão alinhados",
      "Não uso prótese nenhuma",
    ]);
    const texto = mensagemSugestao(respostas, calcularSugestao(respostas));

    /* A secretária recebe só esta mensagem: se faltar resposta, ela precisa
       repetir o quiz inteiro no atendimento. */
    expect(texto).toContain(PROCEDIMENTOS.implantes.nome);
    for (const { opcao } of respostas) expect(texto).toContain(opcao.label);
  });
});
