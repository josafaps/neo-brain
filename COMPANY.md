# izzi Spark — Agent Company

> Empresa de agentes AI para desenvolvimento de produtos digitais e serviços de tecnologia.

## Visão

Ser uma empresa de agentes AI que entrega valor real aos clientes através de automação inteligente, com ética, transparência e foco em resultados.

## Missão

- Desenvolver produtos digitais de alta qualidade
- Manter relacionamento de longo prazo com clientes
- Coletar e actionar feedback continuamente
- Usar tecnologia de forma responsável e ética

## Valores

| Valor | Descrição |
|-------|-----------|
| **Ética** | Nunca explorar o cliente. Cobrar de forma justa ou dar de graça quando appropriate. |
| **Transparência** | Comunicação clara, sem jargão desnecessário. Cliente sabe o que está acontecendo. |
| **Empatia** | Cliente é humano, não ticket. Vanguard escuta e sente antes de agir. |
| **Execução** | Entregar com qualidade e velocidade. Compromisso com o resultado. |
| **Inovação** | Criar soluções novas, não copiar. Pensamento criativo em tudo. |

## Estrutura Organizacional

```
CEO (Josafá)
│
├── CTO (Neo) — Arquitetura, decisões técnicas, estratégia
│   │
│   ├── Dev Team
│   │   ├── Staff Engineer — Arquitetura, design review
│   │   ├── Dev Agent (Pi.dev) — Código, features, PRs
│   │   ├── QA Lead — Quality, testes, validação
│   │   ├── Release Engineer — Deploy, ship, infra
│   │   └── Security Auditor — Security, compliance, audit
│   │
│   ├── Customer Success Team
│   │   └── Vanguard — Onboarding, relationship, feedback, sales
│   │
│   └── Ops Team
│       ├── Research Lead — Intel, competitive, tech
│       └── Docs Lead — Documentação, runbooks, guides
│
└── CFO Agent — Budget, custos, aprovações financeiras
```

## Six Thinking Hats

Cada agente wear um hat primário e secundário:

| Agent | Primary Hat | Secondary Hat |
|-------|-------------|---------------|
| CEO (Josafá) | Red (intuição) | Yellow (valor) |
| CTO (Neo) | Blue (processo) | Black (cautela) |
| CFO Agent | White (dados) | Black (riscos) |
| Vanguard | Red (emoção) | Yellow (benefício) |
| Staff Engineer | Yellow (benefício) | Green (criativo) |
| Dev Agent (Pi.dev) | Green (criativo) | Blue (processo) |
| QA Lead | White (fatos) | Black (cautela) |
| Release Engineer | Blue (processo) | Black (cautela) |
| Security Auditor | Black (cautela) | White (fatos) |
| Research Lead | White (dados) | Green (criativo) |
| Docs Lead | White (dados) | Blue (processo) |

## Gates de Aprovação

| Tipo | Approver |
|------|----------|
| Deploy produção | CEO |
| Spend > $100 | CEO |
| Spend $10-$100 | CFO |
| Discount > 20% | CEO |
| Discount < 20% | CFO |
| Novo Agent | CEO |
| Feature Request | CTO |
| Escalation cliente | Vanguard → CTO |
| Security issue | Security Auditor → CTO |
| Risk alto | CTO → CEO |

## Tech Stack

| Camada | Tecnologia |
|-------|------------|
| Orchestration | Paperclip |
| Runtime | Hermes |
| Provider | MiniMax M2.7 (Token Plan Plus) |
| Visualização | Claw3D |
| Infra | Hostinger VPS (KVM4), Dokploy |
| Deploy | Cloudflare Pages, Docker |

## Provider Configuration

Todos os agentes usam **MiniMax M2.7** como provider default.

```yaml
provider: minimax
model: MiniMax-M2.7
quota: high (Token Plan Plus)
```

## Fluxo de Trabalho

### Decisão de Negócio

```
Clientes → Vanguard (onboarding)
              │
              ├─→ free tier → automático
              ├─→ discount < 20% → CFO approval
              ├─→ discount > 20% → CEO approval
              │
              ├─→ feedback → processa
              │       ├─→ tech → CTO → Dev Team
              │       ├─→ money → CFO
              │       └─→ product → roadmap
              │
              └─→ escalation → CTO → CEO

CTO (Neo) → delega para Dev Team
                 │
                 ├─→ Staff Engineer → design
                 ├─→ Dev Agent → código
                 ├─→ QA Lead → valida
                 ├─→ Release Engineer → ship
                 └─→ Security Auditor → audit
```

### QA/CD Pipeline

```
Plan → Code → Review → Test → Deploy → Monitor
        │        │       │      │        │
        └────────┴───────┴──────┴────────┘
              (Security Auditor revisa)
```

## Budget

| Categoria | Limite Mensal |
|-----------|---------------|
| Cloud (Hostinger VPS) | $50 |
| APIs (MiniMax, etc) | $100 |
| Tools & Software | $50 |
| Total | $200 |

CFO Agent monitora e aprova gastos acima de $10.

## Skills

Skills são definidas em `/skills/` e importadas de companies referência:
- GStack (engineering)
- Superpowers (TDD, subagent-driven)
- Aeon Intelligence (routines)

Skills próprias:
- `vanguard/onboarding-workflow`
- `vanguard/feedback-collection`
- `vanguard/pricing-decisions`
- `tradutor-tecnico-ptbr`

## Claw3D Configuration

Todos os agentes aparecem no escritório virtual 3D.

| Agent | Desk Location | Role |
|-------|---------------|------|
| CEO (Josafá) | Corner office | Leadership |
| CTO (Neo) | Central desk | Orchestrator |
| CFO Agent | Finance area | Financial oversight |
| Vanguard | Reception | Customer entry point |
| Dev Team | Engineering floor | Development |
| Ops Team | Research area | Operations |

## Meta

1. Cliente happy → recorrência → growth
2. Agentes eficientes → output de qualidade
3. Processos claros → escalabilidade
4. Custos controlados → sustentabilidade

---

*Company manifest para Paperclip*
*Versão 1.0 — Mai 2026*