import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const threats = [
    { sourceIp: '192.168.1.105', destinationIp: '10.0.0.5', eventType: 'SQL Injection Attempt', severity: 'CRITICAL', status: 'NEW', description: 'Malicious SQL query detected in HTTP request.' },
    { sourceIp: '203.0.113.42', destinationIp: '10.0.0.10', eventType: 'Port Scan', severity: 'HIGH', status: 'INVESTIGATING', description: 'Multiple port scans detected from external IP.' },
    { sourceIp: '10.0.0.22', destinationIp: '10.0.0.5', eventType: 'Brute Force Login', severity: 'HIGH', status: 'INVESTIGATING', description: 'Multiple failed login attempts for admin account.' },
    { sourceIp: '198.51.100.7', destinationIp: '10.0.0.15', eventType: 'Malware Traffic', severity: 'CRITICAL', status: 'NEW', description: 'Suspicious outbound traffic to known C2 server.' },
    { sourceIp: '10.0.0.35', destinationIp: '10.0.0.8', eventType: 'Unauthorized Access', severity: 'MEDIUM', status: 'RESOLVED', description: 'User accessed restricted resource outside role.' },
    { sourceIp: '172.16.0.4', destinationIp: '10.0.0.20', eventType: 'DDoS Attempt', severity: 'LOW', status: 'FALSE_POSITIVE', description: 'High traffic but legitimate load test.' },
  ];

  for (const threat of threats) {
    await prisma.threatEvent.create({
      data: {
        sourceIp: threat.sourceIp,
        destinationIp: threat.destinationIp,
        eventType: threat.eventType,
        severity: threat.severity as any,
        status: threat.status as any,
        description: threat.description,
      },
    });
  }
  console.log('SUCCESS: 6 Demo Threats created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
