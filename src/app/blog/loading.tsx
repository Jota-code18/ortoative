import EsqueletoDePagina from "@/components/EsqueletoDePagina";

/** Esqueleto exibido enquanto a rota é buscada. */
export default function Carregando() {
  return <EsqueletoDePagina blocos={3} colunas="md:grid-cols-3" />;
}
