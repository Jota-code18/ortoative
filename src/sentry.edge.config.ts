import * as Sentry from "@sentry/nextjs";

/**
 * Sentry no runtime Edge (middleware e rotas com `runtime = "edge"`).
 *
 * Config separada porque o Edge não tem as APIs de Node que o SDK do servidor
 * usa. Importar o arquivo errado quebra o build, não o runtime — por isso os
 * dois existem mesmo com conteúdo parecido.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
    sendDefaultPii: false,
  });
}
