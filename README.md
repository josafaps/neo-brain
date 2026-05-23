# izzi Spark — Agent Company

Empresa de agentes AI para desenvolvimento de produtos digitais e serviços de tecnologia.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Orchestration | Paperclip |
| Runtime | Hermes |
| Provider | MiniMax M2.7 (Token Plan Plus) |
| Visualização | Claw3D |
| Infra | Hostinger VPS, Dokploy |
| Deploy | Cloudflare Pages, Docker |

## Estrutura

```
izzi-spark/
├── COMPANY.md           # Company manifest
├── .paperclip.yaml     # Paperclip configuration
├── agents/
│   ├── ceo.md          # CEO (Josafá)
│   ├── cto.md          # CTO (Neo)
│   ├── cfo.md          # CFO Agent
│   ├── vanguard.md     # Customer Success Agent
│   ├── dev-team.md     # Dev Team (Staff, Dev Agent, QA, Release, Security)
│   └── ops-team.md     # Ops Team (Research, Docs)
├── skills/
│   ├── vanguard/
│   │   ├── onboarding-workflow.md
│   │   ├── feedback-collection.md
│   │   └── pricing-decisions.md
│   └── tradutor-tecnico-ptbr.md
└── images/
    └── org-chart.png
```

## Quick Start

1. Instalar Paperclip
2. Importar company: `npx paperclipai company import ./izzi-spark`
3. Configurar MiniMax M2.7 como provider
4. Conectar Claw3D
5. Start office: `npm run dev` (dentro do Claw3D)

## Agents

| Agent | Role | Hat |
|-------|------|-----|
| CEO (Josafá) | Aprovações finais | Red, Yellow |
| CTO (Neo) | Arquitetura, orchestration | Blue, Black |
| CFO Agent | Budget, custos | White, Black |
| Vanguard | Customer success | Red, Yellow |
| Staff Engineer | Arquitetura | Yellow, Green |
| Dev Agent (Pi.dev) | Código | Green, Blue |
| QA Lead | Quality | White, Black |
| Release Engineer | Deploy | Blue, Black |
| Security Auditor | Security | Black, White |
| Research Lead | Intel | White, Green |
| Docs Lead | Docs | White, Blue |

## Skills

Importadas de companies referência:
- GStack (engineering)
- Superpowers (TDD)
- Aeon Intelligence (routines)

Locais:
- `vanguard/onboarding-workflow`
- `vanguard/feedback-collection`
- `vanguard/pricing-decisions`
- `tradutor-tecnico-ptbr`

## Approval Gates

| Gate | Approver |
|------|----------|
| Deploy produção | CEO |
| Spend > $100 | CEO |
| Spend $10-$100 | CFO |
| Discount > 20% | CEO |
| Discount < 20% | CFO |
| Novo Agent | CEO |
| Feature Request | CTO |
| Security Issue | Security Auditor |

---

*Versão 1.0 — Mai 2026*