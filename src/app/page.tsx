import ComparativoTratamentos from "@/components/ComparativoTratamentos";
import Costura from "@/components/Costura";
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
 * Fundo branco do início ao fim; só o atendimento rápido mantém o azul da
 * marca, e a única costura do site é a saída dele.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <QuizCta />
      <Costura de="var(--brand-blue)" para="var(--background)" altura={72} />
      <Alinhadores />
      <OrtodontiaFixa />

      {/* O comparativo fecha as duas seções: comparar só faz sentido depois de
          o visitante saber o que está sendo comparado. */}
      <div className="mx-auto max-w-3xl px-4 py-5 md:py-10">
        <ComparativoTratamentos />
      </div>
      <ProvaSocial />
      <Implantes />
      <ParaDentistas />
      <Estetica />
      <ProcedimentosGrid />
      <EquipeLocal />
      <TecnologiaBlog />
    </>
  );
}
