import Image from "next/image";
import Link from "next/link";
import { procedimentosGrade } from "@/lib/data";
import { metadataDaPagina } from "@/lib/seo";
import { previa } from "@/lib/lqip";

export const metadata = metadataDaPagina({
  titulo: "Procedimentos",
  descricao:
    "Alinhadores, ortodontia fixa, implantes, estética, prótese, canal, gengivas e cirurgias — todos os tratamentos da Ortoative em Anápolis e Goianésia.",
  caminho: "/procedimentos",
});

const destaques = [
  {
    slug: "alinhadores",
    nome: "Alinhadores Ortoative",
    href: "/alinhadores",
    imagem: "/images/procedimentos/alinhadores.avif",
  },
  {
    slug: "ortodontia-fixa",
    nome: "Ortodontia Fixa",
    href: "/procedimentos/ortodontia-fixa",
    imagem: "/images/procedimentos/ortodontia-fixa.avif",
  },
  {
    slug: "implantes",
    nome: "Implantes",
    href: "/procedimentos/implantes",
    imagem: "/images/procedimentos/implantes.avif",
  },
  {
    slug: "estetica",
    nome: "Estética (lentes e facetas)",
    href: "/procedimentos/estetica",
    imagem: "/images/procedimentos/estetica.avif",
  },
];

export default function ProcedimentosPage() {
  const todos = [
    ...destaques,
    ...procedimentosGrade.map((p) => ({ ...p, href: `/procedimentos/${p.slug}` })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28">
      <h1 className="text-4xl md:text-5xl">Procedimentos</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Do alinhamento à reabilitação completa: tudo em um só lugar, com equipe
        especializada em cada área.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todos.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className="group block overflow-hidden rounded-xl border border-border/70 transition-colors hover:bg-realce"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={p.imagem}
                alt={p.nome}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                {...previa(p.imagem)}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg group-hover:text-primary">{p.nome}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
