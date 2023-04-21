/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "Student" (
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studnetLastName" TEXT NOT NULL,
    "studentDni" TEXT NOT NULL,
    "studentPhone" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentStartDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "StudentType" (
    "studentTypeId" TEXT NOT NULL,
    "studentTypeName" TEXT NOT NULL,
    "studentTypeDesc" TEXT NOT NULL,
    "studentTypeStudent" TEXT NOT NULL,

    CONSTRAINT "StudentType_pkey" PRIMARY KEY ("studentTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentType_studentTypeStudent_key" ON "StudentType"("studentTypeStudent");

-- AddForeignKey
ALTER TABLE "StudentType" ADD CONSTRAINT "StudentType_studentTypeStudent_fkey" FOREIGN KEY ("studentTypeStudent") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
