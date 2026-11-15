-- CreateTable
CREATE TABLE "access_policies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "conditions" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_decisions" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_decisions_pkey" PRIMARY KEY ("id")
);
