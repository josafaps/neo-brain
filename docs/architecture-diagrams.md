# izzi Spark — Architecture Docs
> Diagrams com Mermaid para documentação técnica e visualização

---

## 1. Estrutura Organizacional

```mermaid
graph TB
    subgraph Leadership
        CEO["👑 CEO<br/>Josafá<br/><small>Red + Yellow</small>"]
        CTO["🔧 CTO<br/>Neo<br/><small>Blue + Black</small>"]
        CFO["💰 CFO Agent<br/><small>White + Black</small>"]
    end

    subgraph Dev_Team["Dev Team"]
        STAFF["⚙️ Staff Engineer<br/><small>Yellow + Green</small>"]
        DEV["💻 Dev Agent<br/>Pi.dev<br/><small>Green + Blue</small>"]
        QA["🔍 QA Lead<br/><small>White + Black</small>"]
        RELEASE["🚀 Release Engineer<br/><small>Blue + Black</small>"]
        SECURITY["🛡️ Security Auditor<br/><small>Black + White</small>"]
    end

    subgraph Ops_Team["Ops Team"]
        RESEARCH["📊 Research Lead<br/><small>White + Green</small>"]
        DOCS["📝 Docs Lead<br/><small>White</small>"]
    end

    subgraph Customer_Success["Customer Success"]
        VANGUARD["🎯 Vanguard<br/><small>Red + Yellow</small>"]
    end

    CEO --> CTO
    CEO --> CFO
    CTO --> STAFF
    CTO --> VANGUARD
    STAFF --> DEV
    STAFF --> QA
    STAFF --> SECURITY
    QA --> RELEASE
    CTO --> OPS_TEAM_O["Ops"]
    OPS_TEAM_O["Ops Team"] --> RESEARCH
    OPS_TEAM_O["Ops Team"] --> DOCS
```

---

## 2. Hierarquia de Permissões (RBAC)

```mermaid
graph TB
    subgraph Roles
        ADMIN["admin<br/>Administrador"]
        CTO["cto<br/>CTO"]
        STAFF["staff<br/>Staff Engineer"]
        DEV["dev<br/>Dev Agent"]
        QA["qa<br/>QA Lead"]
        RELEASE["release<br/>Release Engineer"]
        SECURITY["security<br/>Security Auditor"]
        RESEARCH["research<br/>Research Lead"]
        DOCS["docs<br/>Docs Lead"]
        VANGUARD["vanguard<br/>Vanguard"]
        GUEST["guest<br/>Guest"]
    end

    ADMIN --> CTO
    CTO --> STAFF
    STAFF --> DEV
    STAFF --> QA
    STAFF --> SECURITY
    QA --> GUEST
    DEV --> GUEST
    SECURITY --> GUEST
    RELEASE --> GUEST
    RESEARCH --> GUEST
    DOCS --> GUEST
    VANGUARD --> GUEST
    CTO --> VANGUARD
    CTO --> RESEARCH
    CTO --> DOCS
```

---

## 3. Tech Stack

```mermaid
graph LR
    subgraph Orchestration["Orquestração"]
        PAPERCLIP["📋 Paperclip<br/><small>Agent coordination</small>"]
    end

    subgraph Runtime["Runtime"]
        HERMES["🏛️ Hermes<br/><small>Agent execution</small>"]
    end

    subgraph Provider["Provider"]
        MINIMAX["🤖 MiniMax M2.7<br/><small>Token Plan Plus</small>"]
    end

    subgraph Visualization["Visualização"]
        CLAW3D["🎮 Claw3D<br/><small>3D office</small>"]
    end

    subgraph Infrastructure["Infraestrutura"]
        HOSTINGER["🖥️ Hostinger VPS<br/><small>KVM4</small>"]
        DOKPLOY["📦 Dokploy<br/><small>host.izzispark.cloud</small>"]
        CLOUDFLARE["☁️ Cloudflare Pages<br/><small>Static sites</small>"]
    end

    subgraph DevOps["DevOps"]
        GITHUB["🐙 GitHub<br/><small>CI/CD, code</small>"]
        CODER["💻 Coder<br/><small>Remote dev</small>"]
    end

    PAPERCLIP --> HERMES
    HERMES --> MINIMAX
    HERMES --> CLAW3D
    HERMES --> DOKPLOY
    DOKPLOY --> HOSTINGER
    DOKPLOY --> CLOUDFLARE
    GITHUB --> DOKPLOY
    GITHUB --> CODER
```

---

## 4. Fluxo de Decisão de Negócio

