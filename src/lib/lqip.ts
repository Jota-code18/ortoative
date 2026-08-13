import manifesto from "./lqip.json";

/**
 * Prévia borrada de uma foto, para o `next/image` pintar algo no lugar
 * enquanto o arquivo real não chega.
 *
 * O manifesto é gerado por `npm run imagens:avif`: 16px de largura em WebP,
 * embutido em base64. Nesse tamanho o dado cabe no HTML sem pesar e já carrega
 * a cor média da foto — o espaço nunca fica cinza morto, ele já nasce com a
 * cor certa e entra em foco.
 *
 * Roda no servidor. É de propósito: virar componente de cliente só para isso
 * colocaria uma fronteira React em cada uma das 33 imagens do site.
 *
 * @example
 * <Image src={foto} alt="..." fill {...previa(foto)} />
 */
export function previa(src: string) {
  const dado = (manifesto as Record<string, string>)[src];
  return dado ? { placeholder: "blur" as const, blurDataURL: dado } : {};
}
