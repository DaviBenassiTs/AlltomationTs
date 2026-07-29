← [Índice](../README.md) | [Próximo: Conhecendo o Playwright →](02-conhecendo-playwright.md)

# Capítulo 1 — Introdução ao QA e à Automação

## O que é QA

QA (*Quality Assurance* — Garantia de Qualidade) é a disciplina responsável por garantir que um
software se comporta como o esperado, antes e depois de chegar ao usuário final. Não é "só testar
manualmente clicando na tela": QA envolve prevenir defeitos (revisão de requisitos, casos de teste,
análise de risco), encontrar defeitos (testes manuais e automatizados) e garantir que o time todo
tenha confiança para lançar código com frequência.

Um Engenheiro de QA moderno não é um "clicador de botões". É alguém que entende a arquitetura da
aplicação, escreve código de teste, participa de design de features, e constrói ferramentas
(frameworks de automação) que dão velocidade e segurança ao time inteiro.

## O que é automação de testes

Automação de testes é escrever **código** que executa ações em um sistema (clicar, preencher,
navegar, chamar uma API) e **verifica automaticamente** se o resultado é o esperado — sem que uma
pessoa precise repetir esses passos manualmente a cada nova versão do software.

## Testes manuais vs. automatizados

| | Manual | Automatizado |
|---|---|---|
| Velocidade de execução | Lenta, depende de humano | Rápida, roda em segundos/minutos |
| Repetibilidade | Sujeita a erro humano | Determinística (mesmo passo, sempre) |
| Custo inicial | Baixo | Alto (escrever e manter o código) |
| Custo em regressão longa | Cresce a cada release | Praticamente fixo |
| Ideal para | Exploração, usabilidade, casos únicos | Fluxos repetitivos e críticos |
| Feedback | Só quando alguém testa | Pode rodar a cada commit (CI) |

Automação **não substitui** teste exploratório manual — ela libera o tempo do QA para focar em
explorar cenários novos, edge cases e usabilidade, em vez de repetir o mesmo roteiro de regressão
toda semana.

## Pirâmide de testes

```text
        /\
       /  \        E2E (poucos, lentos, caros de manter)
      /----\
     /      \      Testes de Integração / API (quantidade média)
    /--------\
   /          \    Testes Unitários (muitos, rápidos, baratos)
  /------------\
```

- **Unitários**: testam uma função/classe isolada. Rápidos, baratos, de responsabilidade do time de
  desenvolvimento.
- **Integração/API**: testam a comunicação entre componentes (ex.: chamada HTTP a um endpoint).
  Mais rápidos que E2E, cobrem regras de negócio sem precisar de interface gráfica.
- **E2E (ponta a ponta, via navegador)**: testam o fluxo completo do ponto de vista do usuário.
  É onde o Playwright atua. São os mais lentos e caros de manter — por isso devem ser **poucos e
  estratégicos** (fluxos críticos), não a maioria dos testes do projeto.

Este treinamento foca na camada E2E (e também mostra testes de API no Capítulo 16), mas o princípio
da pirâmide vale para qualquer projeto real: não tente automatizar tudo via UI.

## Quando automatizar

- Fluxos executados com frequência (login, checkout, cadastro).
- Cenários críticos de negócio (perder isso em produção custa caro).
- Testes de regressão repetidos a cada release.
- Casos com muitas combinações de dados (ex.: validação de formulário com 20 variações).

## Quando NÃO automatizar

- Funcionalidade que muda constantemente (ainda em prototipação/descoberta).
- Teste exploratório e de usabilidade — exige julgamento humano.
- Casos executados uma única vez.
- Quando o custo de manutenção do teste supera o valor que ele entrega.

## ROI da automação

Automação tem custo inicial (escrever, revisar, manter infraestrutura de CI). O retorno aparece ao
longo do tempo: quanto mais vezes um cenário é executado, menor o custo por execução comparado ao
manual. Regra prática: **automatize o que se repete**; não automatize o que é executado uma vez.

