import Costura from "@/components/Costura";
import Hero from "@/components/sections/Hero";
import QuizCta from "@/components/sections/QuizCta";
import Alinhadores from "@/components/sections/Alinhadores";
import ProvaSocial from "@/components/sections/ProvaSocial";
import Implantes from "@/components/sections/Implantes";
import ParaDentistas from "@/components/sections/ParaDentistas";
import Estetica from "@/components/sections/Estetica";
import ProcedimentosGrid from "@/components/sections/ProcedimentosGrid";
import EquipeLocal from "@/components/sections/EquipeLocal";
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
