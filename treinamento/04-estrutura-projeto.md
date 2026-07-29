← [Anterior](03-instalacao.md) | [Índice](00-indice.md) | [Próximo: Entendendo um Teste →](05-entendendo-um-teste.md)

# Capítulo 4 — Estrutura de um Projeto Profissional

## Conceito

Um projeto de automação amadurece de "um arquivo `.spec.ts` com tudo dentro" para uma estrutura em
camadas, onde cada pasta tem uma única responsabilidade. É exatamente a estrutura deste repositório
— vamos usá-la, arquivo por arquivo, no restante do treinamento.

## Estrutura usada neste repositório

```text
.
├── tests/                  # especificações de teste (*.spec.ts) — o "o quê" testar
├── pages/                  # Page Objects — uma classe por tela
├── components/             # Component Objects — pedaços de UI repetidos entre telas
├── fixtures/                # fixtures customizadas do Playwright Test
├── data/                   # massa de dados (usuários, produtos) + interfaces de dados
├── constants/              # enums e valores fixos (rotas, nomes de produto, opções de ordenação)
├── utils/                  # utilitários genéricos, sem relação com UI (ex.: ler env vars)
├── helpers/                # funções puras auxiliares (ex.: parsear preço "$29.99" → 29.99)
├── reports/                # relatório HTML gerado (git-ignorado)
├── screenshots/videos/traces/  # evidências geradas por execução (git-ignoradas)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Responsabilidade de cada pasta

- **`tests/`**: só orquestra. Um teste chama métodos de Page Objects/fixtures — nunca conhece um
  seletor CSS diretamente. Ver [`tests/login.spec.ts`](../tests/login.spec.ts).
- **`pages/`**: uma classe por tela da aplicação, com os locators e ações daquela tela. Ver
  [`pages/login.page.ts`](../pages/login.page.ts).
- **`components/`**: pedaços de UI que aparecem em várias telas (cabeçalho, modal, toast). Ver
  [`components/header.component.ts`](../components/header.component.ts).
- **`fixtures/`**: prepara o contexto que um teste precisa antes de rodar (ex.: usuário já logado).
  Ver [`fixtures/pages.fixture.ts`](../fixtures/pages.fixture.ts).
- **`data/`**: valores de massa de dados e as `interface`s que os descrevem. Ver
  [`data/users.ts`](../data/users.ts) e [`data/types.ts`](../data/types.ts).
- **`constants/`**: enums que eliminam strings mágicas repetidas pelo código. Ver
  [`constants/routes.ts`](../constants/routes.ts) e [`constants/products.ts`](../constants/products.ts).
- **`utils/`**: utilitários de infraestrutura, sem qualquer dependência de `Page`/`Locator`. Ver
  [`utils/env.ts`](../utils/env.ts).
- **`helpers/`**: funções puras (entrada → saída, sem efeito colateral) usadas pelas Pages. Ver
  [`helpers/currency.helper.ts`](../helpers/currency.helper.ts).

## Por que separar assim (e não tudo em um arquivo)

Sem essa separação, qualquer mudança de UI (um seletor que mudou) obriga a editar **todos** os
testes que usam aquele elemento. Com a separação, você edita **um único método em um único Page
Object**, e todos os testes que o usam voltam a passar. É o mesmo princípio de "não se repita"
(DRY) aplicado a testes.

## Vantagens

- Mudança de UI custa uma edição, não dezenas.
- Testes ficam legíveis: leem como uma história de negócio (`loginPage.login(...)`), não como uma
  sequência de cliques em seletores.
- Onboarding de novos QAs é mais rápido — a estrutura já indica onde procurar cada coisa.

## Desvantagens

- Mais arquivos e mais indireção do que um script solto — para um teste único e descartável, pode
  ser exagero.
- Exige disciplina do time para não "vazar" seletores para dentro dos arquivos de `tests/`.

## Boas práticas

- Nomeie arquivos de forma consistente: `nome.page.ts`, `nome.component.ts`, `nome.spec.ts`.
- Um Page Object nunca deve conter `expect` de regra de negócio complexa — prefira métodos como
  `expectToBeLoaded()` que encapsulam a verificação (ver [`pages/products.page.ts`](../pages/products.page.ts)).
- Toda nova tela ganha sua própria classe; todo pedaço de UI repetido vira um Component.

## Erros comuns

- Colocar lógica de asserção de negócio espalhada dentro dos Page Objects, junto com o de outras
  responsabilidades, sem padrão.
- Criar uma pasta "utils" genérica onde tudo cai, sem distinguir helper puro de utilitário de
  infraestrutura.
- Deixar arquivos de evidência (`screenshots/`, `traces/`) versionados no Git — sempre no
  `.gitignore` (ver [`.gitignore`](../.gitignore)).

## Exercício prático

Sem olhar o código, desenhe (em texto) em qual pasta você colocaria: (a) uma função que gera um CPF
válido aleatório, (b) a classe da tela de "Meus Pedidos", (c) o menu lateral presente em todas as
telas logadas, (d) a URL base do ambiente de homologação.

## Resumo

Cada pasta tem uma responsabilidade única. `tests/` orquestra, `pages/` e `components/` conhecem a
UI, `fixtures/` prepara pré-condições, `data/`/`constants/` guardam valores, `utils/`/`helpers/`
guardam lógica de apoio sem UI.

## Checklist de revisão

- [ ] Sei explicar a diferença entre `pages/` e `components/`.
- [ ] Sei explicar a diferença entre `utils/` e `helpers/`.
- [ ] Sei onde colocaria uma nova regra de negócio de validação de CPF.

## Perguntas para fixação

1. Por que um teste não deveria conter um seletor CSS diretamente?
2. Qual a diferença de responsabilidade entre `pages/` e `components/`?
3. Por que `helpers/` não deveria depender de `Page` ou `Locator`?
4. O que aconteceria com a manutenção da suíte se não existisse a pasta `constants/`?

## Desafio opcional

Proponha (só a estrutura de pastas, sem código) como você organizaria um projeto que precisa testar
tanto uma aplicação web quanto uma API REST da mesma empresa, compartilhando massa de dados entre os
dois.

---
← [Anterior](03-instalacao.md) | [Índice](00-indice.md) | [Próximo: Entendendo um Teste →](05-entendendo-um-teste.md)
