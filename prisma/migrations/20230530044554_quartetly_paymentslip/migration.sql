-- AlterTable
ALTER TABLE "CollectionStudent" ADD COLUMN     "quartetlyQuartetlyId" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentSlip" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentAddress" TEXT,
ADD COLUMN     "studentBirthDate" DATE,
ADD COLUMN     "studentCity" TEXT,
ADD COLUMN     "studentCountry" TEXT,
ADD COLUMN     "studentCurrentYear" INTEGER,
ADD COLUMN     "studentProvince" TEXT;

-- CreateTable
CREATE TABLE "Quartetly" (
    "quartetlyId" TEXT NOT NULL,
    "quartetlyName" TEXT NOT NULL,
    "quartetlyStart" DATE NOT NULL,
    "quartetlyEnd" DATE NOT NULL,

    CONSTRAINT "Quartetly_pkey" PRIMARY KEY ("quartetlyId")
);

-- AddForeignKey
ALTER TABLE "CollectionStudent" ADD CONSTRAINT "CollectionStudent_quartetlyQuartetlyId_fkey" FOREIGN KEY ("quartetlyQuartetlyId") REFERENCES "Quartetly"("quartetlyId") ON DELETE SET NULL ON UPDATE CASCADE;
