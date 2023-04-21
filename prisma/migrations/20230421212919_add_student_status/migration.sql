/*
  Warnings:

  - Added the required column `studentStatusId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentStatusId" TEXT NOT NULL,
ALTER COLUMN "studentStartDate" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "StudentStatus" (
    "studentStatusId" TEXT NOT NULL,
    "studentStatusName" TEXT NOT NULL,
    "studentStatusDesc" TEXT NOT NULL,

    CONSTRAINT "StudentStatus_pkey" PRIMARY KEY ("studentStatusId")
);

-- RenameForeignKey
ALTER TABLE "Student" RENAME CONSTRAINT "Student_studentTypeStudent_fkey" TO "Student_studentTypeId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentStatusId_fkey" FOREIGN KEY ("studentStatusId") REFERENCES "StudentStatus"("studentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;
