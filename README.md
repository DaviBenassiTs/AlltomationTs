# Framework de Automacao — Playwright + TypeScript + POM

> Curso completo, do zero ao framework profissional, ministrado no estilo de um QA Automation Lead.
> Todo o código mostrado aqui é **real e executável** — ele vive neste mesmo repositório.
> Rode `npm install && npx playwright install && npm test` na raiz do projeto para ver tudo funcionando
> contra o [saucedemo.com](https://www.saucedemo.com), aplicação pública mantida para prática de automação.

Projeto real, executavel, que acompanha o treinamento em [`treinamento/`](treinamento/).
A aplicacao sob teste (UI) e a [saucedemo.com](https://www.saucedemo.com), um site publico mantido
pela Sauce Labs especificamente para pratica de automacao de testes. Os testes de API
(`tests/api.spec.ts`) usam a [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com),
tambem publica e gratuita para prototipagem/treino.

## Como usar este material

Cada capítulo segue sempre a mesma estrutura: Conceito → Quando usar → Vantagens/Desvantagens →
Exemplo prático → Código comentado linha a linha → Boas práticas → Erros comuns → Exercício →
Resumo → Checklist → Perguntas de fixação → Desafio opcional.

Não pule capítulos. Cada um assume que você domina o anterior.

## Sumário

| # | Capítulo | Arquivo |
|---|----------|---------|
| 1 | Introdução ao QA e à Automação | [01-introducao.md](/treinamento/01-introducao.md) |
| 2 | Conhecendo o Playwright | [02-conhecendo-playwright.md](/treinamento/02-conhecendo-playwright.md) |
| 3 | Instalação | [03-instalacao.md](/treinamento/03-instalacao.md) |
| 4 | Estrutura de um Projeto Profissional | [04-estrutura-projeto.md](/treinamento/04-estrutura-projeto.md) |
| 5 | Entendendo um Teste | [05-entendendo-um-teste.md](/treinamento/05-entendendo-um-teste.md) |
| 6 | Localizadores | [06-localizadores.md](/treinamento/06-localizadores.md) |
| 7 | Assertions | [07-assertions.md](/treinamento/07-assertions.md) |
| 8 | Page Object Model (POM) | [08-page-object-model.md](/treinamento/08-page-object-model.md) |
| 9 | Component Object Model | [09-component-object-model.md](/treinamento/09-component-object-model.md) |
| 10 | Organização do Framework | [10-organizacao-framework.md](/treinamento/10-organizacao-framework.md) |
| 11 | Fixtures | [11-fixtures.md](/treinamento/11-fixtures.md) |
| 12 | Hooks | [12-hooks.md](/treinamento/12-hooks.md) |
| 13 | Captura de Evidências | [13-evidencias.md](/treinamento/13-evidencias.md) |
| 14 | Playwright Codegen | [14-codegen.md](/treinamento/14-codegen.md) |
| 15 | Esperas (Waits) | [15-esperas.md](/treinamento/15-esperas.md) |
| 16 | Trabalhando com APIs | [16-apis.md](/treinamento/16-apis.md) |
| 17 | Massa de Dados | [17-massa-de-dados.md](/treinamento/17-massa-de-dados.md) |
| 18 | Variáveis de Ambiente | [18-variaveis-ambiente.md](/treinamento/18-variaveis-ambiente.md) |
| 19 | Configuração do Playwright | [19-configuracao.md](/treinamento/19-configuracao.md) |
| 20 | Paralelismo | [20-paralelismo.md](/treinamento/20-paralelismo.md) |
| 21 | Tags | [21-tags.md](/treinamento/21-tags.md) |
| 22 | Testes de Regressão | [22-regressao.md](/treinamento/22-regressao.md) |
| 23 | Integração Contínua (CI/CD) | [23-cicd.md](/treinamento/23-cicd.md) |
| 24 | Refatoração | [24-refatoracao.md](/treinamento/24-refatoracao.md) |
| 25 | Boas Práticas | [25-boas-praticas.md](/treinamento/25-boas-praticas.md) |
| 26 | Erros Mais Comuns | [26-erros-comuns.md](/treinamento/26-erros-comuns.md) |
| 27 | Exercício Prático (Login) | [27-exercicio-pratico.md](/treinamento/27-exercicio-pratico.md) |
| 28 | Projeto Final | [28-projeto-final.md](/treinamento/28-projeto-final.md) |
| 29 | Desafio Final | [29-desafio-final.md](/treinamento/29-desafio-final.md) |

## Aplicação usada nos exemplos

Usamos [https://www.saucedemo.com](https://www.saucedemo.com) — um e-commerce fictício ("Swag Labs")
disponibilizado publicamente pela Sauce Labs para treino de automação. Ele tem tela de login,
listagem de produtos, carrinho e checkout em 3 etapas, o suficiente para ensinar POM, Components,
Fixtures, massa de dados e um fluxo de ponta a ponta real.

## Estrutura

```text
.
├── tests/                  # especificacoes de teste (*.spec.ts)
├── pages/                  # Page Objects (uma classe por tela)
├── components/             # Component Objects (header, toast) reutilizados entre Pages
├── fixtures/                # fixtures customizadas do Playwright Test
├── data/                   # massa de dados e interfaces de dados
├── constants/              # enums e valores fixos (rotas, nomes de produto)
├── utils/                  # utilitarios genericos (ex.: leitura de env vars)
├── helpers/                # funcoes puras auxiliares (sem dependencia do Playwright)
├── reports/, screenshots/, videos/, traces/  # evidencias geradas (git-ignoradas)
├── .github/workflows/playwright.yml  # pipeline de CI (smoke a cada push, regressao em PRs)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Como rodar

```bash
npm install
npx playwright install
cp .env.example .env

npm test                 # roda tudo, 3 navegadores
npm run test:chromium    # roda so no Chromium (mais rapido no dia a dia)
npm run test:smoke       # so os testes marcados com @smoke
npm run test:ui          # modo UI interativo do Playwright
npm run test:report      # abre o ultimo relatorio HTML
```

## Convencoes usadas neste projeto

- Cada tela vira uma classe em `pages/`, com sufixo `.page.ts`.
- Elementos repetidos entre telas (header, toasts) viram Component Objects em `components/`.
- Nenhum teste conhece um seletor CSS/XPath diretamente — tudo passa por metodos de Page/Component.
- Login repetitivo fica na fixture `loggedInPage` (`fixtures/pages.fixture.ts`), nunca copiado entre testes.
- Segredos (senha) vem de `.env`, nunca hardcoded (ver `utils/env.ts` e `data/users.ts`).

Cada uma dessas decisoes e explicada em detalhe no treinamento, capitulo a capitulo.
