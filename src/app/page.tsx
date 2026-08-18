import Costura from "@/components/Costura";
import Divisa from "@/components/Divisa";
import QuizTratamento from "@/components/QuizTratamento";
import Alinhadores from "@/components/sections/Alinhadores";
import EquipeLocal from "@/components/sections/EquipeLocal";
import Estetica from "@/components/sections/Estetica";
import Hero from "@/components/sections/Hero";
import Implantes from "@/components/sections/Implantes";
import OrtodontiaFixa from "@/components/sections/OrtodontiaFixa";
import ParaDentistas from "@/components/sections/ParaDentistas";
import ProcedimentosGrid from "@/components/sections/ProcedimentosGrid";
import ProvaSocial from "@/components/sections/ProvaSocial";
import QuizCta from "@/components/sections/QuizCta";
import TecnologiaBlog from "@/components/sections/TecnologiaBlog";

/**
 * Home — ordem exata do scroll definida no mockup/Notion.
 * Fundo branco do início ao fim; só os dois blocos de atendimento mantêm o
 * azul da marca, e as costuras são a entrada e a saída deles.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <QuizCta />
      <Costura de="var(--brand-blue)" para="var(--background)" altura={72} />

      <Alinhadores />
      <Divisa />
      <OrtodontiaFixa />

      {/* O quiz fecha as duas seções: responder qual serve para você só faz
          sentido depois de o visitante saber o que está sendo comparado. Vem
          no mesmo azul da triagem do topo — é a mesma mecânica, e mudar a
          aparência faria parecer outro site. */}
      <Costura de="var(--background)" para="var(--brand-blue)" altura={64} />
      <section
        id="comparativo"
        aria-label="Qual tratamento é melhor para você"
        className="scroll-mt-20 bg-brand-blue text-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-12">
          <QuizTratamento />
        </div>
      </section>
      <Costura de="var(--brand-blue)" para="var(--background)" altura={64} />

      <ProvaSocial />
      <Divisa />
      <Implantes />
      <Divisa />
      <ParaDentistas />
      <Divisa />
      <Estetica />
      <ProcedimentosGrid />
      <EquipeLocal />
      <TecnologiaBlog />
    </>
  );
}
