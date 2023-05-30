-- AlterTable
ALTER TABLE "Quartetly" ADD COLUMN     "quartetlyStatusId" TEXT;

-- CreateTable
CREATE TABLE "QuartetlyStatus" (
    "quartetlyStatusId" TEXT NOT NULL,
    "quartetlyStatusName" TEXT NOT NULL,
    "quartetlyStatusDesc" TEXT NOT NULL,

    CONSTRAINT "QuartetlyStatus_pkey" PRIMARY KEY ("quartetlyStatusId")
);

-- AddForeignKey
ALTER TABLE "Quartetly" ADD CONSTRAINT "Quartetly_quartetlyStatusId_fkey" FOREIGN KEY ("quartetlyStatusId") REFERENCES "QuartetlyStatus"("quartetlyStatusId") ON DELETE SET NULL ON UPDATE CASCADE;
