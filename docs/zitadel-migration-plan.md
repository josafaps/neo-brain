# izzi Spark — Zitadel Migration Plan

## Overview

Migrating from **Better Auth (MVP)** to **Zitadel** for production-grade multi-tenant authentication with Google OAuth SSO.

**Why Zitadel?**
- Native multi-tenant (workspaces/ organizations)
- Built-in Google OAuth + 30+ providers
- Self-hosted = seus dados, sem custo mensal
- API REST excelente
- Resend/SMTP for transactional emails
- Free unlimited users (self-hosted)

---

## Phase 1: Local Development Setup

### 1.1 Clone Template to Dokploy-Compatible Format

```bash
# Create project structure
mkdir -p izzi-spark/zitadel-compose
cd izzi-spark/zitadel-compose

# docker-compose.yml (from Dokploy template)
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  zitadel:
    restart: always
    image: ghcr.io/zitadel/zitadel:latest
    command: start-from-init --masterkey "${ZITADEL_MASTERKEY}" --tlsMode disabled
    environment:
      # Database
      ZITADEL_DATABASE_POSTGRES_HOST: db
      ZITADEL_DATABASE_POSTGRES_PORT: 5432
      ZITADEL_DATABASE_POSTGRES_DATABASE: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_USERNAME: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_USER_SSL_MODE: disable
      ZITADEL_DATABASE_POSTGRES_ADMIN_USERNAME: postgres
      ZITADEL_DATABASE_POSTGRES_ADMIN_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_ADMIN_SSL_MODE: disable

      # External
      ZITADEL_EXTERNALSECURE: false
      ZITADEL_EXTERNALPORT: 8080
      ZITADEL_EXTERNALDOMAIN: "${EXTERNAL_DOMAIN}"
      ZITADEL_TLS_ENABLED: false

      # SMTP (Resend)
      ZITADEL_NOTIFICATIONS_SMTP_HOST: smtp.resend.com
      ZITADEL_NOTIFICATIONS_SMTP_PORT: 587
      ZITADEL_NOTIFICATIONS_SMTP_USER: resend
      ZITADEL_NOTIFICATIONS_SMTP_PASSWORD: "${RESEND_API_KEY}"
      ZITADEL_NOTIFICATIONS_SMTP_FROM: "izzi Spark <noreply@izzispark.cloud>"

      # Admin User
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME: "${ZITADEL_ADMIN_USER}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD: "${ZITADEL_ADMIN_PASSWORD}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS: "${ZITADEL_ADMIN_EMAIL}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME: "Neo"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME: "CTO"
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
    volumes:
      - zitadel_data:/app/data

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_DB: zitadel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d zitadel -U postgres"]
      interval: 10s
      timeout: 30s
      retries: 5
      start_period: 20s

volumes:
  postgres_data:
  zitadel_data:
EOF

# .env file
cat > .env << 'EOF'
# Domain
EXTERNAL_DOMAIN=auth.izzispark.cloud

# Security
POSTGRES_PASSWORD=generate_secure_password_here
ZITADEL_MASTERKEY=generate_32_char_master_key_here

# Admin Account (for izzi Spark org)
ZITADEL_ADMIN_USER=neo
ZITADEL_ADMIN_EMAIL=neo@izzispark.cloud
ZITADEL_ADMIN_PASSWORD=SecurePassword123!

# Email (Resend - 5k free/month)
RESEND_API_KEY=re_your_resend_api_key

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
EOF
```

### 1.2 Start Locally (Test)

```bash
# Start Zitadel + PostgreSQL
docker-compose up -d

# Watch logs
docker-compose logs -f zitadel

# Access UI at http://localhost:8080
# Default login: neo@izzispark.cloud / SecurePassword123!
```

**Expected:** Zitadel UI loads in ~30 seconds, PostgreSQL auto-migrates schema.

---

## Phase 2: Configure Zitadel via API

### 2.1 Get Admin API Key

```bash
# Get key from Zitadel UI or CLI
ZITADEL_KEY=$(docker exec izzi-spark-zitadel-1 ./zitadel createdomain admin --raw)
echo "Admin Key: $ZITADEL_KEY"
```

### 2.2 Create izzi Spark Organization

```bash
# Via Zitadel REST API
curl -X POST https://localhost:8080/admin/v1/orgs \
  -H "Authorization: Bearer $ZITADEL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "izzi-spark",
    "preferredDomain": "izzispark",
    "orgState": 1
  }'
```

### 2.3 Configure Google OAuth Provider

```bash
# Get zitadel system auth key
curl -X POST https://localhost:8080/oauth/v1/token \
  -d "grant_type=client_credentials" \
  -d "client_id=zitadel-system" \
  -d "client_secret=$(docker exec izzi-spark-zitadel-1 cat /app/data/zitadel-admin-local.yml | grep -A1 secret)" \
  -d "scope=openid profile email"

# Create Google IDP in Zitadel (via UI or API)
# Path: Settings > Identity Providers > Add Google
```

**Manual Steps (UI):**
1. Go to http://localhost:8080/ui/console/settings
2. Navigate to: Identity Providers → Add → Google
3. Enter Client ID and Client Secret from Google Cloud Console
4. Redirect URI: `http://auth.izzispark.cloud:8080/idps/zitadel-generator/callback`

### 2.4 Create Roles for izzi Spark

```bash
# Create roles via API
curl -X POST https://localhost:8080/admin/v1/projects \
  -H "Authorization: Bearer $ZITADEL_KEY" \
  -d '{
    "name": "izzi-spark-project",
    "projectState": 1
  }'

# Create roles: admin, cto, staff, dev, qa, release, security, research, docs, vanguard, guest
```

---

