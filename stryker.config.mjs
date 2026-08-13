/**
 * Teste de mutação.
 *
 * Cobertura diz que a linha rodou; mutação diz se alguém estava conferindo o
 * resultado. Aqui isso importa em um lugar específico: `ehUrgencia` decide se
 * o lead chega marcado como urgência para a secretária. Um teste que executa
 * essa função sem afirmar o retorno passaria na cobertura e deixaria passar
 * uma inversão de condição — e o custo seria um paciente com dor esperando
 * na fila normal.
 *
 * O alvo é só `src/lib/`. Mutar componente exigiria renderizar a árvore
 * inteira a cada mutante, e o retorno não paga o tempo.
 */
export default {
  packageManager: "npm",
  testRunner: "vitest",
  /* `related: false` é obrigatório aqui: os testes importam por alias (`@/lib`),
     e a heurística do Stryker que casa teste com fonte trabalha em caminho
     bruto — com ela ligada, ele não encontra teste nenhum. */
  vitest: { configFile: "vitest.config.mts", related: false },
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "perTest",

  mutate: [
    "src/lib/**/*.ts",
    "!src/lib/lqip.ts", // só lê um JSON gerado
    "!src/lib/site.ts", // constante de configuração, não há lógica para mutar
    /* `data.ts` é conteúdo: bio de profissional, endereço, texto de
       procedimento. Mutar string de conteúdo produz centenas de mutantes que
       nenhum teste razoável mata — mediria a nossa disposição de escrever
       asserção sobre texto de marketing, não a qualidade da suíte. A
       integridade desse arquivo é garantida por `testes/acervo.teste.ts`,
       que confere se todo caminho prometido existe em disco. */
    "!src/lib/data.ts",
  ],

  thresholds: { high: 90, low: 80, break: 80 },
  timeoutMS: 60_000,
  tempDirName: "node_modules/.stryker-tmp",
};
