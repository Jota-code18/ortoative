import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP reduzem bastante o peso das fotos de pacientes e equipe
    formats: ["image/avif", "image/webp"],
    /* O Next 16 exige declarar as qualidades permitidas. Sem isto, o
       `quality={92}` das fotos do hero era silenciosamente rebaixado para 75 —
       o servidor avisava em log e mais nada, então a foto principal do site
       saía pior do que o código pedia. */
    qualities: [75, 92],
  },
  // Evita o aviso de múltiplos lockfiles (existe um package-lock.json em ~)
  turbopack: {
    root: __dirname,
  },
};

/**
 * O wrapper do Sentry só faz diferença quando há credencial no ambiente: sem
 * `SENTRY_AUTH_TOKEN` ele não sobe mapa de fontes e o build segue igual. Isso
 * mantém o projeto rodando na máquina de quem clonou, sem pedir conta em
 * serviço nenhum.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: !process.env.CI,
  // sem token, nem tenta — evita build falhando por falta de credencial
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },

  /* Encaminha os eventos por uma rota do próprio domínio. Bloqueador de
     anúncio derruba chamada direta para o Sentry, e aí o erro que a gente
     mais precisa ver — o do navegador do paciente — é justamente o que
     nunca chega. */
  tunnelRoute: "/monitoring",

  disableLogger: true,
  automaticVercelMonitors: false,
});
