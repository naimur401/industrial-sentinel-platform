import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'Super@12345';
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.updateMany({
    data: { passwordHash: hash }
  });
  console.log('? Password updated successfully to: ' + password);
}

main().catch(console.error).finally(() => prisma.$disconnect());
