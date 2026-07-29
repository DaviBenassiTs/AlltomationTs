← [Anterior](18-variaveis-ambiente.md) | [Índice](00-indice.md) | [Próximo: Paralelismo →](20-paralelismo.md)

# Capítulo 19 — Configuração do Playwright

## Conceito

`playwright.config.ts` é o arquivo central que define como a suíte inteira roda: onde estão os
testes, quantos navegadores usar, timeouts, retries, reporters e opções padrão de cada execução.

## Arquivo completo do projeto

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
  ],

  outputDir: 'traces/test-results',

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Explicação de cada propriedade

- **`testDir`**: pasta raiz onde o Playwright procura arquivos `*.spec.ts`. Aqui, `./tests`.
- **`timeout`**: tempo máximo (ms) que **um teste inteiro** pode rodar antes de ser marcado como
  falho por timeout. `30_000` = 30 segundos.
- **`expect.timeout`**: tempo máximo que **uma assertion individual** (`expect(locator)...`) espera
  antes de falhar — diferente do `timeout` geral do teste. `5_000` = 5 segundos por assertion.
- **`fullyParallel`**: quando `true`, cada **teste** (não só cada arquivo) roda em paralelo,
  distribuído entre os workers disponíveis — maximiza o uso dos workers configurados.
- **`forbidOnly`**: quando `true` (aqui, só em CI via `!!process.env.CI`), a execução falha se
  alguém esquecer um `test.only(...)` no código — evita que só um teste rode "por acidente" em
  produção do pipeline.
- **`retries`**: quantas vezes reexecutar automaticamente um teste que falhou. `2` em CI (absorve
  instabilidade pontual de ambiente); `0` localmente (você quer ver a falha real na hora, não uma
  segunda tentativa mascarando o problema).
- **`workers`**: quantos processos paralelos rodam a suíte. `4` fixo em CI (ambiente com recursos
  previsíveis); `undefined` localmente (o Playwright decide com base nos núcleos de CPU disponíveis).
- **`reporter`**: lista de "formatos de saída" do resultado da execução. Aqui, HTML (salvo em
  `reports/html-report`) e `list` (saída de texto no terminal, linha a linha).
- **`outputDir`**: pasta onde ficam os artefatos brutos de execução (traces, vídeos, resultados por
  teste) antes de serem referenciados pelo relatório HTML.
- **`use`**: opções padrão aplicadas a **todo** teste/projeto, a menos que um projeto sobrescreva:
  - `baseURL`: permite usar `page.goto('/inventory.html')` (caminho relativo) em vez da URL completa
    em todo Page Object — ver `goto()` em [`pages/base.page.ts`](../pages/base.page.ts).
  - `trace`/`screenshot`/`video`: ver Capítulo 13.
  - `actionTimeout`/`navigationTimeout`: timeouts específicos para uma ação (clique, preenchimento) e
    para uma navegação (`goto`), respectivamente — mais granular que o `timeout` geral do teste.
- **`projects`**: cada entrada roda a suíte **inteira** com uma configuração de navegador diferente
  (`devices['Desktop Chrome']`, etc.) — é o que viabiliza a execução cross-browser do Capítulo 2.

## Boas práticas

- Nunca use `retries` localmente do mesmo jeito que em CI — você quer ver a falha de primeira ao
  desenvolver, não escondida atrás de tentativas automáticas.
- Sempre ative `forbidOnly` em CI, para pegar um `test.only` esquecido antes que ele vire "a suíte
  inteira só rodou 1 teste e todo mundo achou que passou tudo".
- Use `baseURL` e caminhos relativos nos Page Objects (nunca a URL inteira hardcoded), para trocar de
  ambiente sem tocar em código de Page.

## Erros comuns

- Configurar `retries` alto (ex.: 5) para "resolver" flakiness em vez de investigar a causa raiz —
  isso só aumenta o tempo total da suíte sem resolver o problema de verdade.
- Deixar `workers` fixo e baixo mesmo em máquinas com muitos núcleos, desperdiçando paralelismo
  disponível.
- Hardcodar a URL completa (`https://www.saucedemo.com/inventory.html`) em vez de usar `baseURL` +
  caminho relativo, dificultando trocar de ambiente.

## Exercício prático

Adicione um novo projeto ao array `projects` chamado `mobile-chrome`, usando
`devices['Pixel 7']`, e rode `npx playwright test --project=mobile-chrome` para ver a suíte de login
rodando em viewport mobile.

## Resumo

`playwright.config.ts` centraliza tudo que não é específico de um teste: onde estão os testes,
quantos workers, timeouts, retries, reporters, opções padrão (`use`) e quais navegadores/dispositivos
(`projects`) rodam a suíte.

## Checklist de revisão

- [ ] Sei explicar a diferença entre `timeout` (do teste) e `expect.timeout` (da assertion).
- [ ] Sei por que `retries` é diferente entre ambiente local e CI neste projeto.
- [ ] Sei o que `baseURL` permite simplificar nos Page Objects.

## Perguntas para fixação

1. Qual a diferença entre `actionTimeout` e `navigationTimeout`?
2. Por que `forbidOnly` só é ativado quando `process.env.CI` existe?
3. O que `fullyParallel: true` muda em relação ao comportamento padrão (paralelismo por arquivo)?
4. Por que `retries` deveria ser `0` no ambiente local de desenvolvimento?

## Desafio opcional

Configure um `timeout` global mais agressivo (`10_000`) apenas para o projeto `webkit` (sabendo que
WebKit costuma ser mais lento em certas operações), sobrescrevendo o valor padrão só para esse
navegador, sem alterar o timeout dos demais.

---
← [Anterior](18-variaveis-ambiente.md) | [Índice](00-indice.md) | [Próximo: Paralelismo →](20-paralelismo.md)
