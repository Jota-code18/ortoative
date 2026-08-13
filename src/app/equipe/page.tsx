import EquipeRows from "@/components/EquipeRows";
import Reveal from "@/components/Reveal";
import { metadataDaPagina } from "@/lib/seo";


export const metadata = metadataDaPagina({
  titulo: "Equipe",
  descricao:
    "Conheça os especialistas da Ortoative: ortodontia, prótese, periodontia e implantodontia com formação completa e CRO identificado.",
  caminho: "/equipe",
});

export default function EquipePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28">
      <Reveal>
        <h1 className="text-4xl md:text-5xl">Equipe Ortoative</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Profissionais com nome, rosto, CRO e formação — você sabe exatamente quem
          cuida do seu sorriso.
        </p>
      </Reveal>

      <div className="mt-14">
        <EquipeRows />
      </div>
    </div>
  );
}
