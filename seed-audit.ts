import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function computeHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user found.');

  await prisma.auditLog.deleteMany({});

  const actions = [
    { action: 'LOGIN', resource: 'auth', details: 'User logged in successfully' },
    { action: 'CREATE', resource: 'asset', details: 'Created new asset PUMP-101' },
    { action: 'UPDATE', resource: 'incident', details: 'Changed status to RESOLVED' },
    { action: 'DELETE', resource: 'user', details: 'Deactivated user account' },
    { action: 'VIEW', resource: 'report', details: 'Downloaded asset health report' },
  ];

  let previousHash = 'GENESIS';

  for (const a of actions) {
    const dataToHash = previousHash + a.action + a.resource + a.details;
    const entryHash = computeHash(dataToHash);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: a.action,
        resource: a.resource,
        details: a.details,
        previousHash: previousHash,
        entryHash: entryHash,
      },
    });

    previousHash = entryHash;
  }
  console.log('SUCCESS: 5 Audit Logs created with hash chain!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
