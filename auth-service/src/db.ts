// izzi Spark Auth Service
// Simplified MVP - in-memory store for now, ready for DB upgrade

export type Role = 'admin' | 'cto' | 'staff' | 'dev' | 'qa' | 'release' | 'security' | 'research' | 'docs' | 'vanguard' | 'guest';

export const ROLES: Record<Role, { name: string; permissions: string[]; team: string }> = {
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

// Role hierarchy for permission inheritance
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  admin: ['cto', 'staff', 'dev', 'qa', 'release', 'security', 'research', 'docs', 'vanguard', 'guest'],
  cto: ['staff', 'dev', 'qa', 'release', 'security', 'research', 'docs', 'vanguard', 'guest'],
  cfo: ['guest'],
  staff: ['dev', 'qa', 'guest'],
  dev: ['guest'],
  qa: ['guest'],
  release: ['guest'],
  security: ['guest'],
  research: ['guest'],
  docs: ['guest'],
  vanguard: ['guest'],
  guest: [],
};

export function hasPermission(role: Role, action: string): boolean {
  const perms = ROLES[role]?.permissions || [];
  return perms.includes('*') || perms.includes(action);
}

// In-memory user store (MVP)
export const users = new Map<string, { id: string; email: string; name: string; password: string; role: Role }>();

// Initialize with CEO
users.set('josafa@izzispark.cloud', {
  id: 'ceo',
  email: 'josafa@izzispark.cloud',
  name: 'Josafá',
  password: 'demo123', // In production, use bcrypt
  role: 'admin',
});

users.set('neo@izzispark.cloud', {
  id: 'neo',
  email: 'neo@izzispark.cloud',
  name: 'Neo',
  password: 'demo123',
  role: 'cto',
});

// Create token for user
export function createToken(user: { id: string; email: string; name: string; role: Role }): string {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Validate token
export function validateToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

console.log('📊 izzi Spark Auth DB initialized');
console.log(`   Users: ${users.size}`);
console.log(`   Roles: ${Object.keys(ROLES).length}`);