import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.mLModel.deleteMany({});

  const models = [
    { name: 'RUL Predictor', type: 'PREDICTIVE_MAINTENANCE', version: 'v1.2', algorithm: 'XGBoost', status: 'DEPLOYED', description: 'Predicts Remaining Useful Life of industrial assets using sensor data.', metricsJson: { mae: 12.5, rmse: 18.3 } },
    { name: 'Anomaly Detector', type: 'ANOMALY_DETECTION', version: 'v1.0', algorithm: 'Isolation Forest', status: 'DEPLOYED', description: 'Detects abnormal sensor behavior in real-time.', metricsJson: { precision: 0.92, recall: 0.88, f1: 0.90 } },
    { name: 'Intrusion Classifier', type: 'INTRUSION_DETECTION', version: 'v2.1', algorithm: 'Random Forest', status: 'STAGED', description: 'Classifies network threats from IDS alerts.', metricsJson: { precision: 0.95, recall: 0.91, f1: 0.93 } },
    { name: 'RUL Predictor (LSTM)', type: 'PREDICTIVE_MAINTENANCE', version: 'v0.9', algorithm: 'LSTM', status: 'TRAINING', description: 'Experimental LSTM-based RUL predictor.', metricsJson: {} },
  ];

  for (const m of models) {
    await prisma.mLModel.create({
      data: {
        name: m.name,
        type: m.type as any,
        version: m.version,
        algorithm: m.algorithm,
        description: m.description,
        status: m.status as any,
        metricsJson: m.metricsJson,
      },
    });
  }
  console.log('SUCCESS: 4 ML Models registered!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
