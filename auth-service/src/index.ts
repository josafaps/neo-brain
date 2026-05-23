// izzi Spark Auth Service - MVP
// Better Auth + Bun + Elysia with RBAC

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';

// Types
type Role = 'admin' | 'cto' | 'staff' | 'dev' | 'qa' | 'release' | 'security' | 'research' | 'docs' | 'vanguard' | 'guest';

const ROLES: Record<Role, { name: string; permissions: string[]; team: string }> = {
  admin: { name: 'Administrator', permissions: ['*'], team: 'leadership' },
  cto: { name: 'CTO', permissions: ['read', 'write', 'deploy', 'audit', 'design', 'manage'], team: 'leadership' },
  cfo: { name: 'CFO Agent', permissions: ['read', 'write', 'financial', 'approve'], team: 'leadership' },
  staff: { name: 'Staff Engineer', permissions: ['read', 'write', 'design'], team: 'dev' },
  dev: { name: 'Dev Agent (Pi.dev)', permissions: ['read', 'write'], team: 'dev' },
  qa: { name: 'QA Lead', permissions: ['read', 'test', 'report'], team: 'dev' },
  release: { name: 'Release Engineer', permissions: ['read', 'deploy'], team: 'dev' },
  security: { name: 'Security Auditor', permissions: ['read', 'audit', 'report'], team: 'dev' },
  research: { name: 'Research Lead', permissions: ['read', 'research'], team: 'ops' },
  docs: { name: 'Docs Lead', permissions: ['read', 'write'], team: 'ops' },
  vanguard: { name: 'Vanguard', permissions: ['read', 'write', 'customer'], team: 'customer-success' },
  guest: { name: 'Guest', permissions: ['read'], team: 'external' },
};

// In-memory user store
const users = new Map<string, { id: string; email: string; name: string; password: string; role: Role }>();
users.set('josafa@izzispark.cloud', { id: 'ceo', email: 'josafa@izzispark.cloud', name: 'Josafá', password: 'demo123', role: 'admin' });
users.set('neo@izzispark.cloud', { id: 'neo', email: 'neo@izzispark.cloud', name: 'Neo', password: 'demo123', role: 'cto' });

