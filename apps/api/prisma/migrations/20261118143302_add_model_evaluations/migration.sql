-- CreateTable
CREATE TABLE "model_evaluations" (
    "id" UUID NOT NULL,
    "model_id" UUID NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "precision" DOUBLE PRECISION NOT NULL,
    "recall" DOUBLE PRECISION NOT NULL,
    "f1_score" DOUBLE PRECISION NOT NULL,
    "roc_auc" DOUBLE PRECISION NOT NULL,
    "pr_auc" DOUBLE PRECISION NOT NULL,
    "confusion_matrix" JSONB,
    "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_evaluations_pkey" PRIMARY KEY ("id")
);
