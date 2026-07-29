# Treinamento de Automação de Testes — Playwright + TypeScript + POM

> Curso completo, do zero ao framework profissional, ministrado no estilo de um QA Automation Lead.
> Todo o código mostrado aqui é **real e executável** — ele vive neste mesmo repositório.
> Rode `npm install && npx playwright install && npm test` na raiz do projeto para ver tudo funcionando
> contra o [saucedemo.com](https://www.saucedemo.com), aplicação pública mantida para prática de automação.

## Como usar este material

Cada capítulo segue sempre a mesma estrutura: Conceito → Quando usar → Vantagens/Desvantagens →
Exemplo prático → Código comentado linha a linha → Boas práticas → Erros comuns → Exercício →
Resumo → Checklist → Perguntas de fixação → Desafio opcional.

Não pule capítulos. Cada um assume que você domina o anterior.

## Sumário

| # | Capítulo | Arquivo |
|---|----------|---------|
| 1 | Introdução ao QA e à Automação | [01-introducao.md](01-introducao.md) |
| 2 | Conhecendo o Playwright | [02-conhecendo-playwright.md](02-conhecendo-playwright.md) |
| 3 | Instalação | [03-instalacao.md](03-instalacao.md) |
| 4 | Estrutura de um Projeto Profissional | [04-estrutura-projeto.md](04-estrutura-projeto.md) |
| 5 | Entendendo um Teste | [05-entendendo-um-teste.md](05-entendendo-um-teste.md) |
| 6 | Localizadores | [06-localizadores.md](06-localizadores.md) |
| 7 | Assertions | [07-assertions.md](07-assertions.md) |
| 8 | Page Object Model (POM) | [08-page-object-model.md](08-page-object-model.md) |
| 9 | Component Object Model | [09-component-object-model.md](09-component-object-model.md) |
| 10 | Organização do Framework | [10-organizacao-framework.md](10-organizacao-framework.md) |
| 11 | Fixtures | [11-fixtures.md](11-fixtures.md) |
| 12 | Hooks | [12-hooks.md](12-hooks.md) |
| 13 | Captura de Evidências | [13-evidencias.md](13-evidencias.md) |
| 14 | Playwright Codegen | [14-codegen.md](14-codegen.md) |
| 15 | Esperas (Waits) | [15-esperas.md](15-esperas.md) |
| 16 | Trabalhando com APIs | [16-apis.md](16-apis.md) |
| 17 | Massa de Dados | [17-massa-de-dados.md](17-massa-de-dados.md) |
| 18 | Variáveis de Ambiente | [18-variaveis-ambiente.md](18-variaveis-ambiente.md) |
| 19 | Configuração do Playwright | [19-configuracao.md](19-configuracao.md) |
| 20 | Paralelismo | [20-paralelismo.md](20-paralelismo.md) |
| 21 | Tags | [21-tags.md](21-tags.md) |
| 22 | Testes de Regressão | [22-regressao.md](22-regressao.md) |
| 23 | Integração Contínua (CI/CD) | [23-cicd.md](23-cicd.md) |
| 24 | Refatoração | [24-refatoracao.md](24-refatoracao.md) |
| 25 | Boas Práticas | [25-boas-praticas.md](25-boas-praticas.md) |
| 26 | Erros Mais Comuns | [26-erros-comuns.md](26-erros-comuns.md) |
| 27 | Exercício Prático (Login) | [27-exercicio-pratico.md](27-exercicio-pratico.md) |
| 28 | Projeto Final | [28-projeto-final.md](28-projeto-final.md) |
| 29 | Desafio Final | [29-desafio-final.md](29-desafio-final.md) |

## Aplicação usada nos exemplos

Usamos [https://www.saucedemo.com](https://www.saucedemo.com) — um e-commerce fictício ("Swag Labs")
disponibilizado publicamente pela Sauce Labs para treino de automação. Ele tem tela de login,
listagem de produtos, carrinho e checkout em 3 etapas, o suficiente para ensinar POM, Components,
Fixtures, massa de dados e um fluxo de ponta a ponta real.
