← [Anterior](19-configuracao.md) | [Índice](../README.md) | [Próximo: Tags →](21-tags.md)

# Capítulo 20 — Paralelismo

## Conceito

Paralelismo é rodar múltiplos testes **ao mesmo tempo**, em processos (*workers*) separados, cada um
com seu próprio navegador/contexto isolado. É o que torna uma suíte de centenas de testes viável em
minutos, em vez de horas.

## Conceitos-chave

- **`workers`**: quantidade de processos paralelos. Definido em
  [`playwright.config.ts`](../playwright.config.ts) (`4` em CI, automático localmente).
- **`fullyParallel`**: quando `true`, o Playwright distribui **testes individuais** entre os workers
  (não só arquivos inteiros). Sem essa opção, o padrão é paralelizar por **arquivo** — todos os testes
  de um mesmo arquivo rodam em sequência, no mesmo worker.
- **`serial`**: `test.describe.serial(...)` força um grupo de testes a rodar em sequência, no mesmo
  worker, um depois do outro — usado quando um teste depende do estado deixado pelo anterior (deve
  ser evitado sempre que possível, ver abaixo).
- **`parallel`**: `test.describe.parallel(...)` — o oposto, força testes de um `describe` a rodar em
  paralelo, mesmo que `fullyParallel` esteja desligado globalmente.

## Exemplo prático

```typescript
// resultado real deste projeto, rodando 9 testes com 4 workers:
// Running 9 tests using 4 workers
// ok 3 [chromium] tests/login.spec.ts ...
// ok 2 [chromium] tests/cart.spec.ts ...
// ok 1 [chromium] tests/cart.spec.ts ...
// ok 4 [chromium] tests/checkout.spec.ts ...
```

Isso é a saída real de `npx playwright test --project=chromium` neste repositório: repare que testes
de arquivos diferentes (`login`, `cart`, `checkout`) terminam fora de ordem — cada worker roda de
forma independente, e quem termina primeiro reporta primeiro.

## Quando utilizar cada configuração

- **Padrão (`fullyParallel: true`)**: use sempre que os testes forem independentes entre si — que é
  o objetivo de qualquer suíte bem desenhada (ver isolamento de `BrowserContext` no Capítulo 1).
- **`test.describe.serial`**: só quando testes **precisam**, de propósito, depender uns dos outros
  (ex.: um teste de "criar pedido" seguido de "cancelar aquele pedido criado no teste anterior").
  Use com moderação — isso acopla testes e dificulta rodar um teste isolado.
- **Reduzir `workers`**: em ambientes com poucos recursos (CI compartilhado, máquina fraca), reduzir
  workers evita testes competindo por CPU/memória e falhando por lentidão, não por bug real.

## Por que isolamento importa para paralelismo funcionar

Cada teste, por padrão, ganha seu próprio `BrowserContext` (Capítulo 1) — cookies, `localStorage` e
sessão de um teste nunca vazam para outro, mesmo rodando ao mesmo tempo. É esse isolamento que torna
seguro rodar `loggedInPage` (fixture que faz login, Capítulo 11) em múltiplos testes simultâneos sem
que um "atropele" a sessão do outro.

## Boas práticas

- Escreva testes que não dependam de ordem de execução nem de estado deixado por outro teste —
  isso é pré-requisito para aproveitar paralelismo real.
- Ajuste `workers` conforme os recursos do ambiente de CI, não apenas copie o valor de outro projeto.
- Evite `test.describe.serial` como solução para "meus testes não são independentes" — normalmente é
  sintoma de fixture/setup mal desenhado, não uma necessidade real de ordem.

## Erros comuns

- Testes que dependem de um "usuário compartilhado" e que, ao rodar em paralelo, entram em conflito
  (ex.: dois testes tentando excluir o mesmo registro ao mesmo tempo).
- Configurar `workers` muito alto em uma máquina/CI com poucos recursos, causando lentidão geral e
  falhas por timeout que nada têm a ver com o código testado.
- Abusar de `test.describe.serial` para "resolver" problemas de isolamento, em vez de corrigir a
  causa (dados/estado compartilhado indevidamente).

## Exercício prático

Rode `npx playwright test --project=chromium --workers=1` e depois `--workers=4`, comparando o tempo
total de execução da suíte deste projeto. Anote a diferença.

## Resumo

Paralelismo real exige testes independentes entre si. `fullyParallel` distribui testes individuais
entre `workers`; `serial`/`parallel` em nível de `describe` dão controle fino quando necessário — mas
`serial` deve ser exceção, não regra.

## Checklist de revisão

- [ ] Nenhum teste do meu projeto depende da ordem de execução de outro.
- [ ] Sei explicar a diferença entre paralelismo por arquivo e `fullyParallel` (por teste).
- [ ] Sei quando `test.describe.serial` é justificável.

## Perguntas para fixação

1. Qual a diferença entre paralelizar por arquivo e `fullyParallel: true`?
2. Por que `BrowserContext` isolado é pré-requisito para paralelismo seguro?
3. Em que situação `test.describe.serial` é aceitável?
4. O que pode acontecer se `workers` for configurado muito alto para os recursos disponíveis?

## Desafio opcional

Escreva (em texto) um cenário onde dois testes, rodando em paralelo contra a mesma API real (não
simulada), poderiam gerar uma condição de corrida (race condition) — e proponha uma solução (ex.:
cada teste cria seu próprio recurso, em vez de compartilhar um registro fixo).

---
← [Anterior](19-configuracao.md) | [Índice](../README.md) | [Próximo: Tags →](21-tags.md)
