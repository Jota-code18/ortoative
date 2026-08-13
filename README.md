# Ortoative — site institucional

Clínica odontológica e fabricante de alinhadores invisíveis em Anápolis e
Goianésia (GO), com mais de 26 anos de atuação.

É um site de **conversão**: o visitante entende o tratamento, faz a triagem e
cai no WhatsApp da secretária. Tudo que está aqui serve a esse caminho.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
three.js

> O padrão de trabalho — issue, branch, PR e convenções de código — está no
> [`AGENTS.md`](AGENTS.md). Leia antes de abrir a primeira branch.

## Rodando

```bash
npm install
npm run dev
```

Não precisa de nenhuma variável de ambiente para subir. O envio de lead por
e-mail e toda a observabilidade ficam desligados por padrão, e o site funciona
igual — o repositório é público e ninguém deve precisar de conta em serviço
nenhum para trabalhar nele.

Para ligar o e-mail da recepção ou a observabilidade, copie o
[`.env.example`](.env.example) para `.env.local` e preencha o que for usar.

## Comandos

```bash
npm run dev             # desenvolvimento
npm run build           # build de produção
npm run verify          # tudo que o CI cobra, de uma vez

npm run test            # Vitest
npm run test:cobertura  # Vitest com cobertura
npm run test:e2e        # Playwright (desktop e celular)
npm run test:mutacao    # Stryker

npm run imagens:avif    # converte o acervo e gera o LQIP
```

## Observabilidade

### Por que não são quatro SDKs

Sentry, Datadog, New Relic e OpenTelemetry aparecem juntos em muita lista de
requisitos, mas instalar os quatro no mesmo aplicativo é peso morto: três
deles coletam a mesma coisa, cada um com o seu agente, e o resultado é conta
triplicada e um site mais lento para o paciente.

O desenho aqui separa por **o que cada camada realmente faz**:

| Camada | Papel | Substituível? |
|---|---|---|
| **Sentry** | Exceção, com mapa de fontes e agrupamento por sessão | Não — trace não faz isso |
| **OpenTelemetry** | Trace e métrica, em formato neutro | É o padrão, não um fornecedor |
| **Datadog** / **New Relic** | Destino dos dados do OTLP | Sim, um contra o outro |

Datadog e New Relic consomem OTLP nativamente. Trocar de fornecedor é trocar
duas variáveis de ambiente — não é reescrever código nem instalar um segundo
agente.

### Apontando para o Datadog

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://trace.agent.datadoghq.com/otlp
OTEL_EXPORTER_OTLP_HEADERS=dd-api-key=SUA_CHAVE
```

### Apontando para o New Relic

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net
OTEL_EXPORTER_OTLP_HEADERS=api-key=SUA_LICENSE_KEY
```

### Apontando para um coletor local

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Sem `OTEL_EXPORTER_OTLP_ENDPOINT`, nada é exportado. Sem
`NEXT_PUBLIC_SENTRY_DSN`, o Sentry nem inicializa.

### O que deliberadamente não é coletado

Este site recebe **nome e telefone de paciente** no formulário de triagem —
dado pessoal sob a LGPD. Por isso:

- `sendDefaultPii: false` em todos os runtimes.
- O `beforeSend` do servidor apaga o corpo e a query da requisição antes de
  enviar. Para depurar um erro em `/api/lead`, saber a rota e o código basta;
  saber quem era o paciente não ajuda e cria obrigação legal.
- **Replay de sessão desligado.** Gravar a tela de quem preenche um formulário
  de saúde é coleta de dado sensível, e o ganho de depuração não paga a
  obrigação que cria.
- Amostragem de trace em 10% na produção — o volume de um site institucional
  não justifica amostra cheia.

Os eventos do navegador saem por `/monitoring`, uma rota do próprio domínio.
Bloqueador de anúncio derruba chamada direta para o Sentry, e aí o erro que
mais interessa — o que acontece no celular do paciente — seria justamente o
que nunca chega.

## Estrutura

```
src/app/          rotas (App Router), com loading.tsx por rota
src/components/   componentes; sections/ são os blocos da home
src/lib/          lógica pura e dados — não importa nada de UI
public/images/    acervo em AVIF (marca/ e og/ ficam em PNG e JPEG de propósito)
public/models/    modelos 3D em GLB com Draco
testes/           Vitest — unidade e integração
e2e/              Playwright — desktop e celular
scripts/          utilitários de build
```

A regra de dependência entre camadas é verificada no CI por
`npm run arquitetura`. O motivo está no [`AGENTS.md`](AGENTS.md).
