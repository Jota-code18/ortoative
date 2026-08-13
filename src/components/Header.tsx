"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

/**
 * Notion: header só aparece quando o scroll desce ou após 10s da entrada.
 * Entrada animada "vindo do fundo do site" (sobe de baixo + fade).
 * Enquanto está sobre a hero escura, o header também fica escuro.
 */
export default function Header() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    const onScroll = () => {
      if (window.scrollY > 40) setVisible(true);
      setOverHero(!!hero && window.scrollY < hero.offsetHeight - 64);
    };

    const timer = setTimeout(() => setVisible(true), 10_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <header
      /* Sem backdrop-blur: o filtro de fundo é recomposto a cada frame de
         scroll num elemento fixo — custo alto. Alpha maior dá leitura
         equivalente de graça. */
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-700 ease-out ${
        overHero
          ? "sobre-hero border-white/15 bg-hero-dark/85"
          : "border-border/40 bg-background/88"
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-start gap-5 px-4 md:gap-8">
        <Link
          href="/"
          aria-label="Ortoative — Início"
          className="flex shrink-0 items-center"
        >
          <Image
            src={overHero ? "/images/marca/simbolo-neg.png" : "/images/marca/simbolo.png"}
            alt="Ortoative"
            width={40}
            height={41}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Linha única em todas as resoluções (sem menu sanduíche).
            Desliza no mobile, sem barra de rolagem visível. */}
        <nav
          className="no-scrollbar flex items-center gap-0.5 overflow-x-auto whitespace-nowrap md:gap-1"
          aria-label="Principal"
        >
          {nav.map((item) =>
            "cta" in item && item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                /* py maior no mobile: alvo de toque de 44px (WCAG 2.5.8) */
                className={`ml-1 flex min-h-[44px] items-center rounded-full px-3 text-sm font-bold transition-colors md:min-h-0 md:px-4 md:py-2 ${
                  overHero
                    ? "bg-brand-green-btn text-white hover:brightness-110"
                    : "bg-primary text-primary-foreground hover:bg-brand-blue"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[44px] items-center rounded-full px-2 text-sm font-semibold transition-colors md:min-h-0 md:px-3 md:py-2 ${
                  overHero
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-foreground/80 hover:bg-realce hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
