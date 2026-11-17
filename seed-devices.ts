import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user found.');

  await prisma.device.deleteMany({});

  const devices = [
    { name: 'Farhan MacBook Pro', os: 'macOS 14.2', browser: 'Chrome 120', trustStatus: 'TRUSTED', fingerprint: 'fp_mac_001_abc123' },
    { name: 'Office Windows PC', os: 'Windows 11', browser: 'Edge 120', trustStatus: 'TRUSTED', fingerprint: 'fp_win_001_def456' },
    { name: 'iPhone 15 Pro', os: 'iOS 17.2', browser: 'Safari', trustStatus: 'UNKNOWN', fingerprint: 'fp_iphone_001_ghi789' },
    { name: 'Old Android Tablet', os: 'Android 11', browser: 'Chrome', trustStatus: 'UNTRUSTED', fingerprint: 'fp_android_001_jkl012' },
    { name: 'Unknown Linux Server', os: 'Ubuntu 22.04', browser: 'curl', trustStatus: 'BLOCKED', fingerprint: 'fp_linux_001_mno345' },
  ];

  for (const d of devices) {
    await prisma.device.create({
      data: {
        userId: user.id,
        deviceFingerprint: d.fingerprint,
        name: d.name,
        os: d.os,
        browser: d.browser,
        trustStatus: d.trustStatus as any,
      },
    });
  }
  console.log('SUCCESS: 5 Devices created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