```mermaid
flowchart TD
    CLIENT["👤 Cliente"] --> VANGUARD

    subgraph Onboarding
        VANGUARD --> TIER{Tier?}
        TIER -->|Free| FREE["✅ Free tier<br/>automático"]
        TIER -->|Discount < 20%| CFO_APPROVE["📋 CFO Approva"]
        TIER -->|Discount > 20%| CEO_APPROVE["👑 CEO Approva"]
    end

    VANGUARD --> FEEDBACK["📬 Feedback"]

    subgraph Feedback_Processing
        FEEDBACK --> TYPE{Tipo?}
        TYPE -->|Tech| TECH["🔧 Tech issue"]
        TECH --> CTO
        TYPE -->|Money| MONEY["💰 Custo"]
        MONEY --> CFO
        TYPE -->|Product| ROADMAP["🗺️ Roadmap"]
    end

    CTO --> ESCALATE{Escala?}
    ESCALATE -->|Alto| CEO_ESC["👑 CEO"]
    ESCALATE -->|Normal| DEV_TEAM

    subgraph Dev_Pipeline
        DEV_TEAM --> STAFF_DESIGN["⚙️ Design"]
        STAFF_DESIGN --> DEV_CODE["💻 Código"]
        DEV_CODE --> QA_TEST["🔍 Testes"]
        QA_TEST --> SEC_AUDIT["🛡️ Audit"]
        SEC_AUDIT --> RELEASE_DEPLOY["🚀 Deploy"]
    end

    CFO --> BUDGET["💵 Budget"]
    CEO_APPROVE --> CFO
    CEO_ESC --> CFO
```

---

## 5. Fluxo de Delegação entre Agentes

```mermaid
sequenceDiagram
    participant C as CEO (Josafá)
    participant N as Neo (CTO)
    participant S as Staff Engineer
    participant D as Pi.dev (Dev)
    participant Q as QA Lead
    participant R as Release Engineer

    C->>N: Decisão estratégica
    Note over N: Blue hat + Black hat<br/>Processo + Cautela

    N->>S: Design task
    Note over S: Yellow hat + Green hat<br/>Benefício + Criatividade

    S->>D: Implementar feature
    Note over D: Green hat + Blue hat<br/>Criatividade + Processo

    D->>Q: Validar código
    Note over Q: White hat + Black hat<br/>Fatos + Cautela

    Q->>R: Aprovar deploy
    Note over R: Blue hat + Black hat<br/>Processo + Cautela

    R->>C: Deploy completo
    Note over C: Red hat + Yellow hat<br/>Intuição + Benefício
```

---

## 6. Fluxo de Dados (Agent → Auth Service)

```mermaid
sequenceDiagram
    participant A as Agente A
    participant AUTH as Auth Service<br/>auth.izzispark.cloud
    participant B as Agente B
    participant DB as Database

    A->>AUTH: POST /auth/signin
    AUTH->>DB: Validar credenciais
    DB-->>AUTH: User found
    AUTH-->>A: Token JWT (7 days)

    A->>AUTH: GET /agents/:id<br/>Authorization: Bearer <token>
    AUTH->>AUTH: Validar token + RBAC
    AUTH-->>A: Agent details

    A->>AUTH: GET /files/:id/link
    AUTH->>AUTH: Verificar role + permissions
    AUTH-->>A: Presigned URL (1h expiry)

    B->>AUTH: Delegate task<br/>Authorization: Bearer <token>
    AUTH->>AUTH: Verificar delegation rights
    Note over AUTH: cto pode delegar<br/>para staff/dev/qa/etc
    AUTH-->>B: Delegation approved
```

---

## 7. Diagrama de Infraestrutura (Deploy)

```mermaid
graph TB
    subgraph Internet
        USER["👤 Usuário"] --> CDN["☁️ Cloudflare Pages<br/>Static content"]
    end

    subgraph VPS["🖥️ Hostinger KVM4"]
        subgraph Docker
            AUTH["🔐 Auth Service<br/>auth.izzispark.cloud<br/>:3001"]
            HERMES["🏛️ Hermes Gateway<br/>:3000"]
            DOKPLOY["📦 Dokploy<br/>Dashboard"]
        end

        subgraph Databases
            HERMES_DB["📊 Hermes DB<br/>state.db"]
            AUTH_DB["📊 Auth DB<br/>SQLite"]
        end
    end

    CDN --> HERMES
    USER --> AUTH
    HERMES --> HERMES_DB
    AUTH --> AUTH_DB

    subgraph External
        MINIMAX_API["🤖 MiniMax API<br/>M2.7 Provider"]
        OBSIDIAN["📓 Obsidian Vault<br/>GitHub sync"]
        GITHUB["🐙 GitHub<br/>Repos, Actions"]
    end

    HERMES --> MINIMAX_API
    HERMES --> OBSIDIAN
    HERMES --> GITHUB
    AUTH --> MINIMAX_API
```

---

## 8. Estados de Gate de Aprovação

```mermaid
stateDiagram-v2
    [*] --> Pending

    state Pending {
        [*] --> Draft
        Draft --> Review: Submit
        Review --> Approved: CEO approve
        Review --> Rejected: Reject
        Rejected --> Draft: Revise
    }

    Approved --> Deployed: Release deploy
    Deployed --> [*]

    state "<b>Deploy Gate</b>" as DeployGate {
        [*] --> Queued
        Queued --> Testing: QA starts
        Testing --> SecurityScan: Pass
        Testing --> Failed: Fail
        SecurityScan --> Approved: No issues
        SecurityScan --> Blocked: Issues found
        Blocked --> Queued: Fix
    }
```

