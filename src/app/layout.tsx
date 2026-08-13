import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import DadosEstruturados from "@/components/DadosEstruturados";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/lib/site";
import "./globals.css";

/** Títulos e UI — fonte oficial do manual da marca */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"], // 600 = Semibold dos subtítulos (manual)
  display: "swap",
  variable: "--font-nunito",
});

/** Corpo de texto — mesma família, terminações retas: melhor leitura em massa */
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
    images: [
      {
        url: "/images/hero/esquerda-hero.jpg",
        width: 1152,
        height: 1440,
        alt: "Paciente sorrindo — Ortoative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
    images: ["/images/hero/esquerda-hero.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/images/marca/simbolo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}
      >
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
