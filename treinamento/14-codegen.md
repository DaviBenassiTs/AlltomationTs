← [Anterior](13-evidencias.md) | [Índice](00-indice.md) | [Próximo: Esperas (Waits) →](15-esperas.md)

# Capítulo 14 — Playwright Codegen

## Conceito

`playwright codegen` abre um navegador controlado pelo Playwright e grava, em tempo real, o código
TypeScript correspondente a cada clique/preenchimento que você faz manualmente. É uma ferramenta de
**descoberta de seletores**, não um gerador de testes prontos para produção.

## Como utilizar

```bash
npm run codegen
# equivalente a: npx playwright codegen https://www.saucedemo.com
```

Uma janela do navegador abre lado a lado com uma janela de "Playwright Inspector", mostrando o
código gerado ao vivo conforme você interage com a página.

## Como gravar testes

1. Rode o comando acima.
2. Interaja normalmente com a aplicação (clique em campos, preencha, clique em botões).
3. O Inspector gera o código correspondente a cada ação, já usando localizadores como `getByRole`,
   `getByPlaceholder` quando possível.
4. Copie o trecho gerado para um arquivo de rascunho — nunca direto para `tests/`.

## Como aproveitar somente os seletores

O valor real do Codegen, em um projeto que já usa POM, não é o teste gerado inteiro — é a forma como
ele **encontrou o seletor** de um elemento específico. Ex.: ao clicar no botão "Add to cart" do
primeiro produto, o Codegen pode sugerir algo como:

```typescript
await page.getByRole('button', { name: 'Add to cart' }).first().click();
```

Você aproveita a parte `getByRole('button', { name: 'Add to cart' })` (o seletor) e descarta o
`.first()` (dependência de ordem), substituindo por um filtro mais preciso, como já fizemos em
[`pages/products.page.ts`](../pages/products.page.ts) com `.filter({ hasText: productName })`.

## Como refatorar para POM

Fluxo recomendado:

1. Grave o fluxo bruto com Codegen (ex.: login + adicionar produto + checkout).
2. Identifique cada seletor usado e mova para o Page Object correspondente
   (`LoginPage`, `ProductsPage`, `CartPage`...).
3. Substitua índices (`.first()`, `.nth(2)`) por filtros com significado de negócio
   (`.filter({ hasText: productName })`).
4. Extraia o fluxo final para um `test()` que só chama métodos das Pages — nada de seletor cru
   restando no arquivo de teste.

## Por que nunca manter o código bruto gerado

- O Codegen não sabe nada sobre POM, Components, fixtures ou dados tipados — ele gera um script
  linear, com tudo dentro de um único `test()`.
- Ele frequentemente usa `.first()`/`.nth()` para resolver ambiguidade, criando dependência de ordem
  que quebra silenciosamente quando a lista de elementos muda.
- Não reaproveita nada entre testes — cada gravação repete os mesmos passos de login, por exemplo,
  em vez de usar uma fixture como `loggedInPage`.
- Manter o código bruto no repositório perpetua exatamente os problemas que o POM resolve
  (Capítulo 8): qualquer mudança de UI obriga a regravar, em vez de editar um único Page Object.

## Boas práticas

- Use Codegen só como ferramenta de descoberta rápida de seletor, nunca como fonte final de teste.
- Sempre revise se o Codegen escolheu o localizador mais estável disponível (às vezes ele cai para
  CSS bruto quando não há `role`/`label`/`testid` claro — vale ajustar manualmente).
- Rode Codegen já contra uma tela específica (`npx playwright codegen <url>/inventory.html`) para
  evitar regravar o login toda vez que for só explorar seletores de outra tela.

## Erros comuns

- Copiar o script gerado inteiro para `tests/` e nunca mais tocar nele.
- Confiar cegamente em `.first()`/`.nth()` sugeridos pelo Codegen sem avaliar se existe um filtro
  mais preciso.
- Usar Codegen para "aprender Playwright" sem nunca estudar os conceitos de locators/assertions —
  ele mostra o quê, não o porquê.

## Exercício prático

Rode `npm run codegen`, faça o fluxo de login + adicionar dois produtos ao carrinho + ir para o
carrinho. Compare o script gerado com [`tests/cart.spec.ts`](../tests/cart.spec.ts) e liste 3
diferenças de abordagem entre o gerado e o refatorado em POM.

## Resumo

Codegen acelera a descoberta de seletores, mas o código que ele gera é sempre matéria-prima, nunca
produto final — deve ser refatorado para POM antes de entrar na suíte.

## Checklist de revisão

- [ ] Sei rodar `playwright codegen` contra uma URL específica.
- [ ] Sei extrair só o seletor relevante de um trecho gerado, descartando `.first()`/`.nth()`
      desnecessários.
- [ ] Nenhum arquivo em `tests/` do meu projeto é um script bruto de Codegen sem refatoração.

## Perguntas para fixação

1. Por que o código gerado pelo Codegen nunca deveria ir direto para `tests/`?
2. O que o Codegen faz quando não encontra um localizador semântico claro para um elemento?
3. Qual é, na prática, o maior valor do Codegen em um projeto que já segue POM?
4. Por que `.first()`/`.nth()` sugeridos pelo Codegen merecem uma segunda análise antes de manter?

## Desafio opcional

Grave com Codegen o fluxo completo de checkout (login → produto → carrinho → 3 etapas de checkout) e
refatore o resultado inteiro para POM, comparando seu resultado com
[`tests/checkout.spec.ts`](../tests/checkout.spec.ts).

---
← [Anterior](13-evidencias.md) | [Índice](00-indice.md) | [Próximo: Esperas (Waits) →](15-esperas.md)
