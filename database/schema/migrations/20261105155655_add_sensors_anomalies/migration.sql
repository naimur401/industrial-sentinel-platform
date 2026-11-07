-- CreateTable
CREATE TABLE "sensors" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "sensor_type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomalies" (
    "id" UUID NOT NULL,
    "sensor_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "severity" "Criticality" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sensors_asset_id_idx" ON "sensors"("asset_id");

-- CreateIndex
CREATE INDEX "anomalies_sensor_id_idx" ON "anomalies"("sensor_id");

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
