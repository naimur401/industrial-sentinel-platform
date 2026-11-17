import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user found.');

  await prisma.accessDecision.deleteMany({});

  const decisions = [
    { resource: 'asset', action: 'read', riskScore: 15, decision: 'ALLOW', reason: 'Low risk - standard access' },
    { resource: 'asset', action: 'delete', riskScore: 85, decision: 'DENY', reason: 'Critical action from untrusted device' },
    { resource: 'incident', action: 'update', riskScore: 45, decision: 'REQUIRE_MFA', reason: 'Moderate risk - MFA required' },
    { resource: 'report', action: 'read', riskScore: 25, decision: 'ALLOW', reason: 'Standard read access' },
    { resource: 'user', action: 'create', riskScore: 70, decision: 'REQUIRE_VERIFICATION', reason: 'Sensitive action from new location' },
    { resource: 'asset', action: 'update', riskScore: 55, decision: 'REQUIRE_MFA', reason: 'Write access requires MFA' },
    { resource: 'report', action: 'read', riskScore: 10, decision: 'ALLOW', reason: 'Known device, known location' },
  ];

  for (const d of decisions) {
    await prisma.accessDecision.create({
      data: {
        userId: user.id,
        resource: d.resource,
        action: d.action,
        riskScore: d.riskScore,
        decision: d.decision,
        reason: d.reason,
      },
    });
  }
  console.log('SUCCESS: 7 Access Decisions created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
