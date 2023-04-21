-- DropForeignKey
ALTER TABLE "StudentType" DROP CONSTRAINT "StudentType_studentTypeStudent_fkey";

-- AlterTable
ALTER TABLE "StudentType" ALTER COLUMN "studentTypeStudent" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentType" ADD CONSTRAINT "StudentType_studentTypeStudent_fkey" FOREIGN KEY ("studentTypeStudent") REFERENCES "Student"("studentId") ON DELETE SET NULL ON UPDATE CASCADE;
