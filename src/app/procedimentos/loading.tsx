import EsqueletoDePagina from "@/components/EsqueletoDePagina";

/** Esqueleto exibido enquanto a rota é buscada. */
export default function Carregando() {
  return <EsqueletoDePagina blocos={6} colunas="sm:grid-cols-2 lg:grid-cols-3" />;
}
