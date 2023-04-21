/*
  Warnings:

  - You are about to drop the column `studnetLastName` on the `Student` table. All the data in the column will be lost.
  - Added the required column `studentLastName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE IF EXISTS "Student" RENAME COLUMN  "studnetLastName" TO "studentLastName";

ALTER TABLE IF EXISTS "Student" RENAME COLUMN  "studentTypeStudent" TO "studentTypeId";