import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { metadataDaPagina } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

/**
 * Página genérica de procedimento — conteúdo detalhado entra por etapa.
 * Notion: cada procedimento mostrará casos reais filtrados pelo perfil
 * do paciente + interações (ex.: Alinhador vs Aparelho fixo).
 */

/**
 * `descricao` é a linha de resumo (usada também na metadata da página).
 * `detalhes` explica o tratamento para quem nunca ouviu falar dele — é o
 * texto que o card da grade não carrega.
 */
const conteudo: Record<
  string,
  { nome: string; descricao: string; detalhes: string[] }
> = {
  "ortodontia-fixa": {
    nome: "Ortodontia Fixa",
    descricao:
      "Aparelho colado aos dentes, do caso simples ao complexo. Trabalha o tempo todo, sem depender de disciplina de uso.",
    detalhes: [
      "O aparelho fixo é formado por pequenas peças coladas em cada dente — os bráquetes — ligadas por um fio que aplica uma força contínua e leve. É essa força que move os dentes para a posição planejada, milímetro a milímetro.",
      "Como não sai da boca, o tratamento acontece 24 horas por dia e não depende de o paciente lembrar de recolocar nada. Por isso continua sendo a escolha mais previsível para mordidas complexas, dentes muito girados ou casos que exigem movimentos maiores.",
      "Existem versões estéticas, com peças da cor do dente, para quem se incomoda com a aparência metálica. As consultas de ajuste são mais frequentes que no alinhador, e é nelas que o especialista corrige o rumo do tratamento.",
    ],
  },
  implantes: {
    nome: "Implantes",
    descricao:
      "Pino de titânio fixado no osso que substitui a raiz perdida e sustenta um dente novo, firme como o natural.",
    detalhes: [
      "O implante é um pino de titânio colocado no osso da arcada, no lugar da raiz que se perdeu. Com o tempo o osso se integra a ele, criando uma base firme — é sobre essa base que se instala a coroa, a parte visível do dente.",
      "A diferença para uma prótese removível é a estabilidade: o implante não sai do lugar, não precisa de adesivo e permite morder com força próxima à do dente natural. Também preserva o osso, que tende a diminuir quando um dente é perdido e nada ocupa aquele espaço.",
      "O planejamento é feito por imagem antes de qualquer procedimento, para definir posição, ângulo e tamanho. Entre a colocação do pino e a coroa definitiva há um período de cicatrização, acompanhado de perto pela equipe.",
    ],
  },
  estetica: {
    nome: "Estética — Lentes e Facetas",
    descricao:
      "Lâminas finas que corrigem cor, formato e proporção dos dentes. Você vê o resultado planejado antes de começar.",
    detalhes: [
      "Lentes de contato dental e facetas são lâminas finíssimas fixadas na frente do dente. Elas corrigem cor, formato, tamanho e pequenos desalinhamentos sem precisar mover os dentes de lugar.",
      "A diferença entre as duas está na espessura e no quanto de dente precisa ser preparado: a lente é mais fina e exige pouquíssimo desgaste; a faceta é indicada quando há mais correção a fazer. A escolha depende do seu caso, não de moda.",
      "Antes de começar, o sorriso é planejado digitalmente e você vê a simulação do resultado. Nada é definitivo até essa etapa ser aprovada por você.",
    ],
  },
  protese: {
    nome: "Prótese",
    descricao:
      "Repõe dentes perdidos com peças fixas ou removíveis, devolvendo mastigação, fala e aparência natural.",
    detalhes: [
      "Prótese é o nome do que substitui dentes que já não estão lá. Pode repor um único dente, vários ou a arcada inteira, e existe em versão fixa — que só o dentista remove — ou removível, que o paciente tira para higienizar.",
      "A perda de dentes muda mais coisas do que a aparência: afeta a mastigação, altera a fala e sobrecarrega os dentes que restaram. Repor devolve função e evita que o problema aumente.",
      "Quando há osso suficiente, a prótese pode ser apoiada em implantes, o que elimina o incômodo de peças que se soltam. Essa avaliação é feita caso a caso, com exame de imagem.",
    ],
  },
  canal: {
    nome: "Canal",
    descricao:
      "Trata a parte interna do dente inflamada ou infeccionada. Acaba com a dor e preserva o dente em vez de extrair.",
    detalhes: [
      "Dentro de cada dente existe um tecido com nervos e vasos, a polpa. Quando uma cárie profunda, uma trinca ou uma pancada atinge essa parte, o tecido inflama ou infecciona — e é aí que aparece aquela dor forte, muitas vezes latejante.",
      "O tratamento de canal remove esse tecido comprometido, limpa e desinfeta o interior do dente e o preenche com um material selador. O dente continua no lugar, cumprindo sua função.",
      "Ao contrário da fama que carrega, o procedimento é feito sob anestesia e serve justamente para acabar com a dor. Depois do canal, o dente costuma precisar de uma coroa para voltar a resistir bem à mastigação.",
    ],
  },
  gengivas: {
    nome: "Tratamento de Gengivas",
    descricao:
      "Cuida da gengiva e do osso que sustentam os dentes. Sangramento, retração e mau hálito têm tratamento.",
    detalhes: [
      "A gengiva e o osso são a base que segura os dentes. Quando a placa bacteriana se acumula abaixo da linha da gengiva, essa base inflama — primeiro com sangramento ao escovar, depois com retração e, nos casos avançados, com afrouxamento dos dentes.",
      "Gengiva que sangra não é normal e não passa sozinha. Quanto antes for tratada, mais simples é o procedimento: muitas vezes basta uma limpeza profunda e o ajuste da higiene em casa.",
      "A periodontia também cuida da parte estética: sorriso gengival, contorno irregular e raízes expostas têm correção. E há relação comprovada entre saúde da gengiva e saúde geral, especialmente em quem tem diabetes ou problemas cardíacos.",
    ],
  },
  cirurgias: {
    nome: "Cirurgias",
    descricao:
      "Extração de sisos e outras cirurgias da boca, com planejamento por imagem e recuperação acompanhada de perto.",
    detalhes: [
      "Nem todo siso precisa sair, mas quando ele nasce torto, sem espaço ou preso no osso, tende a empurrar os outros dentes, inflamar a gengiva e acumular infecção. Nesses casos a remoção evita um problema maior à frente.",
      "Além dos sisos, a cirurgia oral resolve raízes que sobraram, dentes muito danificados, preparo do osso para receber implante e remoção de lesões para exame.",
      "Todo procedimento começa por exame de imagem, que mostra a posição exata do dente e sua relação com nervos e seios da face. É esse planejamento que torna a cirurgia mais rápida e a recuperação mais tranquila.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(conteudo).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = conteudo[slug];
  if (!proc) return {};
  return metadataDaPagina({
    titulo: proc.nome,
    descricao: proc.descricao,
    caminho: `/procedimentos/${slug}`,
  });
}

export default async function ProcedimentoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proc = conteudo[slug];
  if (!proc) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-28">
      <h1 className="text-4xl md:text-5xl">{proc.nome}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{proc.descricao}</p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <Image
          src={`/images/procedimentos/${slug}.jpg`}
          alt={proc.nome}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 900px"
          className="aspect-[3/2] w-full object-cover"
          priority
        />
      </div>

      {/* O texto longo vive aqui, não no card da grade */}
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted-foreground">
        {proc.detalhes.map((paragrafo) => (
          <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
        ))}
      </div>

      {/* TODO: casos reais com filtro por perfil do paciente */}
      <PhotoPlaceholder
        label={`Casos reais: ${proc.nome}`}
        path={`public/images/antes-depois/${slug}-01.jpg`}
        className="mt-10 aspect-[16/7]"
      />

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/agende"
          className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-brand-blue"
        >
          Agendar avaliação
        </Link>
        <a
          href={whatsappLink(`Oi! Quero saber mais sobre ${proc.nome} na Ortoative.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-brand-green px-6 py-3 font-bold text-brand-green-text hover:bg-brand-green hover:text-white"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
