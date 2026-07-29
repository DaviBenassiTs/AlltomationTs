← [Anterior](28-projeto-final.md) | [Índice](00-indice.md) | [Índice](00-indice.md)

# Capítulo 29 — Desafio Final

## Cenário proposto

Uma empresa de e-commerce corporativo tem uma aplicação com múltiplos módulos: Login, Cadastro,
Busca de produtos, Compra (carrinho + checkout) e Logout — muito próximo do que este repositório já
implementa contra o saucedemo.com, mas agora **é a sua vez de estruturar do zero**, sem copiar
diretamente o código já pronto.

## O que você deve entregar

1. **Estruture um framework completo** — pastas `tests/`, `pages/`, `components/`, `fixtures/`,
   `data/`, `constants/`, `utils/`, `helpers/` (Capítulos 4 e 10).
2. **Defina a arquitetura do projeto** — qual Page representa cada tela, quais pedaços de UI viram
   Component, quais fixtures compõem pré-condições (Capítulos 8, 9 e 11).
3. **Implemente o POM** — classes com locators privados e métodos públicos de ação/verificação
   (Capítulo 8).
4. **Crie Components reutilizáveis** — pelo menos um (ex.: cabeçalho/menu) compartilhado entre duas
   ou mais Pages (Capítulo 9).
5. **Escreva testes automatizados** de: Login, Cadastro, Busca, Compra e Logout — usando as fixtures
   e Page Objects que você mesmo criou.
6. **Configure execução paralela** — `fullyParallel`, `workers` ajustados (Capítulo 20).
7. **Configure evidências** — screenshot, vídeo e trace retidos em falha (Capítulo 13).
8. **Configure execução em múltiplos navegadores** — Chromium, Firefox, WebKit via `projects`
   (Capítulo 19).
9. **Gere relatório HTML** — reporter configurado, publicado como artefato de CI (Capítulos 13 e 23).
10. **Explique suas decisões** — por escrito, como este framework evoluiria para suportar centenas de
    testes sem virar insustentável.

## Critérios de avaliação (auto-avaliação)

Use o Capítulo 25 (Boas Práticas) e o Capítulo 26 (Erros Comuns) como checklist de revisão do seu
próprio trabalho antes de considerá-lo pronto. Pergunte-se, especificamente:

- Meus testes são independentes entre si (Capítulo 20)?
- Existe alguma duplicação de locators entre duas Pages que deveria virar Component (Capítulo 9)?
- Algum segredo está hardcoded em vez de vir de variável de ambiente (Capítulo 18)?
- Existe algum `waitForTimeout` que deveria ser substituído por espera correta (Capítulo 15)?
- As tags (`@smoke`, `@regression`, `@critical`) refletem a real criticidade de cada teste
  (Capítulo 21)?

## Como este framework escalaria para centenas de testes

Pontos a considerar na sua resposta escrita (baseando-se no que este repositório já demonstra em
escala pequena):

- **Organização por domínio**: conforme `pages/` crescer, subdivida em subpastas por módulo
  (`pages/checkout/`, `pages/cadastro/`, `pages/busca/`) em vez de um único diretório plano com
  dezenas de arquivos — mesma lógica sugerida no desafio do Capítulo 10.
- **Fixtures em arquivos separados por domínio** (`fixtures/auth.fixture.ts`,
  `fixtures/checkout.fixture.ts`), combinadas em um único `fixtures/index.ts` que reexporta um `test`
  final — evita um único arquivo de fixtures gigante e difícil de navegar.
- **Tags como estratégia de execução em camadas**: `@smoke` a cada commit, `@regression` a cada PR,
  suíte completa (sem filtro, todos os navegadores) em pipeline agendado — exatamente o padrão do
  Capítulo 23, mas essencial em escala grande para não travar o time esperando horas de CI a cada
  push.
- **Dados via API, não via UI**: em centenas de testes, criar massa de dados clicando na tela
  (cadastro manual de usuário a cada teste) é inviável em tempo de execução — prefira popular/limpar
  dados via `request` (Capítulo 16) sempre que possível, reservando a UI para o que realmente precisa
  ser validado visualmente.
- **Paralelismo horizontal em CI**: além de `workers` dentro de uma máquina, distribua a suíte entre
  múltiplos jobs/agentes em paralelo (ex.: `strategy.matrix` no GitHub Actions, sharding nativo do
  Playwright via `--shard=1/4`), para que centenas de testes ainda rodem em poucos minutos.
- **Revisão periódica da suíte de regressão** (Capítulo 22): sem poda de testes obsoletos, uma suíte
  de centenas de testes tende a acumular lentidão e flakiness ao longo dos anos — trate a suíte como
  código de produção, com a mesma disciplina de manutenção.

## Reflexão final

Compare sua solução ao Capítulo 28 (Projeto Final) — que Page Objects, Components e fixtures você
criou de forma parecida, e onde você tomou um caminho diferente? Não existe uma única resposta
correta em arquitetura de testes; existe uma resposta **consistente**, documentada e que o time
inteiro consegue seguir.

## Perguntas para fixação

1. Por que sharding (`--shard=1/4`) é diferente de simplesmente aumentar `workers`?
2. Por que popular massa de dados via API é preferível a via UI, especialmente em escala grande?
3. Como você organizaria `fixtures/` se o projeto tivesse 5 módulos de negócio diferentes?
4. Por que a revisão periódica da suíte (poda de testes obsoletos) é tão importante quanto escrever
   testes novos?

## Desafio opcional (avançado)

Implemente sharding real neste projeto: rode
`npx playwright test --shard=1/2` e `npx playwright test --shard=2/2` em dois terminais
simultaneamente, e compare o tempo total contra uma execução sem sharding
(`npx playwright test`). Documente o ganho (ou a ausência de ganho, dado o tamanho pequeno desta
suíte de exemplo) e explique em que ponto (quantidade de testes) o sharding começa a compensar o
custo de coordenação entre shards.

---
Você concluiu o treinamento. Volte ao [Índice](00-indice.md) para revisar qualquer capítulo.