## Vantagens e desvantagens da automação

**Vantagens**: feedback rápido, execução consistente, roda em paralelo e à noite (CI), libera o QA
para tarefas de maior valor, documenta o comportamento esperado do sistema como código.

**Desvantagens**: custo de escrita e manutenção, exige conhecimento técnico, testes mal escritos
geram falsos positivos/negativos (flakiness) e minam a confiança do time no processo.

## Como funciona o Playwright (visão geral)

O Playwright é uma biblioteca de automação de navegador criada pela Microsoft. Ele controla o
Chromium, o Firefox e o WebKit (motor do Safari) através de protocolos nativos de cada navegador
(não injeta JavaScript no meio da página como ferramentas mais antigas). Isso o torna mais rápido e
muito mais confiável para lidar com aplicações modernas (SPAs, React, Angular, Vue).

## Arquitetura do Playwright

```text
Seu código de teste (TypeScript)
        │
        ▼
  @playwright/test (test runner: fixtures, assertions, reporters)
        │
        ▼
   playwright-core (API de alto nível: Browser, Context, Page, Locator)
        │
        ▼
 Protocolo de comunicação nativo de cada navegador (CDP no Chromium, etc.)
        │
        ▼
   Chromium / Firefox / WebKit (binários baixados pelo Playwright)
```

Conceitos-chave dessa arquitetura, que vamos usar o tempo todo:

- **Browser**: uma instância do navegador (Chromium, Firefox ou WebKit).
- **BrowserContext**: um "perfil" isolado dentro do navegador — como uma janela anônima. Cada teste
  do Playwright roda em um contexto novo por padrão, garantindo isolamento total entre testes
  (cookies, storage, sessão de um teste nunca vazam para outro).
- **Page**: uma aba dentro do contexto.
- **Locator**: uma referência "preguiçosa" a um elemento da página — só é resolvida no momento da
  ação, o que viabiliza o auto-waiting (ver Capítulo 15).

## Resumo do capítulo

- QA vai muito além de clicar em telas; automação é uma ferramenta de QA, não um substituto do QA.
- Automatize o que se repete e é crítico; não automatize exploração e casos únicos.
- A pirâmide de testes ensina a não colocar tudo em E2E — priorize unitários e API quando possível.
- Playwright controla navegadores de forma nativa, com Browser → Context → Page → Locator.

## Boas práticas

- Trate o código de teste com o mesmo cuidado que o código de produção (revisão, padrões, CI).
- Priorize testes de API/integração quando o objetivo é validar regra de negócio, não a interface.

## Erros comuns

- Tentar automatizar 100% dos casos de teste, inclusive os exploratórios.
- Ignorar a pirâmide de testes e concentrar tudo em E2E, criando uma suíte lenta e frágil.
- Achar que automação "substitui" QA humano.

## Exercício prático

Pegue um sistema que você usa no dia a dia (ex.: um site de e-commerce). Liste 5 fluxos e classifique
cada um como: (a) deveria ser automatizado, (b) não deveria, (c) depende. Justifique cada resposta
usando os critérios deste capítulo.

## Perguntas para fixação

1. Qual a diferença entre testar manualmente e testar de forma automatizada?
2. Por que a pirâmide de testes recomenda poucos testes E2E?
3. Cite dois critérios para decidir **não** automatizar um cenário.
4. O que é um `BrowserContext` e por que ele garante isolamento entre testes?
5. Por que Playwright é considerado mais confiável que ferramentas que injetam JavaScript na página?

## Desafio opcional

Pesquise a diferença entre a arquitetura do Playwright (protocolo nativo por navegador) e a do
Selenium (WebDriver via HTTP). Escreva um parágrafo explicando por que isso impacta velocidade e
confiabilidade dos testes.

---
← [Índice](../README.md) | [Próximo: Conhecendo o Playwright →](02-conhecendo-playwright.md)
