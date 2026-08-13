# Por que cada regra do Biome foi desligada

Regra desligada sem motivo escrito vira regra desligada para sempre. Cada
exceção em `biome.json` está justificada aqui. Ao remover a causa, remova
também a exceção.

| Onde | Regra | Motivo |
|---|---|---|
| `scripts/**` | `noConsole` | O `console` **é** a saída de um script de linha de comando. Silenciá-lo tiraria o relatório de conversão de imagem. |
| `e2e/**`, `testes/**` | `noExcessiveCognitiveComplexity`, `useIterableCallbackReturn` | Callback de `page.evaluate` roda no navegador e costuma varrer o DOM inteiro. A complexidade está no que se mede, não no design. |
| `DadosEstruturados.tsx` | `noDangerouslySetInnerHtml` | JSON-LD exige `<script type="application/ld+json">` com conteúdo bruto. O dado é próprio, montado no servidor, sem nada vindo do usuário. |
| `ModelViewer.tsx` | `noImgElement`, `useAriaPropsSupportedByRole` | O `poster` aparece antes de o custom element `<model-viewer>` hidratar. Passar pelo `next/image` inseriria um wrapper que quebra o slot do elemento. |
| `WhatsAppButton.tsx` | `useAnchorContent` | O link é um ícone. O nome acessível vem de `aria-label`, com o SVG em `aria-hidden` — que é o padrão correto, não a ausência de conteúdo que a regra imagina. |
| `CenaClinica3D.tsx`, `QuizInline.tsx` | `noExcessiveCognitiveComplexity` | Um monta uma cena three.js completa; o outro é uma máquina de estados de triagem ramificada. Quebrar em funções menores espalharia estado sem reduzir a complexidade real. |
| `CarrosselTratamentos.tsx` | `useSemanticElements`, `useExhaustiveDependencies` | `role="region"` com `aria-roledescription="carrossel"` é o padrão ARIA para carrossel — não existe elemento nativo. E `ativo` é lido só no `resize`: incluí-lo nas dependências recriaria todos os listeners a cada slide. |
| `EsqueletoDePagina.tsx`, `Quiz.tsx`, `QuizInline.tsx`, `Header.tsx` | `noArrayIndexKey`, `useExhaustiveDependencies` | Listas de tamanho fixo que nunca reordenam (segmentos da barra de progresso, blocos do esqueleto). O índice é estável por construção. |
| `src/app/globals.css` | arquivo inteiro | O Biome ainda não entende a sintaxe do Tailwind v4 (`@theme inline`, `@custom-variant`) e reporta erro de parse no que é CSS válido. |
