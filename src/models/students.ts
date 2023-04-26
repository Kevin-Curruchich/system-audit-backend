import prisma from "../utils/db";

import { Student, StudentStatus, StudentType } from "@prisma/client";

export const getStudents = async (page: number, take: number) => {
  const total = await prisma.student.count();
  const students = await prisma.student.findMany({
    skip: (page - 1) * take,
    take,
    include: { StudentType: true, StudentStatus: true },
  });
  return { data: students, total };
};

export const getStudent = async (id: string) => {
  const studentData = await prisma.student.findUnique({
    where: { studentId: id },
    include: { StudentType: true, StudentStatus: true },
  });
  return { ...studentData };
};

export const getStudentTypes = async () => {
  const studentTypes = await prisma.studentType.findMany();
  return studentTypes;
};

export const postStudent = async (studentData: Student) => {
  const student = await prisma.student.create({ data: studentData });
  return student;
};

export const postStudentStatus = async (statusData: StudentStatus) => {
  const student = await prisma.studentStatus.create({ data: statusData });
  return student;
};

export const postStudentTypes = async (studentTypeData: StudentType) => {
  const studentType = await prisma.studentType.create({
    data: studentTypeData,
  });

  return studentType;
};
