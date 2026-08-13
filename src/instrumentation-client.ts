import * as Sentry from "@sentry/nextjs";

/**
 * Sentry no navegador.
 *
 * O que interessa aqui é erro que o paciente encontra e a gente não vê:
 * falha no WebGL do passeio 3D, quebra do carrossel em navegador antigo,
 * envio do lead que não completa.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

    /* Sem replay de sessão. Gravar a tela de quem preenche nome e telefone
       em um formulário de saúde é coleta de dado pessoal sensível, e o ganho
       de depuração não paga a obrigação que cria. */
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    sendDefaultPii: false,

    /* Extensão de navegador e falha de rede do usuário entopem o painel sem
       apontar defeito nosso. */
    ignoreErrors: [
      "ResizeObserver loop",
      "Non-Error promise rejection captured",
      /^Failed to fetch$/,
      /^NetworkError/,
      /extension\//,
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
