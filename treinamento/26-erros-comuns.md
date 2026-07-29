← [Anterior](25-boas-praticas.md) | [Índice](../README.md) | [Próximo: Exercício Prático →](27-exercicio-pratico.md)

# Capítulo 26 — Erros Mais Comuns

## Conceito

Lista consolidada dos erros mais cometidos por quem está começando em automação com Playwright,
cada um com a explicação de por que é um problema e como evitá-lo.

## Os 20+ erros

1. **Usar `waitForTimeout` para sincronizar** — mascarara um problema real de timing em vez de
   resolvê-lo. *Evite*: use auto-waiting ou uma espera explícita correspondente (Capítulo 15).

2. **Esquecer `await` antes de uma ação** — o teste segue em frente sem esperar o passo anterior
   terminar, causando falsos positivos/negativos. *Evite*: sempre `await` ações e assertions.

3. **Usar `.nth()`/`.first()` para "pegar o elemento certo"** quando deveria filtrar por conteúdo —
   quebra silenciosamente se a ordem mudar. *Evite*: filtre por texto/atributo (Capítulo 6).

4. **Expor `Locator`s públicos** em Page Objects, permitindo que testes cliquem em elementos
   diretamente, ignorando os métodos de negócio. *Evite*: locators sempre `private` (Capítulo 8).

5. **Criar Page Objects "Deus"**, com dezenas de responsabilidades de telas diferentes. *Evite*:
   uma classe por tela, Components para UI compartilhada (Capítulos 8 e 9).

6. **Duplicar locators de UI compartilhada** entre duas ou mais Pages. *Evite*: extraia um
   Component assim que o mesmo pedaço de UI aparecer pela segunda vez.

7. **Hardcodar segredos** (senha, token) no código de teste. *Evite*: variáveis de ambiente
   (Capítulo 18).

8. **Manter o código bruto do Codegen** sem refatorar para POM. *Evite*: sempre refatore antes de
   levar para `tests/` (Capítulo 14).

9. **Testes dependentes de ordem de execução** (um teste assume estado deixado por outro).
   *Evite*: cada teste deve ser independente (Capítulo 20).

10. **Usar `retries` para mascarar flakiness** em vez de investigar a causa raiz. *Evite*: retries
    servem para instabilidade de ambiente em CI, não para "consertar" um teste mal escrito.

11. **Título de teste genérico** (`'teste 1'`, `'funciona'`). *Evite*: descreva o comportamento de
    negócio validado.

12. **Usar `toHaveText` em conteúdo dinâmico** (timestamp, contador variável), gerando falhas
    intermitentes. *Evite*: use `toContainText` para partes dinâmicas (Capítulo 7).

13. **Ler texto com `.textContent()` e comparar manualmente**, perdendo o retry automático de uma
    web-first assertion. *Evite*: `expect(locator)...` sempre que possível.

14. **Usar XPath complexo** quando um seletor semântico resolveria com menos código e mais clareza.
    *Evite*: `getByRole`/`getByLabel`/`getByTestId` primeiro (Capítulo 6).

15. **Não instalar dependências de sistema em CI** (`--with-deps`), causando falhas por biblioteca
    ausente, não por bug real (Capítulo 23).

16. **Rodar a suíte completa a cada push**, sem separar `@smoke` de `@regression`, deixando o
    feedback de CI lento (Capítulos 21 e 23).

17. **Versionar pastas de evidência** (`screenshots/`, `videos/`, `traces/`, `reports/`) no Git.
    *Evite*: sempre no `.gitignore` (Capítulo 13).

18. **Ignorar o Trace Viewer** e tentar depurar falhas de CI só lendo texto de log. *Evite*: abra o
    trace — ele mostra exatamente o estado da tela em cada ação (Capítulo 13).

19. **Misturar `utils/` e `helpers/`** sem critério, criando uma pasta única "genérica" onde tudo
    cai. *Evite*: `helpers/` é lógica pura sem UI; `utils/` é infraestrutura (Capítulo 10).

20. **Usar `any` sem necessidade real**, perdendo a checagem de tipos que o TypeScript oferece.
    *Evite*: tipagem explícita sempre; `any` só com justificativa documentada.

21. **Automatizar cenários exploratórios ou executados uma única vez** — desperdiça esforço de
    manutenção em algo que não se repete (Capítulo 1).

22. **Não atualizar/podar testes obsoletos**, deixando a suíte de regressão inflar indefinidamente
    sem revisão (Capítulo 22).

## Boas práticas (como usar esta lista)

- Use esta lista como checklist de code review para qualquer novo teste ou Page Object.
- Ao encontrar um destes padrões em um PR, aponte o número do item e o capítulo correspondente para
  quem escreveu, transformando a correção em aprendizado.

## Exercício prático

Volte ao teste ruim do Capítulo 24 ("Um teste ruim") e enumere, usando os números desta lista, todos
os erros presentes nele.

## Resumo

A maioria dos problemas de automação se resume a três causas: sincronização incorreta
(`waitForTimeout`), acoplamento a detalhes frágeis (seletores/ordem), e falta de separação de
responsabilidade (Page Object "Deus", duplicação, `utils`/`helpers` misturados).

## Checklist de revisão

- [ ] Revisei meu projeto contra os 22 itens desta lista.
- [ ] Nenhum item se aplica ao código que estou prestes a enviar para revisão.

## Perguntas para fixação

1. Cite três erros desta lista relacionados a sincronização incorreta.
2. Cite três erros relacionados a acoplamento a detalhes frágeis de seletor/ordem.
3. Por que "manter o código bruto do Codegen" está nesta lista, mesmo o Codegen sendo uma ferramenta
   oficial do Playwright?
4. Por que "automatizar cenários exploratórios" é um erro, mesmo sendo tecnicamente possível?

## Desafio opcional

Adicione, a esta lista, mais 3 erros que você já cometeu (ou viu alguém cometer) em automação de
testes — mesmo que não estejam explicitamente cobertos nos capítulos deste treinamento — e explique
como evitá-los.

---
← [Anterior](25-boas-praticas.md) | [Índice](../README.md) | [Próximo: Exercício Prático →](27-exercicio-pratico.md)
