/*
  Warnings:

  - Added the required column `studentFullName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentFullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CollectionType" (
    "collectionTypeId" TEXT NOT NULL,
    "collectionTypeName" TEXT NOT NULL,
    "collectionTypeDesc" TEXT NOT NULL,

    CONSTRAINT "CollectionType_pkey" PRIMARY KEY ("collectionTypeId")
);

-- CreateTable
CREATE TABLE "Collection" (
    "collectionId" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "collectionDesc" TEXT NOT NULL,
    "collectionTypeId" TEXT NOT NULL,
    "collectionBaseAmount" DOUBLE PRECISION NOT NULL,
    "collectionStudentApply" JSONB[],

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("collectionId")
);

-- CreateTable
CREATE TABLE "CollectionStudent" (
    "collectionStudentId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "collectionStudentAmountOwed" DOUBLE PRECISION NOT NULL,
    "collectionStudentAmountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collectionStudentDate" DATE NOT NULL,
    "collectionStudentUpdateDate" DATE NOT NULL,
    "collectionDescription" TEXT NOT NULL,

    CONSTRAINT "CollectionStudent_pkey" PRIMARY KEY ("collectionStudentId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "collectionStudentId" TEXT NOT NULL,
    "paymentDate" DATE NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "paymentDescription" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_collectionTypeId_fkey" FOREIGN KEY ("collectionTypeId") REFERENCES "CollectionType"("collectionTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionStudent" ADD CONSTRAINT "CollectionStudent_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("collectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionStudent" ADD CONSTRAINT "CollectionStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_collectionStudentId_fkey" FOREIGN KEY ("collectionStudentId") REFERENCES "CollectionStudent"("collectionStudentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
