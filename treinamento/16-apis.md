← [Anterior](15-esperas.md) | [Índice](../README.md) | [Próximo: Massa de Dados →](17-massa-de-dados.md)

# Capítulo 16 — Trabalhando com APIs

## Conceito

O Playwright não serve só para automação de UI: ele traz uma fixture nativa, `request`, para fazer
chamadas HTTP diretas (sem abrir navegador nenhum). Isso é extremamente valioso porque testes de API
são **muito mais rápidos e estáveis** que testes via UI (lembre-se da pirâmide de testes do
Capítulo 1) — sempre que uma regra de negócio pode ser validada via API, prefira isso a validar só
"visualmente" via UI.

## Quando utilizar

- Para validar regras de negócio de backend sem depender da UI (mais rápido, menos flaky).
- Para popular/limpar massa de dados antes de um teste E2E (ex.: criar um usuário via API em vez de
  se cadastrar clicando na tela).
- Para autenticar uma vez e reaproveitar o token entre vários testes (fixture composta, ver
  Capítulo 11).

## GET, POST, PUT, DELETE — exemplo completo (código real do projeto)

Ver [`tests/api.spec.ts`](../tests/api.spec.ts), testando a API pública gratuita
[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) (mantida para prática — as
operações de escrita são simuladas, não persistem dados reais).

```typescript
import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

test('GET /users/2 retorna um usuario existente', { tag: ['@api', '@regression'] }, async ({ request }) => {
  const response = await request.get(`${API_BASE_URL}/users/2`);

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.id).toBe(2);
  expect(body.email).toContain('@');
});

test('POST /posts cria um post', { tag: ['@api', '@smoke'] }, async ({ request }) => {
  const response = await request.post(`${API_BASE_URL}/posts`, {
    data: { title: 'Treinamento Playwright', body: 'Testando criacao via API', userId: 1 },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.title).toBe('Treinamento Playwright');
});
```

## Explicação linha por linha

- `async ({ request }) => { ... }` — `request` é uma fixture **nativa** do Playwright Test (assim
  como `page`), que dá acesso a um cliente HTTP isolado, sem depender de navegador algum.
- `request.get(url)` — faz uma requisição GET; o retorno é um objeto `APIResponse`.
- `response.ok()` — atalho para "status HTTP entre 200 e 299", equivalente a checar `response.status()`
  manualmente contra uma faixa de valores.
- `await response.json()` — faz o parse do corpo da resposta como JSON. Como toda operação de I/O do
  Playwright, é assíncrono (retorna uma `Promise`), por isso o `await`.
- `request.post(url, { data: {...} })` — a opção `data` serializa automaticamente o objeto como JSON
  no corpo da requisição, com o header `Content-Type: application/json` já configurado.
- `response.status()` — retorna o código HTTP exato (ex.: `201 Created`), útil quando você precisa
  validar um código específico, não só "deu certo/deu errado".

## Autenticação, headers e token

```typescript
const response = await request.get(`${API_BASE_URL}/perfil`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

A opção `headers` aceita qualquer cabeçalho HTTP customizado. Em um projeto real, o padrão é obter o
`token` uma vez (login via API) dentro de uma fixture (ver Capítulo 11, "Desafio opcional") e
reaproveitá-lo entre testes, evitando autenticar de novo em cada teste individual.

## Vantagens de testar via API em vez de só via UI

- Muito mais rápido: sem renderização de página, sem espera de elementos.
- Menos flaky: não depende de timing de UI, animações ou elementos visuais.
- Permite testar regras de negócio (validações, códigos de erro) que seriam trabalhosas de
  reproduzir clicando na tela.

## Boas práticas

- Prefira testes de API para validar regra de negócio pura; reserve testes de UI para o que
  realmente exige interface (fluxos visuais, integração entre telas).
- Centralize a URL base da API em uma constante (como `API_BASE_URL` no exemplo), nunca repetida
  como string solta em cada teste.
- Sempre valide tanto o status HTTP quanto o corpo da resposta — um `200 OK` com corpo errado ainda
  é um bug.

## Erros comuns

- Usar testes de UI para validar regras que poderiam (e deveriam) ser cobertas via API, deixando a
  suíte mais lenta e frágil sem necessidade.
- Ignorar o corpo da resposta e validar só o status HTTP, deixando passar respostas com dados
  incorretos.
- Deixar tokens/segredos de autenticação hardcoded no código do teste em vez de vir de variável de
  ambiente (ver Capítulo 18).

## Exercício prático

Adicione, em [`tests/api.spec.ts`](../tests/api.spec.ts), um teste `GET /users/999 retorna 404` que
valida que a API responde com status `404` para um usuário que não existe.

## Resumo

A fixture `request` permite testar APIs diretamente, sem navegador, de forma muito mais rápida e
estável que testes de UI. Use `data` para o corpo, `headers` para autenticação/customização, e
sempre valide status **e** corpo da resposta.

## Checklist de revisão

- [ ] Sei diferenciar quando um cenário deveria ser testado via API em vez de via UI.
- [ ] Sei usar `request.get/post/put/delete` com `data` e `headers`.
- [ ] Meus testes de API validam status HTTP **e** conteúdo do corpo da resposta.

## Perguntas para fixação

1. Por que testes de API tendem a ser mais rápidos e estáveis que testes de UI?
2. O que a opção `data` faz automaticamente em uma chamada `request.post`?
3. Qual a diferença entre `response.ok()` e `response.status()`?
4. Por que um token de autenticação não deveria estar hardcoded no código do teste?

## Desafio opcional

Combine este capítulo com o Capítulo 11 (Fixtures): crie uma fixture `apiUser` que cria um recurso
via `request.post` antes do teste e o remove via `request.delete` depois — usando o padrão de
"código antes do `use()`, código depois do `use()`" para setup e teardown automáticos.

---
← [Anterior](15-esperas.md) | [Índice](../README.md) | [Próximo: Massa de Dados →](17-massa-de-dados.md)
