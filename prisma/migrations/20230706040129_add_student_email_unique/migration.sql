/*
  Warnings:

  - A unique constraint covering the columns `[studentEmail]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentEmail_key" ON "Student"("studentEmail");
