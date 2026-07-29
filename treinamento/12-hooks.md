← [Anterior](11-fixtures.md) | [Índice](../README.md) | [Próximo: Captura de Evidências →](13-evidencias.md)

# Capítulo 12 — Hooks

## Conceito

Hooks são funções que rodam em pontos fixos do ciclo de vida dos testes: antes/depois de cada teste,
ou antes/depois de todos os testes de um arquivo/`describe`.

```typescript
import { test } from '@playwright/test';

test.beforeAll(async () => { /* roda uma vez, antes de todos os testes do arquivo */ });
test.beforeEach(async ({ page }) => { /* roda antes de cada teste */ });
test.afterEach(async ({ page }, testInfo) => { /* roda depois de cada teste */ });
test.afterAll(async () => { /* roda uma vez, depois de todos os testes do arquivo */ });
```

## Quando utilizar cada um

- **`beforeEach`**: preparar algo que cada teste precisa do zero (ex.: navegar para uma URL inicial).
  É o mais comum no dia a dia.
- **`afterEach`**: limpar algo após cada teste (ex.: deletar um registro criado via API), ou inspecionar
  `testInfo.status` para lógica condicional (ex.: só anexar um log extra se o teste falhou).
- **`beforeAll`**: preparar um recurso caro e compartilhável entre todos os testes do arquivo (ex.:
  autenticar uma vez contra uma API e reaproveitar o token). Cuidado: como o Playwright roda testes
  em paralelo, `beforeAll` compartilha estado entre testes do mesmo *worker*, não do arquivo inteiro
  se houver múltiplos workers.
- **`afterAll`**: liberar recursos abertos em `beforeAll` (ex.: fechar uma conexão, deletar dados de
  massa criados especificamente para aquele arquivo).

## Hooks vs. Fixtures

Este projeto usa **fixtures** (Capítulo 11) para a maior parte do setup (ex.: `loggedInPage`) em vez
de `beforeEach`. A vantagem das fixtures é a composição e a tipagem — um `beforeEach` só executa
código, sem devolver um valor tipado e reutilizável para o teste. Prefira fixtures quando o setup
**produz algo que o teste vai usar** (um Page Object, um dado); prefira hooks para efeitos
colaterais simples, sem necessidade de retorno (ex.: um `console.log` de diagnóstico, ou limpar
cookies).

## Exemplo prático

```typescript
import { test, expect } from '@playwright/test';

test.describe('Produtos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('a home carrega', async ({ page }) => {
    await expect(page.getByText('Swag Labs')).toBeVisible();
  });
});
```

## Explicação

- `test.beforeEach` aqui roda antes de **cada** teste dentro do `describe('Produtos')`, garantindo
  que toda a suíte comece da mesma URL, sem repetir `page.goto(...)` em cada `test(...)`.
- Se esse `beforeEach` precisasse devolver algo (ex.: uma instância de `ProductsPage`), o padrão
  recomendado neste treinamento é migrar para uma fixture (como fizemos com `loggedInPage`), que
  entrega o valor tipado diretamente como parâmetro do teste.

## Boas práticas

- Use `beforeEach` para efeitos colaterais simples e comuns a um `describe` inteiro.
- Prefira fixtures quando o setup precisa **entregar algo** ao teste (Page Object, dado, token).
- Em `afterAll`/`afterEach`, sempre limpe o que foi criado especificamente para aquele arquivo/teste
  (dados via API, por exemplo), para não deixar "sujeira" que afete outra execução.

## Erros comuns

- Usar `beforeAll` para logar um usuário e reaproveitar a mesma `page` entre múltiplos testes — isso
  quebra o isolamento entre testes (um teste pode deixar o estado sujo para o próximo) e é
  incompatível com paralelismo real por teste.
- Esquecer que `afterEach`/`afterAll` também rodam quando o teste falha — não assuma que o teardown
  só executa em caminho feliz.
- Duplicar em `beforeEach` algo que já poderia vir de uma fixture composta, perdendo tipagem e
  reuso entre arquivos diferentes.

## Exercício prático

Escreva um `test.afterEach` que, usando `testInfo.status !== testInfo.expectedStatus`, imprime no
console uma mensagem indicando que aquele teste específico falhou — sem alterar o resultado do
teste.

## Resumo

`beforeEach`/`afterEach` rodam por teste; `beforeAll`/`afterAll` rodam uma vez por arquivo (por
worker). Use hooks para efeitos colaterais; prefira fixtures quando o setup precisa devolver um
valor tipado ao teste.

## Checklist de revisão

- [ ] Sei a diferença entre `beforeEach` e `beforeAll` no contexto de paralelismo.
- [ ] Sei quando prefiro um hook a uma fixture.
- [ ] Meus `afterEach`/`afterAll` limpam qualquer dado criado especificamente para o teste.

## Perguntas para fixação

1. Por que `beforeAll` não deveria ser usado para compartilhar a mesma `page` logada entre testes
   diferentes?
2. Quando você preferiria uma fixture a um `beforeEach`?
3. O que `testInfo` permite verificar dentro de um `afterEach`?
4. Hooks `afterEach`/`afterAll` rodam mesmo quando o teste falha? Por que isso importa para limpeza
   de dados?

## Desafio opcional

Reescreva o hook `beforeEach` do exemplo prático deste capítulo como uma fixture customizada
chamada `homePage`, entregando ao teste a página já carregada — compare a legibilidade das duas
abordagens.

---
← [Anterior](11-fixtures.md) | [Índice](../README.md) | [Próximo: Captura de Evidências →](13-evidencias.md)
