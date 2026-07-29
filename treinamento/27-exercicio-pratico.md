← [Anterior](26-erros-comuns.md) | [Índice](../README.md) | [Próximo: Projeto Final →](28-projeto-final.md)

# Capítulo 27 — Exercício Prático (Login)

## Enunciado

Considere uma aplicação de login contendo: campo de e-mail, campo de senha, botão "Entrar", link
"Esqueci minha senha" e opção de "Logout" após autenticado. Usando exatamente a aplicação deste
treinamento (saucedemo.com — usuário/senha em vez de e-mail/senha), crie:

- `LoginPage` — Page Object da tela de login.
- `HomePage` (aqui, `ProductsPage`, já que é a tela pós-login do saucedemo.com) — Page Object da
  tela seguinte ao login.
- `Login.spec.ts` — os testes, usando POM, cobrindo: login com sucesso, login com usuário bloqueado,
  logout.

Tente resolver sozinho antes de ler a seção "Resolução comentada" abaixo.

## Passo a passo sugerido

1. Identifique os elementos da tela de login (usuário, senha, botão) e escolha o localizador mais
   estável para cada um (Capítulo 6).
2. Crie `LoginPage` com esses locators privados e um método `login(credentials)`.
3. Identifique como confirmar que o login deu certo (URL mudou? um texto específico apareceu?) e
   crie `expectToBeLoaded()` na Page de destino.
4. Escreva os testes usando apenas os métodos das Pages — nenhum seletor solto no arquivo de teste.
5. Adicione tags (`@smoke`, `@critical`, `@login`) conforme o Capítulo 21.

## Resolução comentada

### `pages/login.page.ts` (já existente no projeto)

```typescript
import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ToastComponent } from '../components/toast.component';
import { Routes } from '../constants/routes';
import { UserCredentials } from '../data/types';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  readonly errorToast: ToastComponent;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorToast = new ToastComponent(page);
  }

  async open(): Promise<void> {
    await this.goto(Routes.LOGIN);
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }
}
```

*Por quê assim*: `getByPlaceholder` foi escolhido porque o saucedemo.com não usa `<label>` associado
aos campos (não há `getByLabel` disponível) — é o localizador semântico mais estável disponível
nesse caso específico. `login()` recebe um objeto tipado (`UserCredentials`), não dois parâmetros
soltos, evitando inversão acidental de usuário/senha na chamada.

### `pages/products.page.ts` (papel de "HomePage" pós-login)

```typescript
async expectToBeLoaded(): Promise<void> {
  await expect(this.page).toHaveURL(/inventory\.html/);
  await expect(this.page.getByText('Products')).toBeVisible();
}
```

*Por quê assim*: duas verificações (URL **e** conteúdo visível) deixam o método mais robusto contra
falsos positivos — uma URL correta com a página ainda carregando não seria suficiente sozinha.

### `tests/login.spec.ts` (resolução completa)

```typescript
import { test, expect } from '../fixtures/pages.fixture';
import { users } from '../data/users';

test.describe('Login', () => {
  test('login com sucesso redireciona para a lista de produtos', { tag: ['@smoke', '@critical', '@login'] }, async ({
    loginPage,
    productsPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard);
    await productsPage.expectToBeLoaded();
  });

  test('usuario bloqueado ve mensagem de erro', { tag: ['@regression', '@login'] }, async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorToast.isVisible()).resolves.toBe(true);
    await expect(loginPage.errorToast.getMessage()).resolves.toContain('locked out');
  });
});
```

Este é, literalmente, o conteúdo real de [`tests/login.spec.ts`](../tests/login.spec.ts) — rode
`npx playwright test login.spec --project=chromium` para confirmar que passa.

### Logout (extra, cobrindo o pedido do enunciado)

```typescript
// pages/login.page.ts
async expectToBeLoggedOut(): Promise<void> {
  await expect(this.page).toHaveURL(Routes.LOGIN);
  await expect(this.loginButton).toBeVisible();
}
```

```typescript
// tests/login.spec.ts
test('logout retorna para a tela de login', { tag: ['@regression', '@login'] }, async ({
  loggedInPage,
  loginPage,
}) => {
  await loggedInPage.header.logout();

  await loginPage.expectToBeLoggedOut();
});
```

*Por quê assim*: o teste usa a fixture `loggedInPage` (já autenticada, ver Capítulo 11) e delega a
ação de logout ao `HeaderComponent` (`loggedInPage.header.logout()`, ver Capítulo 9). A verificação
de "voltou para a tela de login" fica encapsulada em `expectToBeLoggedOut()`, dentro da própria
`LoginPage` — o teste nunca acessa `page` ou um `Locator` diretamente, preservando o encapsulamento
discutido no Capítulo 8.

## Exercício adicional

Este método (`expectToBeLoggedOut`) e o teste de logout já estão implementados em
[`pages/login.page.ts`](../pages/login.page.ts) e [`tests/login.spec.ts`](../tests/login.spec.ts)
neste repositório — rode `npx playwright test login.spec --project=chromium` para confirmar que
todos os 4 testes passam, incluindo o de logout.

## Resumo

Este exercício percorreu, na prática, POM (Capítulo 8), Components (Capítulo 9, via `ToastComponent`
e `HeaderComponent`), Fixtures (Capítulo 11, via `loggedInPage`) e Tags (Capítulo 21) — tudo já
presente e rodando de verdade neste repositório.

## Checklist de revisão

- [ ] `LoginPage` não expõe nenhum `Locator` público (exceto o Component `errorToast`).
- [ ] Todos os 4 testes de `tests/login.spec.ts` passam ao rodar `npx playwright test login.spec`.
- [ ] Entendo por que `expectToBeLoggedOut()` fica dentro de `LoginPage`, não solto no teste.

## Perguntas para fixação

1. Por que `getByPlaceholder` foi escolhido em vez de `getByLabel` neste exercício?
2. Por que `expectToBeLoaded()` verifica tanto a URL quanto um texto visível, em vez de só a URL?
3. Por que encapsular a verificação de logout em `expectToBeLoggedOut()` (dentro de `LoginPage`) é
   melhor do que fazer `expect(page).toHaveURL(...)` diretamente dentro do teste?

## Desafio opcional

Adicione um teste `login com senha incorreta mantém o usuário na tela de login`, usando um objeto
`UserCredentials` com senha inválida, e valide a mensagem de erro apropriada usando `errorToast`.

---
← [Anterior](26-erros-comuns.md) | [Índice](../README.md) | [Próximo: Projeto Final →](28-projeto-final.md)
