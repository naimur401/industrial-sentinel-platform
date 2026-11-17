-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('PREDICTIVE_MAINTENANCE', 'ANOMALY_DETECTION', 'INTRUSION_DETECTION');

-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('TRAINING', 'STAGED', 'DEPLOYED', 'RETIRED');

-- CreateTable
CREATE TABLE "ml_models" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ModelType" NOT NULL,
    "version" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "description" TEXT,
    "status" "ModelStatus" NOT NULL DEFAULT 'STAGED',
    "metrics_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ml_models_pkey" PRIMARY KEY ("id")
);
