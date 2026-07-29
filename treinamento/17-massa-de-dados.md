← [Anterior](16-apis.md) | [Índice](00-indice.md) | [Próximo: Variáveis de Ambiente →](18-variaveis-ambiente.md)

# Capítulo 17 — Massa de Dados

## Conceito

Massa de dados é o conjunto de valores usados como entrada dos testes (usuários, produtos, endereços,
cartões). Como organizar isso afeta diretamente a manutenibilidade da suíte: dados espalhados e
duplicados quebram silenciosamente quando um valor muda.

## Estratégias e quando usar cada uma

- **Dados fixos** (constantes/objetos estáticos): quando o valor não muda entre execuções e é parte
  do "contrato" do teste (ex.: os usuários de demonstração do saucedemo.com, que são sempre os
  mesmos). Ver [`data/users.ts`](../data/users.ts).
- **JSON**: quando os dados vêm de uma fonte externa versionada separadamente do código (ex.:
  massa compartilhada entre times, ou exportada de uma planilha). Boa opção para grandes volumes de
  dados de teste parametrizado.
- **Factory** (função que constrói um objeto com valores padrão, sobrescrevíveis): quando você
  precisa de muitas variações pequenas de um mesmo tipo de dado (ex.: "um usuário válido, mas com
  e-mail inválido").
- **Builder Pattern**: quando a construção do objeto tem passos encadeáveis e opcionais (mais comum
  em objetos complexos, com muitos campos opcionais).
- **Fake Data** (bibliotecas como `@faker-js/faker`): quando o teste precisa de dados
  **únicos a cada execução** (ex.: e-mail de cadastro, que não pode repetir), evitando colisão entre
  execuções paralelas ou sucessivas.

## Exemplo prático (dados fixos, código real do projeto)

```typescript
// data/types.ts
export interface UserCredentials {
  username: string;
  password: string;
}

// data/users.ts
import { getEnvVar } from '../utils/env';

const DEFAULT_PASSWORD = getEnvVar('DEFAULT_PASSWORD', 'secret_sauce');

export const users = {
  standard: { username: 'standard_user', password: DEFAULT_PASSWORD } as UserCredentials,
  lockedOut: { username: 'locked_out_user', password: DEFAULT_PASSWORD } as UserCredentials,
};
```

## Explicação

- A `interface UserCredentials` (em `data/types.ts`) descreve o **formato** dos dados, separada dos
  valores em si (`data/users.ts`) — isso permite reaproveitar a interface em uma factory ou em dados
  vindos de uma API, sem duplicar a definição de tipo.
- A senha nunca é um valor fixo no arquivo: vem de `getEnvVar(...)` (Capítulo 18), então trocar o
  ambiente (ex.: de homologação para produção) não exige tocar em `data/users.ts`.
- `as UserCredentials` garante que o TypeScript valide, em tempo de compilação, que o objeto tem
  exatamente os campos esperados — um erro de digitação no nome do campo (`usernam` em vez de
  `username`) seria pego antes mesmo de rodar o teste.

## Exemplo de Factory (proposta de evolução)

```typescript
// data/factories/user.factory.ts
import { UserCredentials } from '../types';

export function buildUser(overrides: Partial<UserCredentials> = {}): UserCredentials {
  return {
    username: 'standard_user',
    password: 'secret_sauce',
    ...overrides,
  };
}

// uso: buildUser({ username: 'locked_out_user' })
```

Uma factory permite pedir "o padrão, mas com este campo diferente" sem duplicar o objeto inteiro em
cada teste que precisa de uma pequena variação.

## Boas práticas

- Nunca hardcode segredos (senha, token) dentro do arquivo de dados — sempre via variável de
  ambiente (Capítulo 18).
- Separe a `interface`/`type` dos valores concretos — isso permite reaproveitar o formato em
  factories, builders ou dados vindos de API.
- Use dados únicos (fake data) sempre que o teste cria um recurso que não pode colidir entre
  execuções (ex.: cadastro de e-mail).

## Erros comuns

- Duplicar o mesmo objeto de usuário em vários arquivos de teste, em vez de centralizar em `data/`.
- Usar sempre o mesmo e-mail fixo em um teste de cadastro, o que faz o segundo run falhar por
  "e-mail já existe" — resolvido com fake data única por execução.
- Misturar massa de dados com lógica de teste dentro do próprio arquivo `.spec.ts`.

## Exercício prático

Crie `data/products.ts` com uma constante `defaultCheckoutInfo: CheckoutInfo` reaproveitando a
interface já existente em [`data/types.ts`](../data/types.ts), e substitua o objeto
`validCheckoutInfo` hardcoded em [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) por essa
constante importada.

## Resumo

Dados fixos para valores estáveis e conhecidos; JSON para massa externa; factory/builder para
variações controladas; fake data para valores que precisam ser únicos a cada execução. Sempre separe
o formato (`interface`) dos valores.

## Checklist de revisão

- [ ] Nenhum segredo (senha, token) está hardcoded em arquivos de `data/`.
- [ ] Toda massa de dados repetida entre testes está centralizada em `data/`.
- [ ] Sei escolher entre dado fixo, factory e fake data conforme a necessidade do cenário.

## Perguntas para fixação

1. Quando uma factory é preferível a um objeto de dado fixo?
2. Por que dados de cadastro (ex.: e-mail) geralmente precisam ser únicos a cada execução?
3. Qual a vantagem de separar a `interface` dos valores concretos de massa de dados?
4. Por que a senha em `data/users.ts` não está escrita diretamente no arquivo?

## Desafio opcional

Instale `@faker-js/faker` e crie uma factory `buildRandomCheckoutInfo()` que gera nome, sobrenome e
CEP aleatórios a cada chamada, para ser usada em testes de checkout que não dependem de um valor
fixo.

---
← [Anterior](16-apis.md) | [Índice](00-indice.md) | [Próximo: Variáveis de Ambiente →](18-variaveis-ambiente.md)
