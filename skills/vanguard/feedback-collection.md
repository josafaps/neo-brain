# Vanguard — Feedback Collection

## Objetivo

Coletar, categorizar e actionar feedback de clientes de forma contínua e estruturada.

## Princípios

1. **Contínuo** — Não esperar review formal, coletar sempre
2. **Categorizado** — Feedback organizado por tipo (tech, produto, experiência)
3. **Actionável** — Não é só coletar, é fazer algo com isso
4. **Loop back** — Cliente sabe que feedback gerou ação

## Categorias

| Categoria | Descrição | Actiona |
|-----------|-----------|---------|
| Tech | Issues técnicos, bugs, performance | CTO → Dev Team |
| Produto | Features, UX, pricing | CTO → Roadmap |
| Experiência | Onboarding, suporte, comunicação | Vanguard direto |
| Negócio | Budget, contract, partnership | CEO/CFO |

## Coleta

### Fontes de Feedback

```
• Conversas diretas com cliente
• check-ins agendados
• Pesquisas post-projeto
• NPS surveys
• Social media mentions
• Reviews públicos
• Suporte tickets
```

### Técnica de Coleta

```
1. Ask open questions:
   "Como está sendo sua experiência?"
   "O que poderia ser melhor?"
   "Tem algo que está te frustrando?"

2. Listen actively:
   Não interromper
   Repita para confirmar entendimento
   Faça perguntas de clarificação

3. Document in context:
   Não usar formulário
   Anotar no fluxo da conversa
   Capturar tom/emotion junto com facts
```

## Processamento

### Step 1: Capture

```
Feedback raw → sistema
├── Texto original
├── Contexto (quem, quando, projeto)
├── Tom (positivo/negativo/neutro)
└── Source (chat/email/survey)
```

### Step 2: Categorize

```
Tech → Label: [tech]
Product → Label: [produto]
Experience → Label: [experiencia]
Business → Label: [business]
```

### Step 3: Prioritize

| Prioridade | Critério | SLA |
|------------|----------|-----|
| P1 - Crítico | Afeta operação do cliente | 24h |
| P2 - Alto | Impacta produtividade | 1 semana |
| P3 - Médio | Enhancement, não urgency | 1 mês |
| P4 - Baixo | Nice to have | backlog |

### Step 4: Route

```
Tech → CTO (Neo)
    │
    ├── Dev Team (bugs/feature)
    ├── Release Engineer (infra)
    └── Security Auditor (security)

Produto → CTO
    └── Product roadmap

Experiência → Vanguard
    └── Process improvement

Negócio → CEO/CFO
    └── Contract review
```

### Step 5: Action

```
Cada feedback deve resultar em:
├── Acknowledgement para cliente (sempre)
├── Action tomada (quando applicable)
└── Loop back ao cliente (quando resolved)
```

## Loop Back ao Cliente

```
Feedback received
    │
    ▼
We heard you
    │
    ▼
We're working on it
    │
    ▼
Here's what we did
    │
    ▼
Thank you for helping us improve
```

**Timing:**
- Acknowledgement: 24h
- Update: 1 semana (se ainda não resolved)
- Resolution: conforme SLA

## Metrics

| Métrica | Target |
|---------|--------|
| Feedback collected/month | > 10 |
| NPS Score | > 50 |
| Response time | < 24h |
| Resolution rate | > 80% |
| Loop back rate | 100% |

## Template

```markdown
## Feedback Entry

**Date:** YYYY-MM-DD
**Client:** [Nome]
**Source:** [chat/email/survey/etc]
**Category:** [tech/produto/experiencia/negocio]
**Priority:** [P1/P2/P3/P4]

**Texto:**
[Original feedback]

**Contexto:**
[Quem disse, quando, situação]

**Tom:** [positivo/negativo/neutro]

**Categorizado por:** Vanguard

**Action:** [next steps]

**Status:** [open/in-progress/resolved]
```

## Anti-patterns

❌ Não coletar feedback e guardar  
❌ Não categorizar (vira bagunça)  
❌ Não actionar (cliente para de dar feedback)  
❌ Não fazer loop back (cliente acha que foi ignorado)  
❌ Não agregar feedback (padrão invisível)  

## Reporting

Semanalmente para CTO/CEO:
- Feedback coletado (quantidade)
- Por categoria (distribuição)
- P1 issues (lista)
- Tendências (patterns)
- Actions tomadas