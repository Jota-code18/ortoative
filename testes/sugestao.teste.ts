import { describe, expect, it } from "vitest";
import {
  calcularSugestao,
  detalhesDaSugestao,
  mensagemSugestao,
  type Opcao,
  PERGUNTAS,
  PROCEDIMENTOS,
  type Resposta,
} from "@/lib/sugestao";

/** Percorre o quiz escolhendo a opção pelo rótulo. */
function responder(rotulos: string[]): Resposta[] {
  return rotulos.map((rotulo, i) => {
    const pergunta = PERGUNTAS[i];
    const opcao = pergunta.opcoes.find((o) => o.label === rotulo);
    if (!opcao) throw new Error(`opção "${rotulo}" não existe em ${pergunta.id}`);
    return { perguntaId: pergunta.id, opcao };
  });
}

/** A primeira opção de cada pergunta, do começo ao fim. */
function caminhoPadrao(): Resposta[] {
  return PERGUNTAS.map((p) => ({ perguntaId: p.id, opcao: p.opcoes[0] }));
}

describe("PERGUNTAS", () => {
  it("não passa de 8 perguntas", () => {
    /* Oito é o limite acordado: acima disso o visitante abandona no meio e o
       quiz deixa de entregar sugestão nenhuma. */
    expect(PERGUNTAS.length).toBeLessThanOrEqual(8);
  });

  it("tem ids únicos", () => {
    const ids = PERGUNTAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("toda opção pesa para algum tratamento", () => {
    // opção sem peso é resposta que não influencia nada — sintoma de esquecimento
    const todas: Opcao[] = PERGUNTAS.flatMap((p) => p.opcoes);
    for (const opcao of todas) {
      expect(Object.keys(opcao.peso).length).toBeGreaterThan(0);
    }
  });

  it("só compara alinhador e ortodontia fixa", () => {
    /* O quiz do topo faz a triagem geral; este responde a dúvida entre os dois.
       Um peso para implante ou lente aqui significa que a comparação vazou. */
    const permitidos = new Set(Object.keys(PROCEDIMENTOS));
    for (const opcao of PERGUNTAS.flatMap((p) => p.opcoes)) {
      for (const id of Object.keys(opcao.peso)) expect(permitidos.has(id)).toBe(true);
    }
  });

  it("nenhum tratamento vence todas as perguntas", () => {
    /* Mais de 20.000 sorrisos da casa vieram do aparelho fixo. Quiz em que um
       lado ganha sempre ensina o paciente a desconfiar dele. */
    const soma = (id: "alinhadores" | "ortodontia-fixa") =>
      PERGUNTAS.filter((p) => p.opcoes.some((o) => (o.peso[id] ?? 0) > 0)).length;

    expect(soma("alinhadores")).toBeGreaterThan(1);
    expect(soma("ortodontia-fixa")).toBeGreaterThan(1);
  });
});

describe("calcularSugestao", () => {
  it("sugere alinhadores para quem quer discrição e tem disciplina", () => {
    const s = calcularSugestao(
      responder([
        "Tenho espaços entre eles",
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
    expect(s.equilibrado).toBe(false);
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
    expect(s.alternativa).toBe("alinhadores");
  });

  it("avisa quando a diferença é pequena demais para decidir", () => {
    const s = calcularSugestao(
      responder([
        "Meus dentes são tortos",
        "Faz um pouco",
        "Rotina tranquila, sem essa preocupação",
        "Acho que sim, mas esqueceria às vezes",
        "Sem problema, moro perto",
        "Sou adulto",
        "Resolver com o máximo de previsibilidade",
      ])
    );

    /* Sem uma resposta forte de nenhum lado, dizer "é este" seria inventar
       convicção — a tela precisa saber disso para mudar o texto. */
    expect(s.equilibrado).toBe(true);
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

  it("sempre devolve os dois tratamentos, nunca o mesmo duas vezes", () => {
    const s = calcularSugestao(caminhoPadrao());
    expect(s.principal).not.toBe(s.alternativa);
  });

  it("não deixa a tela vazia se não houver resposta nenhuma", () => {
    const s = calcularSugestao([]);
    expect(s.principal).toBe("alinhadores");
    expect(s.equilibrado).toBe(true);
  });

  it("não depende da ordem em que as respostas foram somadas", () => {
    const caminho = caminhoPadrao();
    expect(calcularSugestao([...caminho].reverse()).principal).toBe(
      calcularSugestao(caminho).principal
    );
  });
});

describe("detalhesDaSugestao", () => {
  it("devolve o enunciado de cada pergunta com a resposta escolhida", () => {
    /* É esta lista que chega no e-mail da secretária: se vier com id em vez de
       enunciado, ela recebe "disciplina: Topo, sou organizado". */
    const detalhes = detalhesDaSugestao(caminhoPadrao());

    expect(detalhes).toHaveLength(PERGUNTAS.length);
    for (const [i, d] of detalhes.entries()) {
      expect(d.pergunta).toBe(PERGUNTAS[i].titulo);
      expect(d.resposta).toBe(PERGUNTAS[i].opcoes[0].label);
    }
  });
});

describe("mensagemSugestao", () => {
  it("leva nome, sugestão e todas as respostas", () => {
    const respostas = caminhoPadrao();
    const texto = mensagemSugestao("Ana", respostas, calcularSugestao(respostas));

    expect(texto).toContain("Ana");
    expect(texto).toContain(PROCEDIMENTOS.alinhadores.nome);
    for (const { opcao } of respostas) expect(texto).toContain(opcao.label);
  });

  it("não quebra quando o nome não foi informado", () => {
    const respostas = caminhoPadrao();
    expect(mensagemSugestao("", respostas, calcularSugestao(respostas))).toContain(
      "(não informado)"
    );
  });
});
