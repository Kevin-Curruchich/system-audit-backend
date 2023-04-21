/*
  Warnings:

  - Changed the type of `studentStartDate` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "studentStartDate",
ADD COLUMN     "studentStartDate" DATE NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE DATE;
