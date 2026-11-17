-- CreateEnum
CREATE TYPE "DeviceTrust" AS ENUM ('TRUSTED', 'UNKNOWN', 'UNTRUSTED', 'BLOCKED');

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "os" TEXT,
    "browser" TEXT,
    "trust_status" "DeviceTrust" NOT NULL DEFAULT 'UNKNOWN',
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);
