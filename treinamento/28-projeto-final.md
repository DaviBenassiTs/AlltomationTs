← [Anterior](27-exercicio-pratico.md) | [Índice](00-indice.md) | [Próximo: Desafio Final →](29-desafio-final.md)

# Capítulo 28 — Projeto Final

## Enunciado

Monte um projeto semelhante ao utilizado em empresas, cobrindo: Login, Cadastro, Perfil, Produtos,
Carrinho, Checkout e Pedidos. Você deve criar toda a estrutura POM, Components reutilizáveis,
Fixtures, Helpers, massa de dados, testes, relatórios, seguindo boas práticas.

## O que este repositório já entrega como solução de referência

Este projeto **é** a solução de referência — real, executável, não um pseudocódigo de exemplo.
Cobrimos, do saucedemo.com, os módulos que existem publicamente: **Login**, **Produtos**,
**Carrinho** e **Checkout** (3 etapas, incluindo a confirmação — o equivalente a "Pedidos"
concluídos). *Cadastro* e *Perfil* não existem nessa aplicação de demonstração (ela é
propositalmente simples); a seção "Estendendo para Cadastro e Perfil" abaixo mostra exatamente como
esses módulos se encaixariam na mesma arquitetura, sem quebrar nada do que já existe.

## Estrutura completa entregue

```text
.
├── tests/
│   ├── login.spec.ts        (Login)       @smoke @critical @login
│   ├── products.spec.ts     (Produtos)    @smoke @regression
│   ├── cart.spec.ts         (Carrinho)    @smoke @regression
│   ├── checkout.spec.ts     (Checkout/Pedido) @critical @regression
│   └── api.spec.ts          (API)         @api @smoke @regression
├── pages/
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── products.page.ts
│   ├── cart.page.ts
│   ├── checkout-step-one.page.ts    (dados pessoais)
│   ├── checkout-step-two.page.ts    (resumo do pedido)
│   └── checkout-complete.page.ts    (confirmação = "Pedido")
├── components/
│   ├── header.component.ts   (menu, logout, badge do carrinho)
│   └── toast.component.ts    (mensagens de erro)
├── fixtures/
│   └── pages.fixture.ts      (todas as Pages + loggedInPage)
├── data/
│   ├── types.ts               (interfaces)
│   └── users.ts                (massa de usuários)
├── constants/
│   ├── routes.ts
│   └── products.ts
├── utils/
│   └── env.ts
├── helpers/
│   └── currency.helper.ts
├── .github/workflows/playwright.yml   (CI)
├── playwright.config.ts
└── README.md
```

## Decisões arquiteturais e por quê

1. **Herança via `BasePage`**: toda Page compartilha `goto()`/`waitForPageLoad()`
   ([`pages/base.page.ts`](../pages/base.page.ts)) — evita duplicar navegação básica em 6 Pages
   diferentes.

2. **Checkout dividido em 3 Page Objects** (`CheckoutStepOnePage`, `CheckoutStepTwoPage`,
   `CheckoutCompletePage`) em vez de um único `CheckoutPage` gigante — cada etapa do saucedemo.com é
   uma URL/tela diferente, então cada uma ganhou sua própria classe, mantendo os métodos pequenos e
   coesos (Capítulo 25, item 4).

3. **`HeaderComponent` compartilhado** entre `ProductsPage` e `CartPage` — o cabeçalho (menu, logout,
   badge do carrinho) é idêntico nas duas telas; extraído como Component elimina duplicação
   (Capítulo 9).

4. **`ToastComponent` isolado** — mesmo usado hoje só em `LoginPage`, já nasceu como Component (não
   como método interno da Page) porque mensagens de erro/sucesso tendem a reaparecer em outras telas
   conforme o projeto cresce (ex.: erro ao finalizar checkout).

5. **`loggedInPage` como fixture composta** — todo teste que não é sobre login em si (produtos,
   carrinho, checkout) começa autenticado sem repetir esse fluxo (Capítulo 11).

6. **Enums em vez de strings soltas** (`Routes`, `ProductName`, `SortOption`) — qualquer erro de
   digitação em uma rota ou nome de produto é pego pelo TypeScript em tempo de compilação, não em
   tempo de execução.

7. **Testes de API separados dos testes de UI** (`tests/api.spec.ts`) — regras de negócio simples são
   validadas via `request` (Capítulo 16), mais rápido e estável que replicar via clique na tela.

