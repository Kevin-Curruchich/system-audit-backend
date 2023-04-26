-- CreateTable
CREATE TABLE "Student" (
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentLastName" TEXT NOT NULL,
    "studentDni" TEXT NOT NULL,
    "studentPhone" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentStartDate" DATE NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentTypeId" TEXT NOT NULL,
    "studentStatusId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "StudentType" (
    "studentTypeId" TEXT NOT NULL,
    "studentTypeName" TEXT NOT NULL,
    "studentTypeDesc" TEXT NOT NULL,

    CONSTRAINT "StudentType_pkey" PRIMARY KEY ("studentTypeId")
);

-- CreateTable
CREATE TABLE "StudentStatus" (
    "studentStatusId" TEXT NOT NULL,
    "studentStatusName" TEXT NOT NULL,
    "studentStatusDesc" TEXT NOT NULL,

    CONSTRAINT "StudentStatus_pkey" PRIMARY KEY ("studentStatusId")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentTypeId_fkey" FOREIGN KEY ("studentTypeId") REFERENCES "StudentType"("studentTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentStatusId_fkey" FOREIGN KEY ("studentStatusId") REFERENCES "StudentStatus"("studentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;
