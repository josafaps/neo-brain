# izzi Spark Auth Service

Better Auth + Bun + Elysia RBAC service for izzi Spark agents.

## Quick Start

```bash
cd auth-service
bun install
bun run dev
```

## DNS Setup

### Subdomain Configuration

Add the following DNS records at your domain provider:

```
# Auth service subdomain
auth.izzispark.cloud    A    172.104.44.122
auth.izzispark.cloud    CAA  0 issue "letsencrypt.org"

# Wildcard for agent subdomains  
agents.izzispark.cloud  A    172.104.44.122

# Files subdomain
files.izzispark.cloud   A    172.104.44.122
```

### Cloudflare (if using Cloudflare)

```bash
# If using Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/:zone_id/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"A","name":"auth.izzispark.cloud","content":"172.104.44.122","proxied":false}'
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production
BASE_URL=https://auth.izzispark.cloud

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database (PlanetScale recommended for production)
DATABASE_URL=mysql://user:pass@host/database?sslaccept=strict

# Agent delegation
AGENT_SECRET_KEY=change-me-for-agent-to-agent-communication
```

## API Endpoints

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/signin` - Login
- `POST /auth/signout` - Logout
- `GET /auth/me` - Current user

### Agents
- `GET /agents/roles` - List all roles (public)
- `GET /agents` - List agents (authenticated)
- `GET /agents/:id` - Agent details (role-based)

### Files
- `GET /files` - List accessible files
- `GET /files/:id` - File metadata
- `GET /files/:id/link` - Generate signed link

## Role Hierarchy

```
admin → cto → staff → dev/qa/release/security/research/docs/vanguard → guest
```

## Agent-to-Agent Delegation

For agents to communicate with each other:

```typescript
// In any agent service
const token = await signAgentToken({
  sub: 'neo',
  role: 'cto',
  permissions: ['read', 'write', 'deploy', 'audit'],
});

// Include in requests
fetch('https://auth.izzispark.cloud/agents', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Deployment

```bash
# Build
bun run build

# Docker
docker build -t izzi-spark-auth .
docker run -p 3000:3000 --env-file .env izzi-spark-auth
```

## Monitoring

- Health: `GET /health`
- Swagger: `GET /swagger`