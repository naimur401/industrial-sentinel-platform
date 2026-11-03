-- CreateTable
CREATE TABLE "predictions" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "remaining_useful_life" DOUBLE PRECISION NOT NULL,
    "failure_probability" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "recommendation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "predictions_asset_id_idx" ON "predictions"("asset_id");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
