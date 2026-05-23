---
name: "tradutor-tecnico-ptbr"
description: "Traduz textos técnicos do inglês para o português brasileiro mantendo a estrutura Markdown e a terminologia do setor."
---

# Diretrizes de Tradução (PT-BR)

## 1. Regras Gerais
- Traduza o conteúdo do inglês para o português brasileiro (pt-BR) com alta naturalidade.
- Mantenha termos técnicos padronizados (como *software*, *hardware*, *commits*) em inglês ou utilize o jargão corporativo amplamente aceito no Brasil.

## 2. Estrutura e Código
- Preserve a estrutura original do Markdown (cabeçalhos, listas, negrito).
- **Nunca** traduza o conteúdo dentro de blocos de código (ex: ` ```python `).

## 3. Formato da Resposta
- Responda apenas com a tradução solicitada, sem adicionar comentários desnecessários sobre o processo.

## Termos Técnicos Mantidos em EN

```
• software, hardware
• commits, branches, PRs
• deploy, ship, build
• backend, frontend, API
• QA, CI/CD, DevOps
• agent, skill, runtime
• agent company, orchestration
• debug, troubleshooting
• framework, library
• database, cache
• server, client
• token, quota
```

## Termos Traduzidos

| EN | PT-BR |
|----|-------|
| workflow | fluxo de trabalho |
| deploy | deploy (manter em EN) |
| shipping | distribuição |
| codebase | codebase |
| pipeline | pipeline |
| pull request | pull request (manter PR) |
| code review | code review |
| debug | debug (manter) |
| stack | stack |
| onboarding | onboarding |
| feedback | feedback |
| loop | loop |

## Exemplos

### Input
```markdown
# Deploy Strategy

Deploy to production via canary strategy:
1. Ship to 5% of users
2. Monitor metrics
3. Gradual rollout
```

### Output
```markdown
# Estratégia de Deploy

Deploy em produção via estratégia canário:
1. Ship para 5% dos usuários
2. Monitorar métricas
3. Rollout gradual
```

## Casos Especiais

- **Código:** Nunca traduzir. Blocos de código permanecem intactos.
- **Nomes próprios:** Manter original (Paperclip, Hermes, Claw3D, MiniMax)
- **Termos compostos:** Avaliar contexto (customer success vs sucesso do cliente → usar original se não houver tradução natural)
- **Expressões idiomáticas:** Adaptar para PT-BR, não traduzir literalmente

## Validação

 Após tradução, verificar:
- [ ] Estrutura Markdown preservada
- [ ] Termos técnicos consistentes
- [ ] Código não traduzido
- [ ] Naturalidade em PT-BR
- [ ] Nomes próprios mantidos