// Token helpers
function createToken(user: { id: string; email: string; name: string; role: Role }): string {
  return Buffer.from(JSON.stringify({
    sub: user.id, name: user.name, email: user.email, role: user.role,
    iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString('base64');
}

function validateToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload.exp < Date.now() ? { valid: false, error: 'Token expired' } : { valid: true, payload };
  } catch { return { valid: false, error: 'Invalid token' }; }
}

function getRoleFromRequest(request: Request): Role {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
  if (!token) return 'guest';
  const result = validateToken(token);
  return result.valid ? result.payload.role : 'guest';
}

// File store
const fileStore = new Map([
  ['org-chart', { id: 'org-chart', name: 'Org Chart', url: 'https://auth.izzispark.cloud/files/org-chart.png', role: 'guest' as Role }],
]);

// App - use port 3001 to avoid conflict with Hermes gateway
const app = new Elysia()
  .use(cors({ origin: ['https://izzispark.cloud', 'https://auth.izzispark.cloud', 'http://localhost:3001'], credentials: true }))
  .use(cookie())
  .use(swagger({ documentation: { info: { title: 'izzi Spark Auth API', version: '1.0.0' } } }))
  .get('/health', () => ({ status: 'ok', service: 'izzi-spark-auth', timestamp: new Date().toISOString() }))
  .get('/roles', () => ({ roles: Object.entries(ROLES).map(([id, v]) => ({ id, ...v })) }))
  // Auth
  .post('/auth/signup', ({ body, set }) => {
    const { email, password, name } = body as any;
    if (!email || !password) { set.status = 400; return { error: 'Email and password required' }; }
    if (users.has(email)) { set.status = 400; return { error: 'User exists' }; }
    users.set(email, { id: email.split('@')[0], email, name: name || email, password, role: 'guest' });
    const user = users.get(email)!;
    return { status: 'created', token: createToken(user), user: { email, name: user.name, role: user.role } };
  })
  .post('/auth/signin', ({ body, set, cookie: { authToken } }) => {
    const { email, password } = body as any;
    const user = users.get(email);
    if (!user || user.password !== password) { set.status = 401; return { error: 'Invalid credentials' }; }
    const token = createToken(user);
    authToken.set({ value: token, httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });
    return { status: 'authenticated', token, user: { email, name: user.name, role: user.role } };
  })
  .post('/auth/signout', ({ cookie: { authToken } }) => { authToken.remove(); return { status: 'signed_out' }; })
  .get('/auth/me', ({ request, set }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
    if (!token) { set.status = 401; return { error: 'Unauthorized' }; }
    const result = validateToken(token);
    if (!result.valid) { set.status = 401; return { error: result.error }; }
    return { user: result.payload };
  })
  // Agents
  .get('/agents', ({ request }) => ({ 
    agents: [
      { id: 'ceo', name: 'Josafá', role: 'ceo', team: 'leadership', hats: ['red', 'yellow'] },
      { id: 'neo', name: 'Neo', role: 'cto', team: 'leadership', hats: ['blue', 'black'] },
      { id: 'cfo', name: 'CFO Agent', role: 'cfo', team: 'leadership', hats: ['white', 'black'] },
      { id: 'staff', name: 'Staff Engineer', role: 'staff', team: 'dev', hats: ['yellow', 'green'] },
      { id: 'dev', name: 'Pi.dev', role: 'dev', team: 'dev', hats: ['green', 'blue'] },
      { id: 'qa', name: 'QA Lead', role: 'qa', team: 'dev', hats: ['white', 'black'] },
      { id: 'release', name: 'Release Engineer', role: 'release', team: 'dev', hats: ['blue', 'black'] },
      { id: 'security', name: 'Security Auditor', role: 'security', team: 'dev', hats: ['black', 'white'] },
      { id: 'research', name: 'Research Lead', role: 'research', team: 'ops', hats: ['white', 'green'] },
      { id: 'docs', name: 'Docs Lead', role: 'docs', team: 'ops', hats: ['white'] },
      { id: 'vanguard', name: 'Vanguard', role: 'vanguard', team: 'customer-success', hats: ['red', 'yellow'] },
    ],
    yourRole: getRoleFromRequest(request),
  }))
  .get('/agents/:id', ({ params }) => {
    const agents: Record<string, any> = {
      ceo: { id: 'ceo', name: 'Josafá', role: 'ceo', team: 'leadership', email: 'josafa@izzispark.cloud', hats: ['red', 'yellow'] },
      neo: { id: 'neo', name: 'Neo', role: 'cto', team: 'leadership', email: 'neo@izzispark.cloud', hats: ['blue', 'black'] },
    };
    return { agent: agents[params.id] || { error: 'Agent not found' } };
  })
  // Files
  .get('/files', ({ request }) => ({ files: Array.from(fileStore.values()), yourRole: getRoleFromRequest(request) }))
  .get('/files/:id', ({ params }) => ({ file: fileStore.get(params.id) || { error: 'File not found' } }))
  .get('/files/:id/link', ({ params, request }) => {
    const file = fileStore.get(params.id);
    if (!file) return { error: 'File not found' };
    const role = getRoleFromRequest(request);
    const token = Buffer.from(JSON.stringify({ role, exp: Date.now() + 3600000 })).toString('base64');
    return { url: `https://auth.izzispark.cloud:3001/files/${params.id}?token=${token}`, expiresIn: 3600 };
  })
  .listen(3001);

console.log('🚀 izzi Spark Auth running on http://localhost:3001');
console.log('📚 Swagger: http://localhost:3001/swagger');
console.log('🔐 Roles: http://localhost:3001/roles');

export type App = typeof app;