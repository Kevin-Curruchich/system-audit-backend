import prisma from "../utils/db";

import { Student, StudentType } from "@prisma/client";

export const getStudentTypes = async () => {
  const studentTypes = await prisma.studentType.findMany();
  return studentTypes;
};

export const getStudents = async () => {
  const studentTypes = await prisma.student.findMany();
  return studentTypes;
};

export const postStudent = async (studentData: Student) => {
  const student = await prisma.student.create({ data: studentData });
  return student;
};

export const postStudentTypes = async (studentTypeData: StudentType) => {
  const studentType = await prisma.studentType.create({
    data: studentTypeData,
  });

  console.log({ studentType });

  return studentType;
};
