import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import Reveal from "@/components/Reveal";

/** Mockup: procedimentos voltados para estética (lentes, facetas) */
export default function Estetica() {
  return (
    <section className="py-5 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-2">
        <Reveal from="left">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-green-text">
            Estética do sorriso
          </p>
          <h2 className="text-3xl md:text-4xl">Lentes de contato e facetas</h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Cor, formato e harmonia planejados digitalmente antes de qualquer
            procedimento. Você vê o resultado antes de decidir.
          </p>
          <Link
            href="/procedimentos/estetica"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
          >
            Ver procedimentos estéticos
          </Link>
        </Reveal>
        {/* TODO: foto de caso estético (antes/depois de lentes) */}
        <Reveal from="right" delay={120}>
          <PhotoPlaceholder
            label="Foto: caso de estética (lentes/facetas)"
            path="public/images/procedimentos/estetica-destaque.avif"
            className="aspect-[4/3]"
          />
        </Reveal>
      </div>
    </section>
  );
}