---

## 9. Role Permissions Matrix

```mermaid
graph LR
    subgraph Permissions
        READ["read"]
        WRITE["write"]
        DEPLOY["deploy"]
        AUDIT["audit"]
        DESIGN["design"]
        MANAGE["manage"]
        TEST["test"]
        REPORT["report"]
        FINANCIAL["financial"]
        CUSTOMER["customer"]
    end

    subgraph Role_Matrix
        ADMIN["admin"]
        CTO["cto"]
        STAFF["staff"]
        DEV["dev"]
        QA["qa"]
        RELEASE["release"]
        SECURITY["security"]
        GUEST["guest"]
    end

    ADMIN -->|"*"| READ
    CTO -->|"read, write, deploy, audit, design, manage"| READ
    STAFF -->|"read, write, design"| READ
    DEV -->|"read, write"| READ
    QA -->|"read, test, report"| READ
    RELEASE -->|"read, deploy"| READ
    SECURITY -->|"read, audit, report"| READ
    GUEST -->|"read"| READ
```

---

## 10. Fluxo de Feedback Loop

```mermaid
flowchart LR
    subgraph Collection
        VANGUARD["🎯 Vanguard<br/>Collects feedback"]
    end

    subgraph Processing
        VANGUARD --> ANALYZE{Analyze}
        ANALYZE --> TECH["🔧 Tech issue"]
        ANALYZE --> PRODUCT["🗺️ Product idea"]
        ANALYZE --> COST["💰 Cost concern"]
    end

    subgraph Action
        TECH --> CTO
        PRODUCT --> ROADMAP
        COST --> CFO
    end

    subgraph Resolution
        CTO --> DEV_TEAM
        DEV_TEAM --> IMPLEMENT["✅ Implement"]
        IMPLEMENT --> SHIP["🚀 Ship"]
        SHIP --> NOTIFY["📬 Notify client"]
    end

    ROADMAP --> BACKLOG["📋 Backlog"]
    CFO --> BUDGET["💵 Budget update"]
    NOTIFY --> SATISFIED["😊 Client happy"]
    SATISFIED --> RETENTION["♻️ Retenção"]
```

---

## 11. Agent-to-Agent Communication (Delegation Protocol)

```mermaid
flowchart TD
    subgraph Initiator
        A["Agent A<br/>CTO (Neo)"]
        A --> CHECK{"Pode delegar?"}
        CHECK -->|Yes| CREATE["Criar delegation token"]
        CHECK -->|No| DENY["Access denied"]
    end

    subgraph Token
        CREATE --> PAYLOAD["Payload<br/>sub, role, permissions, exp"]
        PAYLOAD --> ENCODE["Base64 encode"]
        ENCODE --> TOKEN["Delegation token"]
    end

    subgraph Target
        TOKEN --> B["Agent B<br/>Dev (Pi.dev)"]
        B --> VALIDATE["Validar token"]
        VALIDATE --> CHECK_ROLE{"Role permitido?"}
        CHECK_ROLE -->|Yes| EXEC["Executar task"]
        CHECK_ROLE -->|No| REJECT["Rejeitar"]
    end

    subgraph Audit
        EXEC --> LOG["📋 Log acesso"]
        REJECT --> LOG
    end
```

---

## 12. Six Thinking Hats Integration

```mermaid
graph TB
    subgraph Hats
        WHITE["⚪ White<br/>Facts, Data"]
        RED["🔴 Red<br/>Emotion, Intuition"]
        BLACK["⚫ Black<br/>Caution, Risks"]
        YELLOW["🟡 Yellow<br/>Benefits, Optimism"]
        GREEN["🟢 Green<br/>Creativity, Ideas"]
        BLUE["🔵 Blue<br/>Process, Control"]
    end

    subgraph Agents
        CEO["CEO - Josafá<br/>Red + Yellow"]
        CTO["CTO - Neo<br/>Blue + Black"]
        STAFF["Staff Engineer<br/>Yellow + Green"]
        DEV["Dev Agent<br/>Green + Blue"]
        QA["QA Lead<br/>White + Black"]
        SECURITY["Security Auditor<br/>Black + White"]
        VANGUARD["Vanguard<br/>Red + Yellow"]
    end

    CEO --> RED
    CEO --> YELLOW
    CTO --> BLUE
    CTO --> BLACK
    STAFF --> YELLOW
    STAFF --> GREEN
    DEV --> GREEN
    DEV --> BLUE
    QA --> WHITE
    QA --> BLACK
    SECURITY --> BLACK
    SECURITY --> WHITE
    VANGUARD --> RED
    VANGUARD --> YELLOW
```

---

*Documentação gerada em Mai 2026*
*Versão 1.0 - izzi Spark Architecture*