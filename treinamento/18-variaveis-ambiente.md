← [Anterior](17-massa-de-dados.md) | [Índice](../README.md) | [Próximo: Configuração do Playwright →](19-configuracao.md)

# Capítulo 18 — Variáveis de Ambiente

## Conceito

Variáveis de ambiente permitem que o mesmo código de teste rode contra ambientes diferentes (local,
homologação, produção) e use segredos (senha, token) sem que esses valores fiquem escritos no
código-fonte versionado no Git.

## Arquivos deste projeto

- [`.env.example`](../.env.example) — modelo versionado no Git, **sem** segredos reais, documentando
  quais variáveis existem.
- `.env` — arquivo real, com valores (possivelmente sensíveis), **nunca** versionado (está no
  [`.gitignore`](../.gitignore)).

```bash
# .env.example
BASE_URL=https://www.saucedemo.com
DEFAULT_PASSWORD=secret_sauce
```

## Como o projeto lê essas variáveis

```typescript
// utils/env.ts
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
}
```

```typescript
// playwright.config.ts
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  },
});
```

## Explicação

- `dotenv.config()` carrega o arquivo `.env` da raiz do projeto e popula `process.env` com seus
  valores, antes de qualquer outra configuração ser lida.
- `getEnvVar(name, fallback)` centraliza o acesso a `process.env`: se a variável existir, devolve seu
  valor; senão, devolve um `fallback` (quando fornecido) ou lança um erro explícito, em vez de deixar
  o resto do código lidar com `undefined` silenciosamente.
- `process.env.BASE_URL ?? 'https://www.saucedemo.com'` em `playwright.config.ts` permite trocar o
  ambiente alvo só definindo `BASE_URL` diferente (ex.: em CI, sem alterar nenhuma linha de código).

## Por que nunca deixar dados sensíveis no código

- Qualquer pessoa com acesso ao repositório (inclusive em um fork público) veria a senha/token.
- Rotacionar uma senha exigiria uma mudança de código e um novo deploy da suíte, em vez de só trocar
  uma variável no pipeline de CI.
- Ferramentas de scanning de segredos (usadas por GitHub, GitLab etc.) sinalizam e podem até
  bloquear commits com segredos hardcoded.

## Boas práticas

- Sempre mantenha um `.env.example` atualizado e versionado, documentando quais variáveis existem
  (sem valores reais sensíveis).
- Centralize a leitura de `process.env` em uma função utilitária (`getEnvVar`), nunca acesse
  `process.env.X` diretamente espalhado pelo código.
- No CI, configure as variáveis como *secrets* da plataforma (GitHub Actions, Azure DevOps, Jenkins),
  nunca como um arquivo `.env` versionado.

## Erros comuns

- Versionar o arquivo `.env` real por engano (esquecer de adicioná-lo ao `.gitignore`).
- Acessar `process.env.MINHA_VAR` diretamente em vários arquivos, sem um `fallback` ou validação,
  gerando `undefined` silencioso que só quebra em tempo de execução, longe do ponto real do erro.
- Misturar variáveis de configuração de infraestrutura (URL, timeout) com segredos de aplicação
  (senha, token) sem nenhuma distinção — dificulta saber o que realmente precisa de tratamento como
  segredo.

## Exercício prático

Adicione uma nova variável `PROBLEM_USER` ao [`.env.example`](../.env.example) e use `getEnvVar(...)`
em [`data/users.ts`](../data/users.ts) para que o `username` do usuário `problem` também venha de
variável de ambiente, em vez de estar hardcoded como string.

## Resumo

`.env.example` documenta; `.env` (nunca versionado) guarda valores reais; `getEnvVar` centraliza a
leitura com fallback e erro explícito. Isso mantém segredos fora do código e permite trocar de
ambiente sem alterar uma linha de teste.

## Checklist de revisão

- [ ] `.env` está no `.gitignore` e nunca foi commitado.
- [ ] `.env.example` existe e está atualizado com todas as variáveis usadas pelo projeto.
- [ ] Nenhum segredo aparece hardcoded em nenhum arquivo `.ts` do projeto.

## Perguntas para fixação

1. Qual a diferença de propósito entre `.env` e `.env.example`?
2. Por que centralizar a leitura de `process.env` em uma função (`getEnvVar`) é melhor do que acessar
   `process.env.X` diretamente em vários lugares?
3. Onde as variáveis de ambiente/segredos deveriam ser configuradas em um pipeline de CI?
4. O que acontece, neste projeto, se `getEnvVar` for chamada sem `fallback` e a variável não existir?

## Desafio opcional

Configure, no seu próprio ambiente, três arquivos `.env.local`, `.env.staging` e `.env.production`
(sem segredos reais, apenas para prática) e ajuste o script de teste do `package.json` para aceitar
qual arquivo carregar via uma variável `ENV=staging`, documentando a mudança necessária em
`playwright.config.ts`.

---
← [Anterior](17-massa-de-dados.md) | [Índice](../README.md) | [Próximo: Configuração do Playwright →](19-configuracao.md)
