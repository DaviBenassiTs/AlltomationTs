← [Anterior](01-introducao.md) | [Índice](../README.md) | [Próximo: Instalação →](03-instalacao.md)

# Capítulo 2 — Conhecendo o Playwright

## Conceito

Playwright é um framework de automação de navegadores e testes end-to-end, mantido pela Microsoft,
com suporte oficial a TypeScript/JavaScript, Python, .NET e Java. Neste treinamento usamos sempre
`@playwright/test`, o test runner oficial (não apenas a biblioteca de automação).

## Navegadores suportados

- **Chromium** (Chrome, Edge, Opera e outros são baseados nele).
- **Firefox**.
- **WebKit** (motor do Safari — é a única forma de testar comportamento "estilo Safari" no Linux/CI
  sem precisar de um Mac).

Cada um é baixado pelo próprio Playwright (`npx playwright install`), com uma versão fixa testada
pela equipe do projeto — isso evita o clássico problema de "funciona no Chrome da minha máquina,
mas não no do CI".

## Cross Browser

O mesmo teste roda nos 3 motores sem alterar uma linha de código, bastando declarar múltiplos
`projects` no `playwright.config.ts` (ver [`playwright.config.ts`](../playwright.config.ts) deste
projeto e o Capítulo 19). Isso é o que chamamos de execução *cross-browser*.

## Paralelismo

Por padrão, o Playwright Test roda **arquivos de teste** em paralelo, usando múltiplos *workers*
(processos). Cada worker tem seu próprio navegador e contexto — testes não competem por estado uns
com os outros. Ver Capítulo 20.

## Auto Waiting

Antes de qualquer ação (`click`, `fill`, `check`...), o Playwright espera automaticamente até o
elemento estar "acionável": anexado ao DOM, visível, estável (não animando), habilitado, e não
coberto por outro elemento. Isso elimina a necessidade de `sleep`/`waitForTimeout` manuais que
dominam frameworks mais antigos. Aprofundamos isso no Capítulo 15.

## Retries

É possível configurar reexecução automática de um teste que falhou (`retries` no config). Útil para
absorver instabilidades de ambiente em CI, mas **nunca deve ser usado para mascarar testes flaky mal
escritos** — retries escondem o sintoma, não corrigem a causa.

## Fixtures

Fixtures são o mecanismo de injeção de dependência do Playwright Test: cada teste "pede" (via
parâmetros da função) os recursos de que precisa (`page`, `context`, `request`, ou fixtures
personalizadas como as que criamos em [`fixtures/pages.fixture.ts`](../fixtures/pages.fixture.ts)).
Aprofundamos no Capítulo 11.

## Trace Viewer

O Trace Viewer é uma ferramenta visual (`npx playwright show-trace`) que reproduz passo a passo tudo
que aconteceu durante um teste: screenshots antes/depois de cada ação, DOM snapshot, console,
network e o próprio código-fonte do teste sincronizado com a timeline. É a principal ferramenta de
debug de testes que falharam em CI, onde você não pode simplesmente rodar de novo na sua máquina e
observar. Ver Capítulo 13.

## HTML Report

Um relatório HTML navegável, gerado após a execução (`reports/html-report/` neste projeto — ver
`reporter` em [`playwright.config.ts`](../playwright.config.ts)), com o resultado de cada teste,
tempo de execução, e link direto para trace, vídeo e screenshots de falhas.

## Exemplo simples

```typescript
import { test, expect } from '@playwright/test';

test('a home do saucedemo carrega', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page.getByText('Swag Labs')).toBeVisible();
});
```

Rode com `npx playwright test` — sem nenhuma configuração adicional, o Playwright já baixa o
navegador (se instalado), abre a página, espera o texto aparecer e reporta sucesso ou falha.

## Boas práticas

- Rode a suíte sempre nos 3 navegadores antes de um release importante, mesmo que no dia a dia você
  use só Chromium para ganhar velocidade (`npm run test:chromium` neste projeto).
- Nunca desative `trace`/`screenshot`/`video` em CI — são a sua única fonte de debug quando o teste
  falha longe da sua máquina.

## Erros comuns

- Confundir "Playwright" (a biblioteca) com "Playwright Test" (o test runner) — usamos sempre o
  segundo neste treinamento.
- Usar `retries` para "resolver" um teste flaky em vez de investigar a causa raiz.
- Ignorar o Trace Viewer e tentar debugar falhas de CI só lendo o log de texto.

## Exercício prático

Rode `npx playwright test --project=chromium` neste repositório, depois abra o relatório com
`npm run test:report`. Localize o tempo total de execução e o resultado de cada teste.

## Resumo

Playwright Test entrega, prontos: multi-navegador, paralelismo, auto-waiting, fixtures, retries,
trace e relatório HTML. Você escreve os testes; a infraestrutura de execução e debug já vem pronta.

## Checklist de revisão

- [ ] Sei a diferença entre Chromium, Firefox e WebKit no contexto do Playwright.
- [ ] Sei o que é auto-waiting e por que ele elimina `sleep`.
- [ ] Sei abrir e ler um Trace.
- [ ] Sei abrir o relatório HTML.

## Perguntas para fixação

1. Por que testar em WebKit no Linux é útil, mesmo sem ter um Mac?
2. O que o auto-waiting verifica antes de clicar em um elemento?
3. Qual a diferença entre usar `retries` para instabilidade de ambiente e usar `retries` para
   mascarar um teste flaky?
4. Para que serve o Trace Viewer e quando ele é mais útil que rodar o teste de novo localmente?

## Desafio opcional

Force um teste a falhar de propósito (ex.: mude um `getByText` para um texto que não existe) e rode
`npx playwright test --project=chromium`. Abra o trace da falha com `npx playwright show-trace` e
identifique exatamente em qual ação o teste travou.

---
← [Anterior](01-introducao.md) | [Índice](../README.md) | [Próximo: Instalação →](03-instalacao.md)
