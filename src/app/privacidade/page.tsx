import { metadataDaPagina } from "@/lib/seo";

export const metadata = metadataDaPagina({
  titulo: "Política de Privacidade",
  descricao:
    "Como a Ortoative trata os dados pessoais enviados pelo site, de acordo com a LGPD.",
  caminho: "/privacidade",
});
/** TODO: redação jurídica final (LGPD — dados de saúde são sensíveis) + DPO */
export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      <h1 className="text-4xl">Política de Privacidade</h1>
      <p className="mt-6 text-muted-foreground">
        A Ortoative respeita sua privacidade. Os dados enviados pelos formulários deste
        site são usados exclusivamente para atendimento e agendamento, nunca
        compartilhados com terceiros. Texto completo (LGPD) em elaboração.
      </p>
    </div>
  );
}
