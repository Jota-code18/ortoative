import { defineConfig, devices } from "@playwright/test";

const PORTA = 3100;

export default defineConfig({
  testDir: "./e2e",
  /* Cada arquivo cobre um caminho independente; parelelizar é seguro. */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: `http://127.0.0.1:${PORTA}`,
    trace: "on-first-retry",
    /* O site é regional: nada de rodar em locale que não é o dos pacientes. */
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    /* O celular não é variação secundária: é a maioria do tráfego de uma
       clínica que divulga no Instagram e fecha no WhatsApp. */
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  /* Roda contra o build de produção, não o dev. O dev tem overlay de erro,
     recompilação sob demanda e nenhuma otimização de imagem — testar nele
     mede outra coisa. */
  webServer: {
    command: `npm run build && npx next start --port ${PORTA}`,
    url: `http://127.0.0.1:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
