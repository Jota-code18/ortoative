import EsqueletoDePagina from "@/components/EsqueletoDePagina";

/** Esqueleto exibido enquanto a rota é buscada. */
export default function Carregando() {
  return <EsqueletoDePagina blocos={1} colunas="grid-cols-1" />;
}
