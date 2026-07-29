← [Anterior](22-regressao.md) | [Índice](../README.md) | [Próximo: Refatoração →](24-refatoracao.md)

# Capítulo 23 — Integração Contínua (CI/CD)

## Conceito

Integração Contínua (CI) é rodar a suíte de testes automaticamente a cada mudança de código (push,
pull request), sem depender de alguém lembrar de rodar manualmente. É o que transforma automação de
"scripts que existem" em "rede de segurança viva" do time.

## GitHub Actions (implementado neste projeto)

Ver [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml) — um pipeline real,
com dois jobs:

```yaml
jobs:
  smoke:
    name: Smoke tests (a cada push/PR)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --project=chromium --grep @smoke
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: html-report-smoke
          path: reports/html-report/

  regression:
    needs: smoke
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      # ... mesma estrutura, mas roda @regression em todos os navegadores
```

## Explicação

- `on: push / pull_request` — dispara o pipeline a cada push e a cada PR aberto/atualizado contra
  `main`/`master`.
- `job: smoke` roda em **todo** push/PR — rápido (só Chromium, só `@smoke`), dá feedback em minutos.
- `job: regression` só roda em pull requests (`if: github.event_name == 'pull_request'`) e **depende**
  do job `smoke` ter passado primeiro (`needs: smoke`) — não faz sentido gastar tempo com a suíte
  completa se o básico já está quebrado.
- `npx playwright install --with-deps` — em CI (ambiente Linux limpo), o parâmetro `--with-deps`
  também instala as bibliotecas de sistema operacional necessárias para rodar os navegadores
  headless, além dos próprios binários.
- `env: CI: true` — como `playwright.config.ts` lê `process.env.CI` para decidir `retries`,
  `workers` e `forbidOnly` (Capítulo 19), essa variável precisa estar presente para o comportamento
  de CI (mais retries, `forbidOnly` ativo) entrar em vigor.
- `actions/upload-artifact` com `if: always()` — publica o relatório HTML mesmo quando os testes
  falham (é justamente quando você mais precisa dele).

## Azure DevOps (equivalente conceitual)

```yaml
trigger:
  - main
pool:
  vmImage: ubuntu-latest
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
  - script: npm ci
  - script: npx playwright install --with-deps
  - script: npx playwright test --grep @smoke
    env:
      CI: true
  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: reports/html-report
      artifact: html-report
```

## Jenkins (equivalente conceitual)

```groovy
pipeline {
  agent any
  stages {
    stage('Instalar') {
      steps { sh 'npm ci' }
    }
    stage('Navegadores') {
      steps { sh 'npx playwright install --with-deps' }
    }
    stage('Testes') {
      steps { sh 'CI=true npx playwright test --grep @smoke' }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'reports/html-report/**', allowEmptyArchive: true
    }
  }
}
```

## Boas práticas

- Sempre rode `npx playwright install --with-deps` em ambientes Linux limpos de CI — sem isso, os
  navegadores falham ao abrir por falta de bibliotecas do sistema operacional.
- Separe estágios rápidos (`@smoke`, só Chromium) de estágios completos (`@regression`, todos os
  navegadores) — não force todo push a esperar a suíte inteira.
- Sempre publique o relatório HTML (e idealmente traces) como artefato do pipeline, mesmo em
  sucesso — falhas intermitentes só aparecem quando você já tem o hábito de checar.

## Erros comuns

- Rodar a suíte completa (todos os navegadores, `@regression` inteira) a cada push, tornando o
  feedback do CI lento e frustrante para o time.
- Esquecer `--with-deps` (ou o equivalente) e ter o pipeline falhando por erro de biblioteca de
  sistema, não por bug real.
- Não publicar o relatório/trace como artefato, perdendo a capacidade de diagnosticar falhas de CI
  que não reproduzem localmente.

## Exercício prático

Abra [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml) e adicione um terceiro
job `nightly`, disparado apenas via `workflow_dispatch` (execução manual) ou `schedule` (cron diário),
rodando a suíte inteira sem filtro de tag, em todos os navegadores.

## Resumo

CI transforma testes automatizados em rede de segurança contínua. Separe estágios rápidos
(`@smoke`) de completos (`@regression`), instale dependências de sistema em ambientes Linux, e sempre
publique evidências como artefato do pipeline.

## Checklist de revisão

- [ ] Existe um pipeline de CI configurado (ver `.github/workflows/playwright.yml`).
- [ ] O pipeline instala navegadores com `--with-deps` em ambiente Linux.
- [ ] O relatório HTML é publicado como artefato mesmo em caso de falha.
- [ ] Existem estágios separados para smoke (rápido) e regressão (completo).

## Perguntas para fixação

1. Por que o job `regression` depende do job `smoke` (`needs: smoke`) neste pipeline?
2. Para que serve o parâmetro `--with-deps` ao instalar navegadores em CI?
3. Por que a variável de ambiente `CI` precisa estar definida para o `playwright.config.ts` se
   comportar de forma diferente em pipeline?
4. Por que publicar o relatório/artefato mesmo quando os testes passam (`if: always()`)?

## Desafio opcional

Configure o job `regression` para rodar em uma matriz (`strategy.matrix`) dos três navegadores
(`chromium`, `firefox`, `webkit`) em paralelo, como três jobs simultâneos em vez de um único job
rodando os três projetos em sequência.

---
← [Anterior](22-regressao.md) | [Índice](../README.md) | [Próximo: Refatoração →](24-refatoracao.md)
