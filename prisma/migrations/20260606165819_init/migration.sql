-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'REVIEWED', 'APPROVED', 'BOOKED', 'DECLINED');

-- CreateEnum
CREATE TYPE "JobStage" AS ENUM ('BOOKED', 'QUESTIONNAIRE_SENT', 'QUESTIONNAIRE_DONE', 'SESSION_COMPLETE', 'GALLERY_SENT', 'PAID', 'COMPLETE');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'HELD', 'PAID', 'REFUNDED', 'WAIVED');

-- CreateTable
CREATE TABLE "SessionType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "bookingFee" INTEGER NOT NULL,
    "imageCount" TEXT NOT NULL,
    "turnaround" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "sessionTypePref" TEXT,
    "preferredDate" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "ownerNotes" TEXT,
    "bookingToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "gdprConsentAt" TIMESTAMP(3),
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "inquiryId" TEXT,
    "sessionTypeId" TEXT NOT NULL,
    "stage" "JobStage" NOT NULL DEFAULT 'BOOKED',
    "sessionDate" TIMESTAMP(3),
    "sessionLocation" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "bookingFee" INTEGER NOT NULL,
    "balanceAmount" INTEGER NOT NULL,
    "bookingFeeStatus" "FeeStatus" NOT NULL DEFAULT 'HELD',
    "balanceStatus" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "stripeBookingIntentId" TEXT,
    "stripeBalanceIntentId" TEXT,
    "sessionToken" TEXT NOT NULL,
    "contractSignedAt" TIMESTAMP(3),
    "modelReleaseGranted" BOOLEAN NOT NULL DEFAULT false,
    "galleryUrl" TEXT,
    "galleryDeliveredAt" TIMESTAMP(3),
    "imageCount" INTEGER,
    "balanceInvoiceSentAt" TIMESTAMP(3),
    "balanceDueAt" TIMESTAMP(3),
    "balancePaidAt" TIMESTAMP(3),
    "reviewRequestSentAt" TIMESTAMP(3),
    "questionnaireSentAt" TIMESTAMP(3),
    "questionnaireReminderSentAt" TIMESTAMP(3),
    "reminder48hSentAt" TIMESTAMP(3),
    "reminder24hSentAt" TIMESTAMP(3),
    "editingEmailSentAt" TIMESTAMP(3),
    "balanceReminderSentAt" TIMESTAMP(3),
    "ownerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "sessionGoal" TEXT,
    "participants" TEXT,
    "locationPref" TEXT,
    "mood" TEXT,
    "outfitPlans" TEXT,
    "moodBoardUrl" TEXT,
    "avoidsNotes" TEXT,
    "imageUsage" TEXT,
    "additionalNotes" TEXT,
    "modelRelease" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "CronLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionType_slug_key" ON "SessionType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_bookingToken_key" ON "Inquiry"("bookingToken");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_inquiryId_key" ON "Job"("inquiryId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_stripeBookingIntentId_key" ON "Job"("stripeBookingIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_stripeBalanceIntentId_key" ON "Job"("stripeBalanceIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_sessionToken_key" ON "Job"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_jobId_key" ON "Questionnaire"("jobId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_sessionTypeId_fkey" FOREIGN KEY ("sessionTypeId") REFERENCES "SessionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
