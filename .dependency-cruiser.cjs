/**
 * Contrato de arquitetura.
 *
 * A regra que mais rende aqui é a última: `lib/` não pode importar UI. No dia
 * em que importar, a lógica de triagem deixa de ser testável fora do React — e
 * é justamente ela que decide para qual especialista o paciente vai. Por isso
 * a regra é automática, não combinada.
 */
module.exports = {
  forbidden: [
    {
      name: "lib-nao-importa-ui",
      severity: "error",
      comment:
        "src/lib/ é lógica pura. Importar componente ou rota amarra a regra de negócio ao React e mata a testabilidade.",
      from: { path: "^src/lib" },
      to: { path: "^src/(components|app)" },
    },
    {
      name: "componente-nao-importa-rota",
      severity: "error",
      comment:
        "src/components/ não pode depender de src/app/. Componente é reutilizável; rota é destino. A seta só aponta num sentido.",
      from: { path: "^src/components" },
      to: { path: "^src/app" },
    },
    {
      name: "sem-ciclo",
      severity: "error",
      comment:
        "Dependência circular quebra tree-shaking e produz módulo parcialmente inicializado em tempo de execução.",
      from: {},
      to: { circular: true },
    },
    {
      name: "sem-orfao",
      severity: "warn",
      comment:
        "Módulo que ninguém importa costuma ser sobra de refatoração. O Knip cobre isso com mais precisão; aqui fica o aviso.",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$",
          "\\.d\\.ts$",
          "(^|/)tsconfig\\.json$",
          "^src/app/", // rota é ponto de entrada por convenção do App Router
          "^src/types/",
        ],
      },
      to: {},
    },
    {
      name: "sem-dependencia-de-desenvolvimento-em-producao",
      severity: "error",
      comment:
        "Só devDependencies em código de produção quebra o deploy, e só no deploy.",
      from: { path: "^src", pathNot: "\\.(teste|spec)\\.tsx?$" },
      to: { dependencyTypes: ["npm-dev"] },
    },
  ],

  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)(\\.next|node_modules|e2e|testes|scripts)/" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
