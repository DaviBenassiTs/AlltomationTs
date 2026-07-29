← [Anterior](07-assertions.md) | [Índice](../README.md) | [Próximo: Component Object Model →](09-component-object-model.md)

# Capítulo 8 — Page Object Model (POM)

## Conceito

Page Object Model é um padrão de design onde cada tela (ou página) da aplicação é representada por
uma classe. Essa classe concentra: os `Locator`s dos elementos daquela tela e os métodos que
representam ações e verificações possíveis nela. O teste **nunca** conhece um seletor — ele só chama
métodos como `loginPage.login(credenciais)`.

## Problema que o POM resolve

Sem POM, um seletor que muda (ex.: um `id` renomeado) obriga a caçar e editar todo teste que usa
aquele elemento — em uma suíte grande, isso pode significar dezenas de arquivos. Com POM, você edita
**um único lugar** (o Page Object), e todos os testes que dependem dele voltam a passar
automaticamente.

## Organização

- Uma classe por tela, arquivo `nome.page.ts`.
- Locators como propriedades privadas (`private readonly`), inicializados no construtor.
- Métodos públicos representam ações de negócio (`login`, `addProductToCart`) ou verificações
  (`expectToBeLoaded`) — nunca expõem o `Locator` bruto para fora da classe.
- Herança de uma `BasePage` para comportamento comum (ver [`pages/base.page.ts`](../pages/base.page.ts)).

## Vantagens

- Testes legíveis, que leem como descrição de negócio.
- Manutenção centralizada: um seletor muda, um método muda, N testes continuam passando.
- Reuso: o mesmo Page Object serve a quantos testes precisarem daquela tela.

## Desvantagens

- Curva de aprendizado inicial maior que "escrever um script solto".
- Se mal aplicado (Page Objects gigantes, "Deus", com 50 métodos), vira um novo tipo de duplicação e
  acoplamento — daí a necessidade também de Components (Capítulo 9).

## Construindo uma Page completa

Vamos analisar o Page Object real de login deste projeto: [`pages/login.page.ts`](../pages/login.page.ts).

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

## Explicação linha por linha

- `export class LoginPage extends BasePage` — herda de `BasePage` (ver
  [`pages/base.page.ts`](../pages/base.page.ts)), que já implementa `goto()` e `waitForPageLoad()`
  comuns a toda página.
- `private readonly usernameInput: Locator;` — os locators são privados: só esta classe sabe como o
  campo de usuário é encontrado. Se o front-end trocar o `placeholder` por um `data-testid`, só esta
  linha muda.
- `readonly errorToast: ToastComponent;` — é público (sem `private`) porque o teste precisa
  perguntar sobre o estado do toast de erro (ver [`tests/login.spec.ts`](../tests/login.spec.ts)),
  mas o Component encapsula **como** ler essa mensagem, então o `LoginPage` só delega, sem duplicar
  lógica de toast.
- `constructor(page: Page)` — recebe a fixture `page` e a repassa para `super(page)` e para o
  `ToastComponent`; é assim que toda a árvore de Pages/Components compartilha a mesma aba do
  navegador.
- `async open(): Promise<void>` — método de ação que representa "abrir a tela de login". Usa
  `Routes.LOGIN` (enum) em vez de uma string solta — ver [`constants/routes.ts`](../constants/routes.ts)
  e o Capítulo 4.
- `async login(credentials: UserCredentials): Promise<void>` — recebe um objeto tipado
  (`UserCredentials`, de [`data/types.ts`](../data/types.ts)) em vez de dois parâmetros soltos
  (`username: string, password: string`) — isso deixa a chamada auto-documentada e evita inverter a
  ordem dos parâmetros por engano.

## Vantagens e desvantagens (revisitando com o exemplo)

Repare que `LoginPage` não faz nenhum `expect` de negócio complexo — ela só executa ações. As
verificações ficam nos testes (ver [`tests/login.spec.ts`](../tests/login.spec.ts)) ou em métodos
`expectToBeLoaded()` de outras Pages, como [`pages/products.page.ts`](../pages/products.page.ts). Essa
divisão (Page = ação; teste = decisão do que verificar) evita que o Page Object vire um "Deus" que
sabe demais sobre regras de negócio de múltiplos testes diferentes.

## Boas práticas

- Locators sempre `private readonly` — nunca exponha um `Locator` cru para fora da classe.
- Métodos pequenos e nomeados como ações de negócio (`login`, `addProductToCart`), nunca como
  detalhes técnicos (`clickButton1`).
- Delegue pedaços de UI repetidos para Components (Capítulo 9) em vez de duplicar locators entre
  Pages.

## Erros comuns

- Expor `Locator`s como propriedades públicas, permitindo que testes cliquem em elementos
  diretamente e ignorem os métodos de negócio da Page.
- Criar uma Page "Deus" com dezenas de responsabilidades de várias telas diferentes.
- Colocar dados de teste (usuário, senha) fixos dentro do Page Object, em vez de recebê-los como
  parâmetro (isso acopla o Page Object a um cenário específico).

## Exercício prático

Crie um `HomePage` (mesmo conceito de [`pages/products.page.ts`](../pages/products.page.ts), mas
sem entrar em detalhes de produto) com um único método `expectWelcomeMessage(username: string)` que
verifica que o texto de boas-vindas contém o nome do usuário logado. (No saucedemo.com real não há
esse texto — trate como exercício de estrutura, não de execução.)

## Resumo

POM = uma classe por tela, com locators privados e métodos públicos de ação/verificação. Testes
chamam métodos; nunca conhecem seletores.

## Checklist de revisão

- [ ] Meus Page Objects nunca expõem `Locator`s públicos.
- [ ] Meus métodos de Page Object têm nomes de ação de negócio, não de detalhe técnico.
- [ ] Nenhum teste no meu projeto usa `page.locator(...)` diretamente.

## Perguntas para fixação

1. Por que os locators de um Page Object devem ser `private`?
2. Por que `LoginPage.login()` recebe um objeto `UserCredentials` em vez de dois parâmetros soltos?
3. Qual o papel de `BasePage` na hierarquia de Page Objects deste projeto?
4. O que caracteriza uma Page Object "Deus" e por que ela é um problema?
5. Por que `errorToast` é público em `LoginPage`, mas os outros locators são privados?

## Desafio opcional

Refatore [`pages/products.page.ts`](../pages/products.page.ts) para expor um método
`addMultipleProductsToCart(productNames: string[])` que adiciona vários produtos em sequência,
reaproveitando `addProductToCart` já existente (sem duplicar lógica).

---
← [Anterior](07-assertions.md) | [Índice](../README.md) | [Próximo: Component Object Model →](09-component-object-model.md)
