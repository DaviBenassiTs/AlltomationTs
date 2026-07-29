← [Anterior](21-tags.md) | [Índice](../README.md) | [Próximo: Integração Contínua (CI/CD) →](23-cicd.md)

# Capítulo 22 — Testes de Regressão

## Conceito

Regressão é quando algo que **já funcionava** deixa de funcionar após uma mudança no código. Testes
de regressão são a suíte que existe especificamente para pegar isso — não são sobre a feature nova
que está sendo desenvolvida agora, mas sobre garantir que tudo que já existia continua correto.

## Como estruturar

- Mantenha a suíte de regressão organizada por **funcionalidade** (arquivos `login.spec.ts`,
  `cart.spec.ts`, `checkout.spec.ts` — como este projeto), não por "quem escreveu" ou "quando foi
  escrito".
- Marque com `@regression` (Capítulo 21) os testes que validam comportamento já estável — em
  contraste com testes ainda instáveis de uma feature em desenvolvimento ativo.
- Garanta que cada teste de regressão seja independente (Capítulo 20) — regressão que só passa em
  uma ordem específica de execução não é confiável.

## Como organizar

```text
tests/
├── login.spec.ts        @smoke @critical @login  → fluxo essencial de autenticação
├── products.spec.ts     @smoke @regression        → listagem, ordenação, carrinho
├── cart.spec.ts          @smoke @regression        → carrinho isolado
├── checkout.spec.ts     @critical @regression      → fluxo de maior valor de negócio
└── api.spec.ts           @api @smoke @regression   → regras de negócio via API
```

Essa organização (ver a suíte real deste projeto) permite responder rapidamente "o que testa login?"
(um arquivo) e "o que é crítico?" (uma tag), sem precisar vasculhar a suíte inteira.

## Como priorizar

Nem todo teste de regressão tem o mesmo peso. Priorize:

1. **Fluxos de maior valor de negócio** (`@critical`): login, checkout — perder isso em produção
   custa caro e é o que primeiro deveria rodar e ser investigado se falhar.
2. **Fluxos de alta frequência de uso**: mesmo não sendo "críticos" no sentido financeiro, se o
   usuário usa toda hora, uma quebra é visível e dolorosa rapidamente.
3. **Casos de borda conhecidos**: bugs que já aconteceram antes e foram corrigidos ganham um teste de
   regressão específico, para nunca mais voltarem silenciosamente.

## Boas práticas

- Todo bug corrigido em produção deveria resultar em um novo teste de regressão que comprove que ele
  não vai voltar (ver Capítulo 26 para o processo).
- Revise periodicamente a suíte de regressão: testes que testam comportamento que não existe mais
  devem ser removidos, não deixados "por garantia".
- Rode a suíte de regressão completa antes de qualquer release, não só a cada commit (isso fica para
  `@smoke`).

## Erros comuns

- Deixar a suíte de regressão crescer sem nenhuma organização por funcionalidade, virando uma lista
  enorme e difícil de navegar.
- Nunca revisar/podar testes obsoletos, fazendo a suíte ficar cada vez mais lenta sem ganho real de
  cobertura.
- Tratar todo teste como igualmente crítico, perdendo a capacidade de priorizar investigação quando
  vários falham ao mesmo tempo.

## Exercício prático

Olhando a suíte atual deste projeto (`tests/`), liste os 3 testes que você consideraria mais
críticos de investigar primeiro caso todos falhassem ao mesmo tempo em um pipeline, e justifique a
ordem escolhida.

## Resumo

Regressão protege o que já funciona. Organize por funcionalidade, marque por criticidade, priorize
fluxos de negócio de maior valor, e trate bugs corrigidos como candidatos automáticos a novo teste de
regressão.

## Checklist de revisão

- [ ] A suíte está organizada em arquivos por funcionalidade, não por data/autor.
- [ ] Todo teste `@critical` realmente representa um fluxo de alto valor de negócio.
- [ ] Existe um processo (mesmo informal) de "bug corrigido vira teste novo".

## Perguntas para fixação

1. Qual a diferença entre um teste de regressão e um teste de uma feature em desenvolvimento ativo?
2. Por que organizar `tests/` por funcionalidade ajuda a investigar falhas mais rápido?
3. O que deveria acontecer, no processo do time, sempre que um bug é corrigido em produção?
4. Por que a suíte de regressão precisa ser revisada e podada periodicamente?

## Desafio opcional

Proponha um critério objetivo (ex.: uma tabela de pontuação) para decidir se um teste deveria ser
`@critical`, `@regression` apenas, ou candidato à remoção — baseado em frequência de uso da feature,
impacto financeiro de uma falha, e histórico de bugs anteriores naquela área.

---
← [Anterior](21-tags.md) | [Índice](../README.md) | [Próximo: Integração Contínua (CI/CD) →](23-cicd.md)
