import type { Metadata } from "next";
import localFont from "next/font/local";
import DadosEstruturados from "@/components/DadosEstruturados";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import "./globals.css";

/*
 * As fontes são servidas do próprio domínio, não do Google.
 *
 * Com `next/font/google` o build busca os arquivos na rede toda vez que roda.
 * Quando fonts.googleapis.com falha — e falhou três vezes aqui, uma delas
 * derrubando o job de ponta a ponta no CI —, o build inteiro cai por um motivo
 * que não tem nada a ver com o código.
 *
 * Hospedar resolve isso e ainda tira uma requisição a terceiro do carregamento
 * da página, o que ajuda no tempo até o texto aparecer e evita mandar o IP do
 * paciente para o Google sem necessidade.
 *
 * Os arquivos são as fontes variáveis do subconjunto latino (39 KB e 31 KB).
 * Para atualizar, baixe de novo em fonts.google.com/specimen/Nunito.
 */

/** Títulos e UI — fonte oficial do manual da marca */
const nunito = localFont({
  src: "./fontes/nunito.woff2",
  /* Variável de 400 a 900: um arquivo cobre os pesos 600, 700 e 800 que o
     manual pede, sem baixar três. */
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-nunito",
});

/** Corpo de texto — mesma família, terminações retas: melhor leitura em massa */
const nunitoSans = localFont({
  src: "./fontes/nunito-sans.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-nunito-sans",
});

const TITULO = "Ortoative — Clínica e fabricante de alinhadores invisíveis em Anápolis";
const DESCRICAO =
  "Há mais de 26 anos em Anápolis, a Ortoative é clínica e fabricante de alinhadores invisíveis. Ortodontia, implantes, estética e mais. Agende sua avaliação.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: TITULO, template: "%s | Ortoative" },
  description: DESCRICAO,
  keywords: [
    "alinhador invisível Anápolis",
    "aparelho transparente Goiás",
    "ortodontista Anápolis",
    "fabricante alinhador Goiás",
  ],
  /* canonical só da home. Cada página interna define o seu em lib/seo.ts —
     herdado daqui, o site inteiro apontaria para a raiz e o Google trataria
     as páginas internas como conteúdo duplicado. */
  alternates: { canonical: "/" },
  /* Sem Open Graph o link compartilhado no WhatsApp — o canal principal da
     clínica — aparece sem imagem e sem descrição. */
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: TITULO,
    description: DESCRICAO,
    /* JPEG de propósito, e no 1,91:1 que o cartão pede. O acervo do site é
       AVIF, mas WhatsApp, Facebook e X não negociam formato ao buscar a
       prévia: em AVIF o link aparece sem imagem. */
    images: [
      {
        url: "/images/og/compartilhamento.jpg",
        width: 1200,
        height: 630,
        alt: "Paciente sorrindo — Ortoative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
    images: ["/images/og/compartilhamento.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/images/marca/simbolo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}>
        <DadosEstruturados />
        {/* Atalho para quem navega por teclado pular o menu */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-bold focus:text-primary-foreground"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
