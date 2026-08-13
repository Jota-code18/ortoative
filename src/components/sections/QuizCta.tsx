import QuizInline from "@/components/QuizInline";
import Reveal from "@/components/Reveal";

/**
 * 1º scroll (Notion): agendamento rápido — o quiz roda aqui mesmo, na home.
 * Identifica o problema, qualifica o lead e entrega o resumo à secretária.
 */
export default function QuizCta() {
  return (
    /* Nasce do escuro da hero em poucos pixels e mantém o azul: a emenda de
       saída fica a cargo do componente Costura. */
    <section
      /* âncora estável: anúncio e link de campanha caem direto na triagem */
      id="avaliacao"
      aria-label="Avaliação gratuita"
      className="scroll-mt-20 text-white"
      style={{
        background:
          "linear-gradient(to bottom, var(--hero-dark) 0%, var(--brand-blue) 9%, var(--brand-blue) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-10">
        <Reveal>
          <QuizInline />
        </Reveal>
      </div>
    </section>
  );
}
