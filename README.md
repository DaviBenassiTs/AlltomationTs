# Framework de Automacao — Playwright + TypeScript + POM

Projeto real, executavel, que acompanha o treinamento em [`treinamento/`](treinamento/00-indice.md).
A aplicacao sob teste (UI) e a [saucedemo.com](https://www.saucedemo.com), um site publico mantido
pela Sauce Labs especificamente para pratica de automacao de testes. Os testes de API
(`tests/api.spec.ts`) usam a [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com),
tambem publica e gratuita para prototipagem/treino.

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
