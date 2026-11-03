-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('DETECTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('SECURITY', 'OPERATIONAL', 'INFRASTRUCTURE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "Criticality" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'DETECTED',
    "category" "IncidentCategory" NOT NULL DEFAULT 'OPERATIONAL',
    "assignee_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incidents_facility_id_idx" ON "incidents"("facility_id");

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
