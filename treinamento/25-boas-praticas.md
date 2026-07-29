← [Anterior](24-refatoracao.md) | [Índice](00-indice.md) | [Próximo: Erros Mais Comuns →](26-erros-comuns.md)

# Capítulo 25 — Boas Práticas

## Conceito

Este capítulo consolida, em um único lugar, todas as boas práticas discutidas ao longo do
treinamento — para servir como referência rápida de revisão de código (code review) de testes.

## Lista consolidada

1. **Nunca usar seletores frágeis** (classes CSS geradas por build, XPath complexo) quando existe
   alternativa semântica. Ver Capítulo 6.
2. **Preferir `getByRole`** como primeira opção de localizador, por refletir a experiência real de
   usuários (inclusive com leitor de tela). Ver Capítulo 6.
3. **Evitar XPath**: mais verboso e frágil que CSS/role, sem vantagem real na maioria dos casos.
4. **Criar métodos pequenos** em Page Objects, cada um representando uma única ação de negócio. Ver
   [`pages/products.page.ts`](../pages/products.page.ts).
5. **Não duplicar código**: se dois Page Objects compartilham um comportamento, extraia para
   `BasePage` ([`pages/base.page.ts`](../pages/base.page.ts)) ou um Component (Capítulo 9).
6. **Criar Components reutilizáveis** assim que um pedaço de UI aparecer em duas telas. Ver
   [`components/header.component.ts`](../components/header.component.ts).
7. **Separar responsabilidade** entre `tests/`, `pages/`, `components/`, `fixtures/`, `data/`,
   `constants/`, `utils/`, `helpers/` — cada camada com um papel único (Capítulo 10).
8. **Utilizar POM corretamente**: locators privados, métodos públicos de ação/verificação, nunca
   expor `Locator` cru para o teste (Capítulo 8).
9. **Criar Helpers somente quando necessário**: lógica pura reaproveitada por mais de um lugar (ver
   [`helpers/currency.helper.ts`](../helpers/currency.helper.ts)) — não crie um helper para uma única
   linha usada uma única vez.
10. **Criar Fixtures** para eliminar setup repetido entre testes (ex.: `loggedInPage`, Capítulo 11).
11. **Evitar waits fixos** (`waitForTimeout`) — sempre prefira auto-waiting ou uma espera explícita
    correspondente ao evento real esperado (Capítulo 15).
12. **Organizar pastas** de forma consistente e documentada (Capítulo 4), para que qualquer pessoa do
    time saiba onde procurar/criar cada tipo de arquivo.
13. **Nomear testes corretamente**: o título deve descrever comportamento de negócio, não detalhe
    técnico (`'login com sucesso redireciona para produtos'`, não `'teste 1'`).
14. **Criar asserts claros**: prefira `expect(locator).toContainText(...)` a validações manuais sem
    retry automático (Capítulo 7).

## Tipagem forte (requisito deste treinamento)

- Tipar parâmetros e retornos de todo método (`async login(credentials: UserCredentials): Promise<void>`).
- Usar `interface` para descrever o formato de dados (`data/types.ts`), `enum` para valores fixos
  conhecidos (`constants/routes.ts`, `constants/products.ts`).
- Evitar `any` — quando genuinamente necessário (ex.: parsing de uma resposta de API totalmente
  dinâmica, sem schema conhecido), documente o motivo em um comentário curto.

## Boas práticas de arquitetura (revisão geral)

- `tests/` nunca conhece um seletor.
- `pages/`/`components/` nunca conhecem regra de negócio de múltiplos cenários — só ações/estado da
  própria tela/pedaço de UI.
- `helpers/`/`utils/` nunca dependem de `Page`/`Locator`.
- `fixtures/` é a única camada que instancia Page Objects para os testes.
- Segredos sempre via variável de ambiente, nunca hardcoded (Capítulo 18).

## Erros comuns (visão consolidada — detalhado no Capítulo 26)

- Seletores frágeis, `waitForTimeout`, `.nth()` sem necessidade, Page Objects "Deus", duplicação de
  locators entre Pages, testes dependentes de ordem, segredos hardcoded.

## Exercício prático

Escolha um arquivo de teste deste projeto (`tests/*.spec.ts`) e, para cada item da lista consolidada
deste capítulo, marque explicitamente se ele é seguido (✅) ou não (❌) — se encontrar algum ❌,
proponha a correção.

## Resumo

Boas práticas de automação com Playwright + TypeScript giram em torno de três eixos: localizadores
estáveis e semânticos, arquitetura em camadas com responsabilidade única (POM/Components/Fixtures), e
sincronização correta (auto-waiting em vez de esperas cegas).

## Checklist de revisão (para usar em code review de testes)

- [ ] Nenhum seletor CSS/XPath frágil sem justificativa.
- [ ] Nenhum `waitForTimeout`.
- [ ] Nenhum `Locator` exposto publicamente fora de Pages/Components.
- [ ] Nenhuma duplicação de locators entre duas Pages.
- [ ] Todo método tem tipos explícitos de parâmetro e retorno.
- [ ] Nenhum segredo hardcoded.
- [ ] Título do teste descreve comportamento de negócio.

## Perguntas para fixação

1. Por que `getByRole` é preferido a CSS/XPath na maioria dos casos?
2. O que caracteriza um Page Object "Deus" e por que ele viola a boa prática de separação de
   responsabilidade?
3. Quando é aceitável usar `any` neste treinamento, e o que deveria acompanhar essa decisão?
4. Por que `fixtures/` deveria ser a única camada a instanciar Page Objects?

## Desafio opcional

Escreva um checklist de "Definition of Done" para um novo teste automatizado neste projeto,
combinando os itens deste capítulo com critérios de cobertura (ex.: "tem ao menos uma tag",
"roda em menos de X segundos", "não depende de outro teste").

---
← [Anterior](24-refatoracao.md) | [Índice](00-indice.md) | [Próximo: Erros Mais Comuns →](26-erros-comuns.md)
