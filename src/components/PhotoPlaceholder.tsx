type Props = {
  label: string;
  /** Caminho onde a foto real deve ser colocada (ver FOTOS.md) */
  path: string;
  className?: string;
};

/** Marcador visual de foto pendente — trocar por <Image> quando o arquivo existir */
export default function PhotoPlaceholder({ label, path, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted text-center ${className}`}
    >
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <code className="text-sm text-muted-foreground">{path}</code>
    </div>
  );
}
