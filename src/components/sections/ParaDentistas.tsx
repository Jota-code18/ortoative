import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Mockup: Ortoative para outros dentistas — aulas do Dr. Rui, ensino,
 * benefícios de aprender com quem fabrica.
 */
export default function ParaDentistas() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <Reveal from="left" className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/dentistas/rui-apresentacao.avif"
              alt="Dr. Rui Cambauva analisando um escaneamento 3D no computador"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal from="right" delay={120} className="order-1 lg:order-2">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-green-text">
            Ortoative para dentistas
          </p>
          <h2 className="text-3xl md:text-4xl">Aprenda com quem fabrica</h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            O Prof. Dr. Rui Cambauva — autor de dois livros de Ortodontia e ex-professor
            de quatro universidades — compartilha na prática o que 26 anos de clínica e
            fabricação própria ensinaram. Cursos, mentorias e parceria para o seu
            consultório.
          </p>
          <Link
            href="/para-dentistas"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
          >
            Conhecer a formação
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
