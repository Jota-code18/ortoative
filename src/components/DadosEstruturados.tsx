import { equipe, unidades as listaUnidades } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * Schema.org para o Google entender que isto é uma clínica odontológica com
 * duas unidades — é o que faz aparecer em busca local e no painel lateral.
 * A proposta pede MedicalOrganization / Dentist explicitamente.
 */
export default function DadosEstruturados() {
  const telefone = `+${site.whatsapp}`;

  const unidades = listaUnidades.map((u) => ({
    "@type": "Dentist",
    "@id": `${site.url}/#${u.slug}`,
    name: `Ortoative — ${u.nome}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: [u.rua, u.bairro].filter(Boolean).join(", "),
      addressLocality: u.cidade,
      addressRegion: u.uf,
      ...(u.cep ? { postalCode: u.cep } : {}),
      addressCountry: "BR",
    },
    telephone: telefone,
    image: `${site.url}${u.fachada}`,
  }));

  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalOrganization", "Dentist"],
        "@id": `${site.url}/#clinica`,
        name: site.name,
        description: site.tagline,
        url: site.url,
        telephone: telefone,
        logo: `${site.url}/images/marca/logomarca.png`,
        image: `${site.url}/images/marca/logomarca.png`,
        sameAs: [site.instagram],
        foundingDate: "1999",
        areaServed: [
          { "@type": "City", name: "Anápolis" },
          { "@type": "City", name: "Goianésia" },
        ],
        medicalSpecialty: "Dentistry",
        availableService: [
          "Alinhadores invisíveis",
          "Ortodontia fixa",
          "Implantes",
          "Estética (lentes e facetas)",
          "Prótese",
          "Canal",
          "Tratamento de gengivas",
          "Cirurgias",
        ].map((nome) => ({ "@type": "MedicalProcedure", name: nome })),
        subOrganization: unidades,
        employee: equipe.map((p) => ({
          "@type": "Person",
          name: p.nome,
          jobTitle: p.titulo,
          image: `${site.url}${p.foto}`,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": `${site.url}/#clinica` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // conteúdo próprio, sem entrada de usuário
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
