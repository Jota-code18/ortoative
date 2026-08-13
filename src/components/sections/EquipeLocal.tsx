import Image from "next/image";
import Link from "next/link";
import CenaClinica3D from "@/components/CenaClinica3D";
import EquipeRows from "@/components/EquipeRows";
import Reveal from "@/components/Reveal";
import { enderecoDe, unidades } from "@/lib/data";
import { previa } from "@/lib/lqip";

/**
 * Unidades + equipe.
 * Cada unidade segue a mesma ordem: fachada, três fotos do interior e o
 * passeio 3D fechando o bloco.
 */
export default function EquipeLocal() {
  return (
    <section id="local" className="scroll-mt-20 py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-3xl md:text-4xl">
            Conheça nossas unidades de Anápolis e Goianésia
          </h2>
        </Reveal>

        {unidades.map((u, i) => (
          <div key={u.slug} className={i === 0 ? "mt-8" : "mt-16"}>
            <Reveal>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-2xl text-primary md:text-3xl">Unidade {u.nome}</h3>
                <p className="text-base text-muted-foreground md:text-lg">
                  {enderecoDe(u)}
                  {u.cep ? ` · CEP ${u.cep}` : ""}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="relative mt-5 aspect-[21/9] overflow-hidden rounded-2xl">
                <Image
                  src={u.fachada}
                  alt={`Fachada da Ortoative — ${u.nome}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1152px"
                  className="object-cover"
                  {...previa(u.fachada)}
                />
              </div>
            </Reveal>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {u.interiores.map((foto, j) => (
                <Reveal key={foto.src} delay={j * 90}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={foto.src}
                      alt={foto.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      {...previa(foto.src)}
                    />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={60}>
              <div className="mt-4">
                <CenaClinica3D modelo={u.modelo3d} unidade={u.nome} />
              </div>
            </Reveal>
          </div>
        ))}

        <div className="mt-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl">Equipe Ortoative</h2>
          </Reveal>

          <div className="mt-6">
            <EquipeRows />
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/equipe"
              className="inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
            >
              Ver formação completa da equipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
