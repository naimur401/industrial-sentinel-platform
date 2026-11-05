-- CreateEnum
CREATE TYPE "ThreatSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ThreatStatus" AS ENUM ('NEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateTable
CREATE TABLE "threat_events" (
    "id" UUID NOT NULL,
    "source_ip" TEXT NOT NULL,
    "destination_ip" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "severity" "ThreatSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "ThreatStatus" NOT NULL DEFAULT 'NEW',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "threat_events_pkey" PRIMARY KEY ("id")
);
