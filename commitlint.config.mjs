/**
 * Conventional Commits.
 *
 * Vale porque o histórico é a única documentação que não sai do ar: quando
 * alguém abrir `git log` daqui a um ano para entender por que a rota do lead
 * lê variável de ambiente dentro do handler, é o assunto do commit que vai
 * dizer onde procurar.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // função nova para o paciente ou para a clínica
        "fix", // correção de defeito
        "perf", // desempenho: peso, render, tempo de carga
        "refactor", // muda a forma, não o comportamento
        "style", // formatação, sem efeito em runtime
        "docs", // documentação
        "test", // teste
        "build", // build, dependência
        "ci", // pipeline
        "chore", // manutenção que não cabe acima
        "revert",
      ],
    ],
    /* 100 e não 72: assunto em português com acento gasta mais caractere, e
       cortar no meio produz assunto que não diz nada. */
    "header-max-length": [2, "always", 100],
    "subject-case": [0],
    "body-max-line-length": [0],
  },
};