8. **CI com dois estágios** (`.github/workflows/playwright.yml`) — `@smoke` a cada push (feedback
   rápido), `@regression` completa só em pull requests (Capítulo 23).

## Estendendo para Cadastro e Perfil (proposta de arquitetura)

Como esses módulos não existem no saucedemo.com, aqui está como eles se encaixariam **sem alterar
nada do que já existe**:

```typescript
// pages/signup.page.ts (proposto)
export class SignupPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('E-mail');
    this.passwordInput = page.getByLabel('Senha');
    this.confirmPasswordInput = page.getByLabel('Confirmar senha');
    this.submitButton = page.getByRole('button', { name: 'Cadastrar' });
  }

  async signUp(data: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
    await this.submitButton.click();
  }
}
```

```typescript
// pages/profile.page.ts (proposto)
export class ProfilePage extends BasePage {
  readonly header: HeaderComponent; // reaproveitado, mesmo Component já existente

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async expectDisplayName(name: string): Promise<void> {
    await expect(this.page.getByTestId('profile-name')).toHaveText(name);
  }
}
```

E uma fixture nova, composta a partir das já existentes:

```typescript
// fixtures/pages.fixture.ts (extensão proposta)
signedUpUser: async ({ page, signupPage }, use) => {
  const email = `qa+${Date.now()}@teste.com`; // fake data única, ver Capítulo 17
  await signupPage.open();
  await signupPage.signUp({ email, password: 'Senha@123' });
  await use({ email });
},
```

Repare que nada em `pages/login.page.ts`, `fixtures/pages.fixture.ts` (as fixtures já existentes) ou
qualquer teste atual precisou mudar — só adicionamos novas Pages e uma nova fixture, seguindo
exatamente o mesmo padrão arquitetural já estabelecido.

## Boas práticas aplicadas (checklist do projeto real)

- [x] Nenhum teste conhece um seletor CSS/XPath diretamente.
- [x] Nenhuma duplicação de locators de UI compartilhada entre Pages.
- [x] Segredos (senha) vêm de variável de ambiente, nunca hardcoded.
- [x] Testes marcados por criticidade (`@smoke`, `@critical`, `@regression`) e por funcionalidade
  (`@login`, `@api`).
- [x] CI configurado com estágios separados por velocidade/abrangência.
- [x] Relatório HTML e trace configurados para retenção em falha.

## Exercício prático

Implemente `pages/signup.page.ts` e `pages/profile.page.ts` de verdade neste repositório (mesmo sem
uma aplicação real para rodar contra), incluindo a fixture `signedUpUser` proposta, e escreva um
teste (`tests/signup.spec.ts`) que documente o fluxo esperado — ele não vai passar de verdade (não
há backend), mas deve compilar sem erros de tipo (`npm run typecheck`).

## Resumo

O projeto final demonstra que a arquitetura em camadas (Capítulo 10) escala: adicionar dois módulos
inteiramente novos (Cadastro, Perfil) exigiu apenas *adicionar* arquivos seguindo o padrão
existente — zero necessidade de alterar Pages, Components ou fixtures já prontos.

## Checklist de revisão

- [ ] Rodei `npm test` neste repositório e todos os testes existentes passam.
- [ ] Entendo por que Checkout foi dividido em 3 Page Objects, e não um só.
- [ ] Consigo explicar como adicionaria um módulo novo sem alterar código existente.

## Perguntas para fixação

1. Por que `HeaderComponent` é compartilhado entre `ProductsPage` e `CartPage`, mas não duplicado?
2. Por que o Checkout foi modelado como 3 Pages em vez de 1?
3. Como a fixture `signedUpUser` proposta reaproveita o padrão já usado por `loggedInPage`?
4. O que precisou mudar em `pages/login.page.ts` para adicionar os módulos de Cadastro e Perfil?

## Desafio opcional

Proponha (arquitetura, sem necessariamente rodar) como o módulo de "Pedidos" (histórico, não apenas
a confirmação de um pedido novo) se encaixaria: que Page(s) ele exigiria, que dados mockados via API
(Capítulo 16) seriam necessários para popular esse histórico antes do teste, e que fixture composta
entregaria isso pronto ao teste.

---
← [Anterior](27-exercicio-pratico.md) | [Índice](00-indice.md) | [Próximo: Desafio Final →](29-desafio-final.md)
