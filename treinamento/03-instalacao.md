← [Anterior](02-conhecendo-playwright.md) | [Índice](../README.md) | [Próximo: Estrutura de Projeto →](04-estrutura-projeto.md)

# Capítulo 3 — Instalação

## Conceito

Antes de escrever qualquer teste, precisamos de: Node.js instalado, um editor de código, um projeto
Node inicializado, o Playwright Test como dependência, e os binários dos navegadores baixados.

## Passo a passo

### 1. Instalar o Node.js

Baixe a versão LTS em [nodejs.org](https://nodejs.org). Verifique a instalação:

```bash
node -v
npm -v
```

`node` é o runtime que executa JavaScript/TypeScript fora do navegador. `npm` (Node Package Manager)
é o gerenciador de pacotes que usamos para instalar o Playwright e suas dependências.

### 2. Instalar o VS Code

Baixe em [code.visualstudio.com](https://code.visualstudio.com). Instale a extensão oficial
**Playwright Test for VSCode** — ela permite rodar/debugar testes individuais clicando num ícone ao
lado de cada `test(...)`.

### 3. Criar o projeto e inicializar o npm

```bash
mkdir meu-projeto-playwright
cd meu-projeto-playwright
npm init -y
```

`npm init -y` cria um `package.json` (o "RG" do projeto Node: nome, versão, scripts, dependências),
aceitando os valores padrão (`-y` = yes para tudo).

### 4. Instalar o Playwright

```bash
npm init playwright@latest
```

Esse comando interativo pergunta: TypeScript ou JavaScript (escolha **TypeScript**), nome da pasta de
testes (`tests`), se quer adicionar um workflow de GitHub Actions, e se quer instalar os navegadores
agora. Ele gera automaticamente `playwright.config.ts`, `package.json` atualizado e um exemplo em
`tests/example.spec.ts`.

Alternativa manual (o que fizemos neste repositório):

```bash
npm install -D @playwright/test typescript @types/node
```

### 5. Instalar os navegadores

```bash
npx playwright install
```

Baixa os binários do Chromium, Firefox e WebKit para o cache local do Playwright. Sem esse passo,
`playwright test` falha ao tentar abrir um navegador. Para instalar um só (mais rápido no dia a dia):

```bash
npx playwright install chromium
```

### 6. Executar o primeiro teste

```bash
npx playwright test
```

## Explicação de cada comando

| Comando | O que faz |
|---|---|
| `npm init -y` | Cria `package.json` com valores padrão |
| `npm install -D <pacote>` | Instala `<pacote>` como dependência de desenvolvimento (`-D`/`--save-dev`) |
| `npx playwright install` | Baixa os binários dos navegadores usados pelo Playwright |
| `npx playwright test` | Executa a suíte de testes conforme `playwright.config.ts` |
| `npx <comando>` | Executa um binário de um pacote instalado localmente, sem precisar instalá-lo globalmente |

## Boas práticas

- Sempre use `-D` ao instalar Playwright/TypeScript — são ferramentas de desenvolvimento, não código
  que roda em produção.
- Fixe (ou ao menos documente) a versão do `@playwright/test` no `package.json` (ver
  [`package.json`](../package.json)) para evitar que um `npm install` traga uma versão nova e quebre
  a suíte sem aviso.
- Rode `npx playwright install` também no ambiente de CI — os binários não vêm com o pacote npm.

## Erros comuns

- Instalar Playwright globalmente (`npm install -g`) — isso quebra a reprodutibilidade entre
  máquinas do time; sempre instale como dependência local do projeto.
- Esquecer de rodar `npx playwright install` e receber erro de "executable doesn't exist".
- Confundir `npm install` (instala dependências do `package.json`) com `npx playwright install`
  (baixa os binários dos navegadores) — são passos independentes.

## Exercício prático

Em uma pasta separada de teste, rode `npm init playwright@latest`, escolha TypeScript, e execute o
teste de exemplo gerado (`npx playwright test`). Depois abra o relatório HTML gerado.

## Resumo

Instalação = Node + editor + `package.json` + `@playwright/test` + binários dos navegadores. Cinco
passos, todos únicos por projeto (não repetidos a cada teste novo).

## Checklist de revisão

- [ ] `node -v` e `npm -v` respondem sem erro.
- [ ] `@playwright/test` aparece em `devDependencies` no `package.json`.
- [ ] `npx playwright install` foi executado ao menos uma vez.
- [ ] Consigo rodar `npx playwright test` e ver o resultado no terminal.

## Perguntas para fixação

1. Qual a diferença entre `npm install` e `npx playwright install`?
2. Por que instalamos o Playwright como dependência de desenvolvimento (`-D`) e não como dependência
   normal?
3. O que acontece se você rodar `playwright test` sem antes rodar `playwright install`?
4. Para que serve a extensão "Playwright Test for VSCode"?

## Desafio opcional

Configure o projeto para rodar `npx playwright install --with-deps` em uma imagem Linux limpa (ex.:
um container Docker `node:20`) e documente quais bibliotecas de sistema operacional o Playwright
precisa para rodar os navegadores headless.

---
← [Anterior](02-conhecendo-playwright.md) | [Índice](../README.md) | [Próximo: Estrutura de Projeto →](04-estrutura-projeto.md)
