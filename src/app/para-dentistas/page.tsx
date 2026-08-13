import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { whatsappLink } from "@/lib/site";
import { metadataDaPagina } from "@/lib/seo";


export const metadata = metadataDaPagina({
  titulo: "Para Dentistas",
  descricao:
    "Cursos, mentorias e parceria com o Prof. Dr. Rui Cambauva — autor de dois livros de Ortodontia e fabricante de alinhadores em Anápolis.",
  caminho: "/para-dentistas",
});

export default function ParaDentistasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28">
      <h1 className="text-4xl md:text-5xl">Ortoative para Dentistas</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Aprenda ortodontia com quem escreveu o livro — literalmente. Formação prática
        com o Prof. Dr. Rui Cambauva e a estrutura de quem fabrica o próprio alinhador.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/70 p-6 transition-colors hover:bg-realce">
          <h2 className="text-xl">Autoridade comprovada</h2>
          <ul className="mt-4 space-y-2 text-base text-muted-foreground">
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Autor de ORTODONTIA – Diagnóstico Clínico & Cefalométrico</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Autor de Construindo VTO: guia passo-a-passo</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Esp., Me. e Dr. em Ortodontia; Esp. e Me. em Radiologia</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Ex-professor: UNAERP, UNIFEB, SLMANDIC e FUNORTE</span></li>
          </ul>
        </div>
        <PhotoPlaceholder
          label="Foto: Dr. Rui — aulas / livros"
          path="public/images/dentistas/rui-apresentacao.jpg"
          className="aspect-[4/3]"
        />
      </div>

      {/* TODO: detalhar cursos/mentorias oferecidos + formato de parceria */}
      <a
        href={whatsappLink("Oi! Sou dentista e quero saber mais sobre os cursos e parcerias da Ortoative.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground hover:bg-brand-blue"
      >
        Quero aprender com o Dr. Rui
      </a>
    </div>
  );
}
