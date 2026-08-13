import * as Sentry from "@sentry/nextjs";

/**
 * Sentry no servidor.
 *
 * Desligado por padrão: sem DSN o `init` não roda e o site funciona igual.
 * Isso é proposital — o repositório é público e ninguém deve precisar de
 * credencial para rodar o projeto localmente.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,

    /* 10% em produção. Um site institucional de clínica não gera volume que
       justifique amostra cheia, e trace de página estática repetida não
       ensina nada depois da primeira dezena. */
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

    /* Nome e telefone passam por aqui no envio do lead. Dado de paciente não
       vai para ferramenta de terceiro sem necessidade e sem base legal. */
    sendDefaultPii: false,

    beforeSend(evento) {
      return semDadoPessoal(evento);
    },
  });
}

/**
 * Remove o corpo da requisição e a query dos eventos.
 *
 * O corpo do POST /api/lead carrega nome e telefone do paciente — dado
 * pessoal sob a LGPD. Para depurar um erro, saber a rota e o código basta;
 * saber quem era o paciente não ajuda em nada e cria obrigação legal.
 */
function semDadoPessoal<
  T extends { request?: { data?: unknown; query_string?: unknown } },
>(evento: T): T {
  if (evento.request) {
    evento.request.data = undefined;
    evento.request.query_string = undefined;
  }
  return evento;
}
