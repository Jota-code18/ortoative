# Mapa de fotos — onde colocar cada arquivo

O site já mostra um marcador tracejado no lugar de cada foto pendente, com o caminho
esperado escrito nele. Basta colocar o arquivo com o nome certo na pasta certa e me avisar
— eu troco o marcador pela imagem real (WebP otimizado).

## Hero (topo da home)
| Arquivo | Conteúdo |
|---|---|
| `public/images/hero/sorrisos.jpg` | Adolescentes/pessoas sorrindo (foto ou vídeo `.mp4`) |

## Clínica (seção equipe + local)
| Arquivo | Conteúdo |
|---|---|
| `public/images/clinica/interior-01.jpg` | Interior da clínica |
| `public/images/clinica/interior-02.jpg` | Interior da clínica |
| `public/images/clinica/interior-03.jpg` | Interior da clínica |

## Equipe
| Arquivo | Conteúdo |
|---|---|
| `public/images/equipe/equipe.jpg` | Foto profissional do time em conjunto |
| `public/images/equipe/rui.jpg` | Dr. Rui Cambauva |
| `public/images/equipe/adriana.jpg` | Dra. Adriana Cambauva |
| `public/images/equipe/jessica.jpg` | Dra. Jessica Fonseca |
| `public/images/equipe/isabella.jpg` | Dra. Isabella Barcelos |
| `public/images/equipe/priscilla.jpg` | Dra. Priscilla Carvalho |

## Antes & Depois
| Arquivo | Conteúdo |
|---|---|
| `public/images/antes-depois/caso-01.jpg` … `caso-NN.jpg` | Casos (ideal: lado a lado numa imagem, ou pares `caso-01-antes.jpg` + `caso-01-depois.jpg`) |
| `public/images/antes-depois/implantes-01.jpg` etc. | Casos por procedimento (usados nas páginas internas) |

## Fábrica / Tecnologia
| Arquivo | Conteúdo |
|---|---|
| `public/images/fabrica/laboratorio-01.jpg` | Laboratório |
| `public/images/fabrica/scanner-01.jpg` | Scanner 3D |
| `public/images/fabrica/impressao-01.jpg` | Impressão / produção |
| `public/images/fabrica/acabamento-01.jpg` | Acabamento |
| `public/images/fabrica/producao-01.jpg` | Produção do alinhador (página Alinhadores) |

## Procedimentos (quadrados da grade)
| Arquivo | Conteúdo |
|---|---|
| `public/images/procedimentos/alinhadores.jpg` | Alinhadores |
| `public/images/procedimentos/ortodontia-fixa.jpg` | Ortodontia fixa |
| `public/images/procedimentos/implantes.jpg` | Implantes |
| `public/images/procedimentos/estetica.jpg` | Estética |
| `public/images/procedimentos/estetica-destaque.jpg` | Destaque estética (home) |
| `public/images/procedimentos/protese.jpg` | Prótese |
| `public/images/procedimentos/canal.jpg` | Canal |
| `public/images/procedimentos/gengivas.jpg` | Gengivas |
| `public/images/procedimentos/cirurgias.jpg` | Cirurgias |

## Para Dentistas
| Arquivo | Conteúdo |
|---|---|
| `public/images/dentistas/rui-apresentacao.jpg` | Dr. Rui em aula/apresentação |

## Modelos 3D (pendentes)
| Arquivo | Conteúdo |
|---|---|
| `public/models/alinhador.glb` | Alinhador girando (home + página alinhadores) |
| `public/models/aparelho-fixo.glb` | Aparelho fixo girando |
| `public/models/implante.glb` | Implante girando |
| `public/models/consultorio.glb` | Consultório (tour 3D futuro) |

## Outros pendentes (não são fotos)
- Número de WhatsApp da secretária → `src/lib/site.ts` (`whatsapp`)
- Números oficiais (sorrisos transformados, clientes, procedimentos) → `src/lib/data.ts` (`stats`)
- Depoimentos reais (nome, idade, procedimento) → `src/lib/data.ts` (`depoimentos`)
