import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site";

/**
 * Mockup: implantes — mesma ideia dos alinhadores, abordagem para público
 * mais velho, tom sóbrio. Modelo 3D de implante girando (pendente).
 */
export default function Implantes() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-2">
        <Reveal from="left">
          <h2 className="text-3xl md:text-4xl">
            Implantes com quem tem{" "}
            <span className="text-brand-green-text">26 anos</span> de experiência
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Recupere a segurança para sorrir, mastigar e conversar. Avaliação completa,
            planejamento digital e acompanhamento próximo, do primeiro exame à
            cicatrização.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/procedimentos/implantes"
              className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-blue"
            >
              Saiba mais sobre implantes
            </Link>
            <a
              href={whatsappLink("Oi! Quero saber mais sobre implantes na Ortoative.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-brand-green px-6 py-3 font-bold text-brand-green-text transition-colors hover:bg-brand-green-btn hover:text-white"
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
        {/* TODO: modelo 3D implante girando */}
        <Reveal from="right" delay={120}>
          <PhotoPlaceholder
            label="Modelo 3D: implante girando"
            path="public/models/implante.glb"
            className="h-72"
          />
        </Reveal>
      </div>
    </section>
  );
}
