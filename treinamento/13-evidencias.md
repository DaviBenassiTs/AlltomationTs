← [Anterior](12-hooks.md) | [Índice](../README.md) | [Próximo: Playwright Codegen →](14-codegen.md)

# Capítulo 13 — Captura de Evidências

## Conceito

Quando um teste falha em CI (onde você não pode simplesmente observar a tela), a única forma de
diagnosticar é através das evidências que o Playwright captura automaticamente: screenshot, vídeo,
trace e relatório HTML.

## Configuração usada neste projeto

```typescript
// playwright.config.ts
use: {
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
reporter: [
  ['html', { outputFolder: 'reports/html-report', open: 'never' }],
  ['list'],
],
```

## Como gerar cada evidência

- **Screenshot** (`screenshot: 'only-on-failure'`): tira uma captura de tela automaticamente só
  quando o teste falha — evita gastar espaço em disco com capturas de testes que passaram.
- **Vídeo** (`video: 'retain-on-failure'`): grava a execução inteira do teste, mas só **mantém** o
  arquivo se o teste falhar (testes que passam têm o vídeo descartado ao final).
- **Trace** (`trace: 'retain-on-failure'`): grava uma timeline completa (DOM snapshots, network,
  console, ações) e mantém o arquivo `.zip` apenas em falhas.
- **Relatório HTML**: gerado sempre, ao final da execução completa, em `reports/html-report/` (ver
  `outputDir`/`reporter` em [`playwright.config.ts`](../playwright.config.ts)).

## Como abrir cada evidência

```bash
npm run test:report          # abre o relatório HTML da última execução
npx playwright show-trace traces/test-results/<pasta-do-teste>/trace.zip
```

O relatório HTML já traz botões para abrir trace/vídeo/screenshot diretamente de dentro dele — na
prática, você raramente precisa navegar manualmente até a pasta `traces/`.

## Como interpretar

No relatório HTML, cada teste reprovado mostra:

1. A mensagem de erro da assertion que falhou (ex.: "expected locator to be visible").
2. Um botão para abrir o **Trace Viewer**, onde você navega ação por ação, vendo o DOM, o console e a
   rede no momento exato de cada passo — inclusive o passo que causou a falha.
3. O vídeo da execução, útil para ver problemas visuais (elemento sobreposto, layout quebrado) que
   não aparecem claramente em uma screenshot única.

## Boas práticas

- Nunca desative essas três opções em CI — sem elas, uma falha intermitente em pipeline é quase
  impossível de diagnosticar.
- Use `retain-on-failure` (não `on`) para vídeo/trace em execuções normais — gravar tudo sempre
  consome disco e tempo desnecessariamente.
- Garanta que as pastas de evidência (`reports/`, `screenshots/`, `videos/`, `traces/`) estejam no
  `.gitignore` (ver [`.gitignore`](../.gitignore)) — são artefatos de execução, não código-fonte.

## Erros comuns

- Deixar `trace`/`video`/`screenshot` desligados "para ganhar velocidade" e descobrir, só quando um
  teste falha em CI, que não há nenhuma pista do que aconteceu.
- Versionar pastas de evidência no Git, inflando o repositório com binários (vídeos, imagens) que
  mudam a cada execução.
- Configurar `trace: 'on'` permanentemente em ambientes com poucos recursos, tornando a suíte
  lenta sem necessidade.

## Exercício prático

Force uma falha (troque temporariamente `ProductName.BACKPACK` por um texto que não existe em
[`tests/products.spec.ts`](../tests/products.spec.ts)), rode `npx playwright test --project=chromium`,
depois `npm run test:report`, e abra o trace da falha. Reverta a alteração depois.

## Resumo

Screenshot, vídeo e trace, retidos só em falha, mais o relatório HTML gerado sempre, formam o kit de
diagnóstico do Playwright. Configurados uma vez em `playwright.config.ts`, funcionam para toda a
suíte sem esforço adicional em cada teste.

## Checklist de revisão

- [ ] `trace`, `screenshot` e `video` estão configurados como `retain-on-failure`/`only-on-failure`.
- [ ] As pastas de evidência estão no `.gitignore`.
- [ ] Já abri um trace real ao menos uma vez e sei navegar pela timeline de ações.

## Perguntas para fixação

1. Por que `retain-on-failure` é preferível a `on` para vídeo e trace no dia a dia?
2. O que o Trace Viewer mostra que uma screenshot isolada não mostra?
3. Por que as pastas de evidência não deveriam ser versionadas no Git?
4. Quais três evidências o Playwright pode capturar automaticamente em uma falha?

## Desafio opcional

Configure `trace: 'on-first-retry'` em vez de `'retain-on-failure'` e explique, em texto, a diferença
de comportamento e por que essa opção é uma boa escolha para ambientes de CI com `retries` habilitado.

---
← [Anterior](12-hooks.md) | [Índice](../README.md) | [Próximo: Playwright Codegen →](14-codegen.md)
