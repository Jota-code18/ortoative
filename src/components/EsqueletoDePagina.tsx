import Skeleton from "@/components/Skeleton";

/**
 * Esqueleto das páginas internas enquanto o React Server Component é buscado.
 *
 * O desenho copia o esqueleto real dessas páginas — título grande, uma linha
 * de apoio e uma grade — porque esqueleto que não tem a forma do que vem
 * depois causa o pulo que ele deveria evitar.
 *
 * `pt-28` casa com o respiro que as páginas internas dão ao header fixo.
 */
export default function EsqueletoDePagina({
  blocos = 4,
  colunas = "md:grid-cols-2",
}: {
  /** quantos cartões a grade reserva */
  blocos?: number;
  colunas?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28">
      <Skeleton className="h-12 w-3/4 max-w-xl md:h-14" arredondado="rounded-xl" />
      <Skeleton className="mt-5 h-5 w-full max-w-2xl" arredondado="rounded-lg" />
      <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" arredondado="rounded-lg" />

      <div className={`mt-10 grid gap-5 ${colunas}`}>
        {Array.from({ length: blocos }).map((_, i) => (
          // índice como chave é seguro: a lista é fixa e nunca reordena
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </div>
  );
}
