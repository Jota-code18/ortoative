import type { Metadata } from "next";
import CenaClinicaGravacao from "@/components/CenaClinicaGravacao";

/**
 * Página de bastidor: só alimenta `npm run passeios:renderizar`.
 *
 * Não é ligada de lugar nenhum do site e fica fora do sitemap. Existe para o
 * vídeo dos passeios poder ser regravado quando o modelo 3D mudar, sem ter de
 * remontar a cena do zero.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function GravacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ modelo?: string; afastamento?: string }>;
}) {
  const { modelo, afastamento } = await searchParams;

  return (
    <>
      {/* A cena mora dentro do layout do site, então Header, rodapé e o botão
          do WhatsApp ficam por cima do canvas e entram no quadro gravado.
          Escondê-los aqui é mais simples que criar um layout raiz paralelo só
          para esta página de bastidor. */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            "header,footer,a[aria-label='Falar no WhatsApp']{display:none!important}" +
            "html,body{overflow:hidden!important;background:#fff}",
        }}
      />
      <CenaClinicaGravacao
        modelo={modelo ?? "/models/clinica.glb"}
        afastamento={Number(afastamento ?? 1)}
      />
    </>
  );
}
