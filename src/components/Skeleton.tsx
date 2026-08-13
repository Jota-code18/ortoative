/**
 * Espaço reservado para conteúdo que ainda não chegou.
 *
 * Usado só onde não existe prévia da imagem: passeio 3D e troca de rota. Foto
 * tem LQIP (ver `lib/lqip.ts`), que é melhor — mostra a cor real em vez de um
 * cinza genérico.
 *
 * O brilho corre com `transform` em um pseudo-elemento, não com
 * `background-position`: animar posição de gradiente repinta a textura a cada
 * frame, e esse projeto já pagou caro por isso uma vez.
 */
export default function Skeleton({
  className = "",
  arredondado = "rounded-2xl",
}: {
  className?: string;
  /** classe de raio, para casar com o formato do bloco que está sendo esperado */
  arredondado?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`esqueleto ${arredondado} bg-muted ${className}`}
    />
  );
}
