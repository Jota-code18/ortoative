/**
 * Linha fina entre duas seções de mesmo fundo.
 *
 * Com as seções compactas no celular, uma termina e a outra começa sem nada
 * entre elas — a leitura vira um bloco só. A linha marca onde um assunto acaba
 * sem pesar como uma faixa colorida.
 *
 * Apaga nas pontas de propósito: uma régua de ponta a ponta desenharia uma
 * borda de caixa, e a página não tem caixas.
 */
export default function Divisa() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <hr
        className="h-px border-0"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in oklch, var(--primary) 38%, transparent) 18%, color-mix(in oklch, var(--primary) 38%, transparent) 82%, transparent)",
        }}
      />
    </div>
  );
}
