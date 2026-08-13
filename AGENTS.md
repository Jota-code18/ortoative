<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Ortoative — padrão de trabalho

Este arquivo vale para **qualquer agente, de qualquer modelo** (Claude, Cursor, Copilot, Codex, Gemini). Siga o que está aqui sem precisar perguntar. Quando algo neste arquivo conflitar com seu hábito padrão, este arquivo ganha.

## O projeto

Site institucional da Ortoative — clínica odontológica e fabricante de alinhadores invisíveis em Anápolis e Goianésia (GO), com mais de 26 anos de atuação. É um site de **conversão**: o visitante chega, entende, e fala com a secretária pelo WhatsApp.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · three.js.

---

## 1. Fluxo obrigatório: issue → branch → PR

**Nada entra em `main` direto.** Sem exceção, nem para uma linha.

```
issue  →  branch  →  commits  →  PR citando a issue  →  check verde  →  merge
```

### 1.1 Toda tarefa nasce como issue

Antes de escrever código, abra a issue. Se a tarefa apareceu no meio de outra, abra a issue mesmo assim e trate depois — não aproveite a carona de um PR que trata de outro assunto.

Rotule sempre com **um tipo** e **uma área**:

| Tipo | Quando |
|---|---|
| `tipo: correção` | Algo está quebrado ou errado |
| `tipo: melhoria` | Algo existe e vai ficar melhor |
| `tipo: nova função` | Algo que não existe |

| Área | Cobre |
|---|---|
| `área: motion` | Animação, skeleton, carregamento |
| `área: performance` | Peso, imagem, render |
| `área: qualidade` | Lint, arquitetura, tipo |
| `área: testes` | Unitário, integração, e2e |
| `área: observabilidade` | Erro, trace, métrica |
| `área: infra` | CI/CD, deploy, repositório |
| `área: conteúdo` | Texto, foto, dado real |

Use `bloqueado: cliente` quando a tarefa depende de informação que só a clínica tem (endereço, depoimento, ID de conta). Descreva o que falta e **de quem** — issue bloqueada sem dono não anda.

O corpo da issue diz **o que muda e por quê**, não como. Se houver decisão de arquitetura, registre nela — é lá que a próxima pessoa vai procurar.

### 1.2 Uma branch por issue

```
<tipo>/<número da issue>-<resumo em kebab-case>
```

`feat/`, `fix/`, `perf/`, `docs/`, `test/`, `chore/`, `refactor/`.

```bash
git checkout main && git pull
git checkout -b feat/14-banner-lgpd
```

Uma issue por branch. Se o trabalho cresceu e virou dois assuntos, abra a segunda issue e a segunda branch.

### 1.3 Commits em Conventional Commits

```
<tipo>(<escopo opcional>): <resumo no imperativo, minúsculo, sem ponto final>
```

```
feat(quiz): adiciona estado de envio no formulário de contato
fix(seo): corrige canônica apontando sempre para a home
perf(imagens): converte o acervo para AVIF
```

Validado por commitlint no CI. Commit fora do padrão reprova o PR.

O corpo do commit explica **por que**, não o que — o diff já mostra o que.

### 1.4 O PR sempre cita a issue

O corpo do PR **precisa** ter a referência de fechamento. Sem ela o PR não é revisado:

```markdown
Closes #14
```

Estrutura do corpo:

```markdown
Closes #14

## O que muda
Uma frase por mudança relevante.

## Por quê
O motivo, quando não for óbvio pela issue.

## Como verificar
O passo a passo para o revisor conferir na mão.

## Risco
O que pode quebrar e o que foi feito para não quebrar. Escreva "nenhum" quando for o caso.
```

Um PR resolve **uma** issue. Se resolver mais de uma, ou está grande demais, ou as issues eram a mesma coisa.

### 1.5 Antes de pedir revisão

Rode e deixe verde:

```bash
npm run verify
```

Isso cobre typecheck, lint, formatação, código morto, contrato de arquitetura e testes. Se você mexeu em algo visível, verifique também no navegador — desktop **e** mobile — e cole a evidência no PR.

**Nunca** relate como pronto o que não passou. Se um passo falhou e você decidiu seguir, diga isso no PR, com a saída do erro.

---

## 2. Convenções de código

### Idioma

**Código e comentário em português.** Nome de variável, função, tipo, componente, arquivo e commit — tudo em português. É a língua de quem mantém o projeto.

