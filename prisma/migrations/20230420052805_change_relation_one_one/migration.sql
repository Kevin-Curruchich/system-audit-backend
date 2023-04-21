/*
  Warnings:

  - You are about to drop the column `studentTypeStudent` on the `StudentType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentTypeStudent]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentTypeStudent` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentType" DROP CONSTRAINT "StudentType_studentTypeStudent_fkey";

-- DropIndex
DROP INDEX "StudentType_studentTypeStudent_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentTypeStudent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudentType" DROP COLUMN "studentTypeStudent";

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentTypeStudent_key" ON "Student"("studentTypeStudent");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentTypeStudent_fkey" FOREIGN KEY ("studentTypeStudent") REFERENCES "StudentType"("studentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
