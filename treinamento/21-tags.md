← [Anterior](20-paralelismo.md) | [Índice](../README.md) | [Próximo: Testes de Regressão →](22-regressao.md)

# Capítulo 21 — Tags

## Conceito

Tags são rótulos (`@smoke`, `@regression`, `@critical`, `@api`, `@login`) atribuídos a testes,
permitindo executar (ou excluir) subconjuntos específicos da suíte sem precisar rodar tudo.

## Sintaxe moderna (usada neste projeto)

```typescript
test('login com sucesso redireciona para a lista de produtos', { tag: ['@smoke', '@critical', '@login'] }, async ({
  loginPage,
  productsPage,
}) => {
  // ...
});
```

Ver [`tests/login.spec.ts`](../tests/login.spec.ts). A opção `tag` é o terceiro argumento de
`test(...)` — um array de strings. O Playwright automaticamente inclui as tags no título exibido no
relatório e as usa para filtragem via `--grep`.

## Tags usadas neste projeto

- **`@smoke`**: os testes mínimos que confirmam que "o sistema básico funciona" — rodados a cada
  commit/PR, em segundos. Ver `login`, `products`, `cart` marcados com `@smoke`.
- **`@regression`**: conjunto mais amplo, cobrindo cenários adicionais e casos de borda — rodado
  antes de releases ou em pipelines noturnos.
- **`@critical`**: fluxos de altíssimo valor de negócio (login, checkout completo) — mesmo dentro de
  `@smoke`/`@regression`, merece atenção prioritária se falhar.
- **`@api`**: testes que usam a fixture `request` em vez de UI (ver [`tests/api.spec.ts`](../tests/api.spec.ts)).
- **`@login`**: agrupamento por funcionalidade, útil para rodar só os testes relacionados a login ao
  investigar um bug específico daquela área.

Um mesmo teste pode ter várias tags — ex.: `login com sucesso` é `@smoke`, `@critical` **e** `@login`
ao mesmo tempo.

## Como executar por grupos

```bash
npx playwright test --grep @smoke        # só os marcados como @smoke
npx playwright test --grep @regression   # só regressão
npx playwright test --grep @critical     # só os críticos
npx playwright test --grep-invert @api   # tudo, exceto os de API
```

Scripts já prontos no [`package.json`](../package.json):

```bash
npm run test:smoke
npm run test:regression
npm run test:critical
```

## Explicação

- `--grep @smoke` funciona porque o Playwright injeta a tag no título do teste internamente — o
  mesmo mecanismo de busca textual de título (`--grep`) passa a filtrar por tag "de graça".
- `--grep-invert` faz o oposto: executa tudo que **não** casa com o padrão — útil para rodar a suíte
  inteira exceto uma categoria específica (ex.: pular testes de API em um pipeline só de UI).
- Combinar tags no CI permite estratégias em camadas: `@smoke` a cada push (rápido, feedback
  imediato), `@regression` a cada PR para a branch principal, suíte completa (sem filtro) antes de um
  release.

## Boas práticas

- Toda tag deve responder "quando eu rodo isso?" (ex.: `@smoke` = a cada commit) — evite tags sem
  critério claro de uso.
- Marque um teste crítico de negócio como `@critical` além de `@smoke`/`@regression`, para que falhas
  nesse teste específico chamem atenção redobrada em relatórios/alertas.
- Combine tags por camada (`@smoke`/`@regression`) com tags por funcionalidade (`@login`, `@checkout`)
  — isso permite tanto "rodar rápido" quanto "investigar uma área" sem duplicar testes.

## Erros comuns

- Marcar todos os testes como `@smoke` "para garantir que rodem sempre", perdendo o propósito de ter
  um subconjunto rápido e essencial.
- Nunca revisar as tags conforme a suíte cresce, deixando `@smoke` virar, na prática, a suíte inteira.
- Usar tags inconsistentes entre arquivos (`@smoke` em um arquivo, `@fumaça` em outro) sem um padrão
  documentado para o time todo.

## Exercício prático

Adicione a tag `@checkout` ao teste em [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) (além
das já existentes) e rode `npx playwright test --grep @checkout` para confirmar que só ele executa.

## Resumo

Tags (`{ tag: ['@smoke', ...] }`) permitem rodar subconjuntos da suíte via `--grep`/`--grep-invert`,
viabilizando estratégias de execução em camadas (rápida a cada commit, completa antes de release).

## Checklist de revisão

- [ ] Todo teste crítico de negócio está marcado com `@critical`.
- [ ] `npm run test:smoke` roda um subconjunto realmente pequeno e rápido da suíte.
- [ ] As tags usadas no projeto estão documentadas (este capítulo/README) para o time todo seguir o
      mesmo padrão.

## Perguntas para fixação

1. Como o Playwright torna possível filtrar por tag usando `--grep`, que originalmente busca no
   título do teste?
2. Qual a diferença de propósito entre `@smoke` e `@regression`?
3. Para que serve `--grep-invert` e quando ele seria útil em um pipeline de CI?
4. Por que marcar todo teste como `@smoke` anula o valor dessa tag?

## Desafio opcional

Desenhe (em texto) uma estratégia de pipeline de CI com 3 estágios: `@smoke` a cada push,
`@regression` a cada merge na branch principal, suíte completa (todos os navegadores, sem filtro de
tag) uma vez por dia agendada — e explique o trade-off de tempo vs. cobertura de cada estágio.

---
← [Anterior](20-paralelismo.md) | [Índice](../README.md) | [Próximo: Testes de Regressão →](22-regressao.md)