Exceção: o que a linguagem ou o framework impõe (`useState`, `className`, `export default`, nomes de arquivo do App Router como `page.tsx` e `loading.tsx`).

### Comentário

Comente **por que**, nunca o que. O código já diz o que.

```ts
// ruim: incrementa o passo
setPasso((p) => p + 1);

// bom: a trilha só é conhecida depois da primeira resposta, por isso o
// total da barra fica estimado até lá
setPasso((p) => p + 1);
```

Comentário que repete o código é dívida: vira mentira no primeiro refactor.

### Camadas

Contrato validado no CI:

```
app/         →  pode importar components/ e lib/
components/  →  pode importar lib/            · nunca app/
lib/         →  não importa nada de UI        · nunca components/ nem app/
```

`lib/` é lógica pura e testável fora do React. No dia em que `lib/` importar um componente, a lógica deixa de ser testável — por isso a regra é automática, não combinada.

### Estilo

- Tokens de cor em `oklch()`, definidos em `src/app/globals.css` com `@theme inline`. Não escreva hex solto no componente.
- Mistura de cor com `color-mix(in oklch, ...)`.
- Tipografia: Nunito nos títulos, Nunito Sans no corpo, via `next/font/google`.
- **Piso de 14px para qualquer texto**, em qualquer viewport. Texto de leitura corrida: 16px no desktop. Isso é regressão travada por teste e2e — não baixe.

---

## 3. Movimento

O projeto segue a skill `design-motion-principles`, com peso **Jakub primário, Jhey secundário, Emil seletivo** (formulário e navegação) — o mapeamento de *marketing/landing page*.

Regras que valem sempre:

- **Anime só `transform`, `opacity` e `filter`.** `width`, `height`, `top`, `left` e margem forçam reflow.
- **`cubic-bezier` próprio, nunca `ease` ou `ease-in-out` puros.** O padrão do projeto para chegada é `cubic-bezier(.22, 1, .36, 1)`.
- **Saída mais discreta que a entrada.** Quem sai não disputa atenção com quem entra.
- **Todo movimento tem caminho de `prefers-reduced-motion`,** escrito junto — não em PR seguinte.
- **Nada de laço chamando atenção**: pulso, brilho piscando, CTA respirando. Envelhecem mal e atrapalham.
- **`will-change` é mira, não vassoura.** Só no elemento que vai animar, e removido quando termina.

O motivo de existir de cada animação é retorno, orientação ou continuidade. Se você não consegue nomear qual dos três, tire.

Há uma armadilha medida neste projeto: animar `filter: blur` durante o scroll derrubou o site para 46fps. Blur em transição de entrada é permitido em elemento isolado, nunca em dezenas de elementos ao mesmo tempo.

---

## 4. Desempenho

O site roda em celular de paciente, em rede de operadora. As regras que já custaram caro aqui:

- Imagem sempre por `next/image`, com `sizes` correto. Sem `sizes`, o Next serve a maior versão.
- Acervo em AVIF, com WebP de fallback (`next.config.ts`).
- Modelo 3D com Draco, carregado só quando entra na viewport, e com o laço de render pausado quando sai.
- Nada de `backdrop-blur` em elemento fixo — foi outra queda de fps medida.

---

## 5. Conteúdo e dado sensível

- Foto de paciente é **dado pessoal sensível** sob a LGPD. Não publique sem autorização por escrito e específica.
- Nome e telefone do quiz vão por e-mail para a recepção via Resend. Qualquer mudança nesse caminho mexe com dado pessoal — trate com o cuidado correspondente.
- Nenhuma credencial no repositório. `.env*` está no `.gitignore` e o repositório é **público**. Chave nova entra no `.env.example` só como nome, sem valor.
- Dado da clínica (endereço, número, estatística) é fato, não texto de marketing: não invente, não arredonde. Se não tem, abra issue com `bloqueado: cliente`.

---

## 6. Comandos

```bash
npm run dev             # desenvolvimento
npm run build           # build de produção
npm run verify          # tudo que o CI cobra, de uma vez

npm run typecheck       # tsc --noEmit
npm run lint            # ESLint (regras do Next)
npm run format          # Biome, escrevendo
npm run format:check    # Biome, só conferindo
npm run knip            # código e dependência sem uso
npm run arquitetura     # contrato de camadas
npm run test            # Vitest
npm run test:cobertura  # Vitest com cobertura
npm run test:e2e        # Playwright
npm run test:mutacao    # Stryker
npm run imagens:avif    # converte o acervo e gera o LQIP
```
