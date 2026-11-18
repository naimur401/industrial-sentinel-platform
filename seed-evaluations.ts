import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const models = await prisma.mLModel.findMany();
  if (models.length === 0) return console.log('No models found.');

  await prisma.modelEvaluation.deleteMany({});

  for (const model of models) {
    await prisma.modelEvaluation.create({
      data: {
        modelId: model.id,
        accuracy: 0.85 + Math.random() * 0.10,
        precision: 0.82 + Math.random() * 0.12,
        recall: 0.80 + Math.random() * 0.15,
        f1Score: 0.81 + Math.random() * 0.13,
        rocAuc: 0.88 + Math.random() * 0.08,
        prAuc: 0.75 + Math.random() * 0.15,
        confusionMatrix: { tp: 120, fp: 15, fn: 10, tn: 200 },
      },
    });
  }
  console.log('SUCCESS: Evaluation data created for all models!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
