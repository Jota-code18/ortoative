import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

/**
 * Ponto único de instrumentação do servidor.
 *
 * A escolha de arquitetura está registrada em README.md, mas o resumo é: os
 * traces saem em OpenTelemetry, formato neutro, e o destino é uma variável de
 * ambiente. Datadog e New Relic consomem OTLP nativamente, então trocar de
 * fornecedor é trocar `OTEL_EXPORTER_OTLP_ENDPOINT` — não é reescrever código
 * nem instalar um segundo SDK que coleta a mesma coisa.
 *
 * O Sentry entra por fora porque faz outra coisa: captura de exceção com
 * mapa de fontes e agrupamento por sessão, que trace não substitui.
 */
export async function register() {
  const destino = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (destino) {
    registerOTel({
      serviceName: process.env.OTEL_SERVICE_NAME ?? "ortoative-site",
      traceExporter: new OTLPHttpJsonTraceExporter({
        url: `${destino.replace(/\/$/, "")}/v1/traces`,
        /* As chaves vão em cabeçalho porque é o que Datadog e New Relic
           esperam; o nome do cabeçalho muda entre eles, por isso vem do
           ambiente em vez de estar fixo aqui. */
        headers: cabecalhosOtlp(),
      }),
    });
  }

  /* O Sentry precisa de inicialização separada por runtime: o Node tem acesso
     a coisas que o Edge não tem, e importar o pacote errado quebra o build. */
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Erro de servidor que chega ao Sentry com o contexto da requisição.
 * Sem isso, falha em Server Component aparece sem rota nem parâmetro.
 */
export async function onRequestError(
  ...args: Parameters<typeof import("@sentry/nextjs").captureRequestError>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
}

/**
 * `OTEL_EXPORTER_OTLP_HEADERS` no formato padrão da especificação:
 * `chave1=valor1,chave2=valor2`.
 */
function cabecalhosOtlp(): Record<string, string> {
  const bruto = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (!bruto) return {};

  return Object.fromEntries(
    bruto
      .split(",")
      .map((par) => par.split("="))
      .filter((par): par is [string, string] => par.length === 2)
      .map(([chave, valor]) => [chave.trim(), valor.trim()])
  );
}
