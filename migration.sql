-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Bill" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "merchant" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "cadence" TEXT NOT NULL,
    "intervalMonths" INTEGER NOT NULL,
    "nextDueAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReminderSettings" (
    "userId" UUID NOT NULL,
    "offsets" INTEGER[],
    "digestDow" INTEGER NOT NULL,

    CONSTRAINT "ReminderSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "Bill_userId_idx" ON "public"."Bill"("userId");

