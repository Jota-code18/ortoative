import Image from "next/image";
import Link from "next/link";
import { enderecoDe, unidades } from "@/lib/data";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-hero-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <Image
            src="/images/marca/logomarca.png"
            alt="Ortoative"
            width={180}
            height={92}
            className="h-14 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-base text-white/70">{site.tagline}</p>
        </div>

        <nav aria-label="Rodapé">
          {/* h2: o rodapé vem depois de h2 de seção — h4 criaria salto de nível */}
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-hero-glow">
            Navegação
          </h2>
          <ul className="space-y-2 text-base">
            {nav.map((item) => (
              <li key={item.href}>
                {/* py garante os 24px mínimos de alvo de toque (WCAG 2.5.8) */}
                <Link
                  href={item.href}
                  className="inline-block py-1 text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-hero-glow">
            Unidades
          </h2>
          <ul className="space-y-3 text-base text-white/80">
            {unidades.map((u) => (
              <li key={u.slug}>
                <span className="block font-semibold text-white">{u.nome}</span>
                <span className="block text-white/70">{enderecoDe(u)}</span>
                {u.cep && <span className="block text-white/70">CEP {u.cep}</span>}
              </li>
            ))}
          </ul>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block py-1 text-base text-white/80 hover:text-white"
          >
            @ortoativeoficial
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-base text-white/70">
        © {new Date().getFullYear()} Ortoative — Ortodontia Especializada. Todos os
        direitos reservados. ·{" "}
        <Link href="/privacidade" className="inline-block py-1 hover:text-white">
          Política de Privacidade
        </Link>
      </div>
    </footer>
  );
}
