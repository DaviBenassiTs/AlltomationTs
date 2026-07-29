← [Anterior](14-codegen.md) | [Índice](00-indice.md) | [Próximo: Trabalhando com APIs →](16-apis.md)

# Capítulo 15 — Esperas (Waits)

## Conceito

Testes E2E interagem com uma aplicação assíncrona: uma requisição de rede pode demorar, uma
animação pode estar em andamento, um elemento pode aparecer depois de outro carregar. "Esperar
certo" é a diferença entre uma suíte confiável e uma suíte flaky (que falha aleatoriamente).

## Auto Waiting

Antes de qualquer ação, o Playwright já espera automaticamente o elemento ficar "acionável"
(anexado ao DOM, visível, estável, habilitado, não coberto). Isso cobre a **grande maioria** dos
casos — na prática, raramente você precisa de uma espera explícita para ações simples de UI.

## Esperas explícitas disponíveis

- **`locator.waitFor({ state })`** — espera um locator atingir um estado específico
  (`'visible'`, `'hidden'`, `'attached'`, `'detached'`). Use quando uma asserção não é o objetivo
  imediato, só a espera em si (ex.: antes de um bloco condicional).
- **`page.waitForURL(padrao)`** — espera a URL da página corresponder a um padrão (string ou regex).
  Útil após uma navegação disparada por uma ação (ex.: clicar em "Login" e esperar
  `/inventory\.html/`).
- **`page.waitForLoadState(estado)`** — espera um estado de carregamento da página (`'load'`,
  `'domcontentloaded'`, `'networkidle'`). Usado em [`pages/base.page.ts`](../pages/base.page.ts).
- **`page.waitForResponse(padrao)`** — espera uma resposta de rede específica (por URL ou por
  função de predicado). Essencial quando a UI só atualiza depois de uma chamada de API assíncrona.
- **`page.waitForRequest(padrao)`** — equivalente, mas espera a **requisição** ser disparada (menos
  comum que `waitForResponse` em testes de UI, mais comum em testes de rede/instrumentação).

## Quando utilizar cada uma

| Situação | Espera recomendada |
|---|---|
| Clicar em algo e a URL mudar | `expect(page).toHaveURL(...)` (assertion, já espera) ou `page.waitForURL(...)` |
| Elemento aparece depois de uma ação, antes de uma assertion | Auto-waiting da própria assertion |
| Preciso saber quando uma chamada de API específica terminou | `page.waitForResponse(...)` |
| Preciso garantir que a página "assentou" antes de prosseguir | `page.waitForLoadState('networkidle')` |

## Exemplo prático (código real do projeto)

```typescript
// pages/base.page.ts
async waitForPageLoad(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
}
```

E o uso mais comum, que já é auto-waiting embutido na própria assertion:

```typescript
// pages/products.page.ts
async expectToBeLoaded(): Promise<void> {
  await expect(this.page).toHaveURL(/inventory\.html/);
  await expect(this.page.getByText('Products')).toBeVisible();
}
```

## Explicação

Repare que **não** precisamos de `page.waitForURL(...)` explícito em `expectToBeLoaded()`: a própria
`expect(this.page).toHaveURL(...)` já tenta repetidamente até a URL bater ou até o timeout. Preferir
a assertion ao invés de uma espera manual solta é mais legível e já documenta **o que** está sendo
verificado, não só "espere aqui".

## Por que evitar `waitForTimeout`

```typescript
await page.waitForTimeout(3000); // NUNCA faça isso
```

`waitForTimeout` espera um tempo fixo, cego ao estado real da aplicação. Problemas:

- Se a aplicação demorar mais que o tempo fixo (ex.: rede lenta em CI), o teste falha mesmo estando
  "certo".
- Se a aplicação for mais rápida, o teste desperdiça tempo esperando à toa — multiplicado por
  centenas de testes, isso deixa a suíte inteira lenta sem necessidade.
- É a causa mais comum de testes "flaky" em bases de código que ainda não adotaram auto-waiting.

Sempre existe uma alternativa: esperar um estado (`waitFor`), uma URL (`waitForURL`), uma resposta de
rede (`waitForResponse`) ou, simplesmente, deixar a própria assertion (`expect(locator)...`) fazer o
trabalho de espera.

## Boas práticas

- Prefira sempre uma assertion (`expect(locator).toBeVisible()`) a uma espera solta seguida de uma
  verificação síncrona.
- Use `waitForResponse` quando a UI depende de uma chamada de API assíncrona que não tem nenhum
  indicador visual claro de "carregando".
- Nunca use `waitForTimeout` como solução de sincronização — é aceitável, no máximo, para
  demonstrações/depuração manual, nunca em código versionado.

## Erros comuns

- Adicionar `waitForTimeout` "só para garantir" depois de uma ação, mascarando um problema real de
  sincronização em vez de resolvê-lo.
- Usar `waitForLoadState('networkidle')` em aplicações com polling constante de rede (ex.: um
  websocket ou long-polling) — nesse caso a rede nunca fica "ociosa" e o wait trava até o timeout.
- Confiar em `waitForURL` sem regex suficientemente específico, deixando o teste avançar numa URL
  errada que casualmente combina com o padrão.

## Exercício prático

Em [`pages/login.page.ts`](../pages/login.page.ts), adicione um método `loginAndWaitForInventory`
que executa `login(...)` e depois usa `this.page.waitForURL(/inventory\.html/)` explicitamente,
depois compare com o comportamento que já temos hoje via `productsPage.expectToBeLoaded()` — discuta
qual dos dois é preferível e por quê.

## Resumo

O auto-waiting do Playwright resolve a maioria dos casos de sincronização "de graça". Para o resto,
existem esperas explícitas específicas para cada situação (URL, estado de carregamento, resposta de
rede). `waitForTimeout` nunca é a resposta certa em código de produção de testes.

## Checklist de revisão

- [ ] Não existe nenhum `waitForTimeout` no meu projeto.
- [ ] Sei escolher entre `waitForURL`, `waitForLoadState` e `waitForResponse` conforme a situação.
- [ ] Sei explicar por que uma assertion (`expect(locator)`) já é, na prática, uma forma de espera.

## Perguntas para fixação

1. Por que `waitForTimeout` é considerado uma prática ruim de sincronização?
2. Em que situação `waitForResponse` é indispensável, mesmo com auto-waiting ativo?
3. O que pode dar errado ao usar `waitForLoadState('networkidle')` em uma aplicação com polling
   constante?
4. Por que preferir `expect(page).toHaveURL(...)` a um `page.waitForURL(...)` solto, quando o
   objetivo final é validar a navegação?

## Desafio opcional

Escreva um cenário (em texto) onde `waitForResponse` seria estritamente necessário no
saucedemo.com — ou explique por que essa aplicação, sendo majoritariamente estática no front-end,
raramente exigiria esse tipo de espera.

---
← [Anterior](14-codegen.md) | [Índice](00-indice.md) | [Próximo: Trabalhando com APIs →](16-apis.md)
