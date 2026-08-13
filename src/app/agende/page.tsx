import Quiz from "@/components/Quiz";
import { metadataDaPagina } from "@/lib/seo";

export const metadata = metadataDaPagina({
  titulo: "Agende sua avaliação",
  descricao:
    "Responda 6 perguntas rápidas e receba uma pré-avaliação da equipe Ortoative pelo WhatsApp. Sem compromisso.",
  caminho: "/agende",
});

export default function AgendePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      <h1 className="text-center text-3xl md:text-4xl">
        Avaliação rápida <span className="text-brand-green-text">sem compromisso</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
        Menos de 1 minuto. Sua resposta vai direto para nossa equipe, que te chama no
        WhatsApp com o melhor caminho para o seu caso.
      </p>
      <div className="mt-10">
        <Quiz />
      </div>
    </div>
  );
}
