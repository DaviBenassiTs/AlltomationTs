← [Anterior](04-estrutura-projeto.md) | [Índice](../README.md) | [Próximo: Localizadores →](06-localizadores.md)

# Capítulo 5 — Entendendo um Teste

## Conceito

Todo teste no Playwright Test segue a mesma anatomia. Vamos dissecar o exemplo mais simples possível
antes de avançar para POM.

```typescript
import { test, expect } from '@playwright/test';

test('Login com sucesso', async ({ page }) => {

});
```

## Explicação linha por linha

- `import { test, expect } from '@playwright/test';`
  Importa duas funções do test runner: `test` (declara um caso de teste) e `expect` (cria
  asserções). Praticamente todo arquivo `.spec.ts` começa assim.

- `test('Login com sucesso', async ({ page }) => { ... });`
  `test()` recebe dois argumentos: uma string com o título do teste (aparece no relatório) e uma
  função assíncrona que contém os passos.

- `async`
  Marca a função como assíncrona: ela pode conter `await` dentro. Quase toda ação do Playwright
  (`click`, `fill`, `goto`) retorna uma `Promise`, porque envolve comunicação real com o navegador
  (que não é instantânea).

- `await`
  Pausa a execução da função até a `Promise` ser resolvida. Sem `await`, o teste seguiria para a
  próxima linha antes da ação anterior terminar — causa clássica de testes que "passam por acaso" ou
  falham de forma aleatória.

- `({ page })`
  É uma **fixture** injetada automaticamente pelo Playwright Test (ver Capítulo 11). `page`
  representa a aba do navegador daquele teste — já vem pronta, sem você precisar abrir navegador,
  criar contexto, nem fechar nada no final (o Playwright cuida disso).

- `locator`
  Embora não apareça neste exemplo mínimo, é o conceito mais importante do Playwright: uma
  referência a um ou mais elementos da página, resolvida (localizada de fato) apenas no momento da
  ação. Ver Capítulo 6.

## Exemplo prático completo

```typescript
import { test, expect } from '@playwright/test';

test('login com sucesso redireciona para a lista de produtos', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
});
```

Este teste "cru" (sem POM) é justamente o que vamos refatorar no Capítulo 8. Compare com a versão
real e organizada em [`tests/login.spec.ts`](../tests/login.spec.ts).

## Boas práticas

- Um `test()` deve testar **uma** coisa; nomeie o título descrevendo o comportamento esperado, não a
  ação técnica ("login com sucesso redireciona para produtos", não "teste 1").
- Sempre `await` uma ação do Playwright — nunca deixe uma `Promise` "solta".

## Erros comuns

- Esquecer `await` antes de uma ação (`page.getByRole(...).click()` sem `await`) — o teste segue em
  frente sem esperar o clique acontecer.
- Escrever títulos de teste genéricos, que não explicam o que está sendo validado.
- Colocar múltiplas verificações de negócio não relacionadas dentro do mesmo `test()`.

## Exercício prático

Escreva, em um arquivo `tests/exercicio-05.spec.ts`, um teste que acessa `https://www.saucedemo.com`
e verifica que o texto "Swag Labs" está visível na tela, usando `expect(...).toBeVisible()`. Rode com
`npx playwright test exercicio-05 --project=chromium`.

## Resumo

Um teste é: `import` → `test(titulo, async ({ page }) => { passos com await })`. `page` é a fixture
que representa a aba do navegador; `expect` valida o resultado.

## Checklist de revisão

- [ ] Sei explicar o papel de `async`/`await` em um teste Playwright.
- [ ] Sei o que a fixture `page` representa.
- [ ] Escrevi e rodei meu primeiro teste com sucesso.

## Perguntas para fixação

1. O que acontece se você esquecer o `await` antes de um `.click()`?
2. Por que quase toda ação do Playwright retorna uma `Promise`?
3. De onde vem a fixture `page` e por que o teste não precisa criar o navegador manualmente?
4. Por que um bom título de teste descreve comportamento, e não a ação técnica?

## Desafio opcional

Reescreva o exemplo prático deste capítulo trocando `page.getByPlaceholder(...)` por
`page.locator('#user-name')` e `page.locator('#password')` (seletores de CSS por `id`, reais nesse
site). Rode os dois e compare a legibilidade — isso prepara o terreno para o Capítulo 6.

---
← [Anterior](04-estrutura-projeto.md) | [Índice](../README.md) | [Próximo: Localizadores →](06-localizadores.md)