## Phase 3: Integrate with Hermes Agent

### 3.1 Update Auth Service

Replace `auth-service/src/index.ts` with Zitadel client:

```typescript
// New auth service that proxies to Zitadel
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const ZITADEL_URL = process.env.ZITADEL_URL || 'http://localhost:8080';
const SERVICE_KEY = process.env.ZITADEL_SERVICE_KEY;

const app = new Elysia()
  .use(cors())
  
  // Proxy to Zitadel for auth
  .post('/auth/signin', async ({ body }) => {
    const { email, password } = body as any;
    
    // Use Zitadel's OAuth password flow
    const response = await fetch(`${ZITADEL_URL}/oauth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        username: email,
        password: password,
        scope: 'openid profile email',
        client_id: 'izzi-spark-client',
      }),
    });
    
    return response.json();
  })
  
  // Google OAuth redirect
  .get('/auth/google', ({ setRedirect }) => {
    setRedirect(302, `${ZITADEL_URL}/oauth/v2/authorize?client_id=izzi-spark-client&redirect_uri=${ZITADEL_URL}/login/authucceeded&response_type=code&scope=openid profile email&provider=google`);
  })
  
  // User info from Zitadel
  .get('/auth/me', async ({ headers }) => {
    const token = headers.get('Authorization')?.replace('Bearer ', '');
    const response = await fetch(`${ZITADEL_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  })
  
  .listen(3001);
```

### 3.2 Environment Variables

```bash
# hermes/.env
ZITADEL_URL=http://auth.izzispark.cloud:8080
ZITADEL_SERVICE_KEY=your_service_key_from_zitadel
```

---

## Phase 4: Deploy to Production (Dokploy)

### 4.1 Create Dokploy Project

1. Login to https://host.izzispark.cloud
2. Create new project: "zitadel-auth"
3. Upload `docker-compose.yml` file
4. Configure environment variables

### 4.2 DNS Configuration

Add DNS records in Hostinger:

```
# A records
auth.izzispark.cloud     A    YOUR_SERVER_IP

# CNAME (optional)
accounts.izzispark.cloud CNAME auth.izzispark.cloud
```

### 4.3 SSL/TLS

Dokploy auto-configures Let's Encrypt when domain is configured.

---

## Phase 5: Google OAuth Setup (Free)

### 5.1 Google Cloud Console Setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: izzi Spark Auth
   - Authorized redirect URIs:
     ```
     http://auth.izzispark.cloud:8080/login/authucceeded
     ```

3. Copy Client ID and Client Secret

### 5.2 Configure in Zitadel

- UI: Settings → Identity Providers → Add Google
- Or API: POST `/admin/v1/idps`

### 5.3 Testing Flow

```
User clicks "Login with Google"
  → Redirect to Google
  → User grants permission
  → Callback to Zitadel
  → Zitadel creates/updates user
  → Returns JWT token
  → izzi Spark validates token
```

---

## Phase 6: Email Configuration (Resend)

### 6.1 Resend Setup

1. Create account at https://resend.com
2. Add domain: `izzispark.cloud`
3. Verify DNS records (TXT, MX, DKIM)
4. Create API key

### 6.2 Zitadel SMTP Config

```yaml
ZITADEL_NOTIFICATIONS_SMTP_HOST: smtp.resend.com
ZITADEL_NOTIFICATIONS_SMTP_PORT: 587
ZITADEL_NOTIFICATIONS_SMTP_USER: resend
ZITADEL_NOTIFICATIONS_SMTP_PASSWORD: re_your_api_key
ZITADEL_NOTIFICATIONS_SMTP_FROM: "izzi Spark <noreply@izzispark.cloud>"
```

---

## Phase 7: Multi-tenant Setup

### 7.1 Organizations Model

```bash
# izzi Spark (main org)
org_id: 123456789012345678

# Each client/workspace = separate Zitadel org
org_id: client_001
org_id: client_002
```

### 7.2 Workspace API (for auth service)

```typescript
// Create workspace (org in Zitadel)
POST /api/workspaces
{
  name: "Client Company",
  slug: "client-company",
  ownerEmail: "owner@client.com"
}
```

---

## Migration Checklist

- [ ] Local docker-compose up ✅
- [ ] Access Zitadel UI on port 8080
- [ ] Configure admin user (neo@izzispark.cloud)
- [ ] Create izzi-spark organization
- [ ] Configure Google OAuth provider
- [ ] Create izzi-spark roles (admin, cto, dev, etc.)
- [ ] Integrate with Hermes auth service
- [ ] Test login flow with Google
- [ ] Configure Resend for emails
- [ ] Deploy to Dokploy
- [ ] Configure DNS
- [ ] Test production login flow
- [ ] Update docs (architecture diagrams)

---

## Troubleshooting

### Zitadel won't start
```bash
# Check logs
docker-compose logs zitadel

# Reset database
docker-compose down -v
docker-compose up -d
```

### Database connection failed
```bash
# Check PostgreSQL
docker exec -it postgres_data pg_isready -U postgres

# Check connection from zitadel
docker exec izzi-spark-zitadel-1 ping db
```

### Google OAuth not working
```bash
# Verify redirect URI matches exactly
# Should be: http://auth.izzispark.cloud:8080/login/authucceeded

# Check provider config
curl -X GET https://localhost:8080/admin/v1/idps
```

---

## Estimated Time

| Phase | Effort | Time |
|-------|--------|------|
| Local Setup | Easy | 30 min |
| Zitadel Config | Medium | 1-2 hours |
| Hermes Integration | Medium | 2-3 hours |
| Production Deploy | Easy | 1 hour |
| Google OAuth Setup | Easy | 30 min |
| **Total** | - | **4-6 hours** |