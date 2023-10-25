import { UpdateStudentInput } from "../interfaces/student";
import prisma from "../utils/db";

import { Student, StudentStatus, StudentType } from "@prisma/client";

export const getStudents = async (
  page: number,
  take: number,
  searchQuery: string,
  studentTypeId: string,
  studentStatusId: string,
  currentYear: any
) => {
  const students = await prisma.student.findMany({
    skip: (page - 1) * take,
    take,
    orderBy: { studentFullName: "asc" },
    where: {
      studentFullName: {
        contains: searchQuery,
        mode: "insensitive",
      },
      studentTypeId: {
        contains: studentTypeId,
      },
      studentStatusId: {
        contains: studentStatusId,
      },
      studentCurrentYear: {
        equals: currentYear,
      },
    },
    include: { StudentType: true, StudentStatus: true },
  });

  const total = await prisma.student.count({
    where: {
      studentFullName: {
        contains: searchQuery,
        mode: "insensitive",
      },
      studentTypeId: {
        contains: studentTypeId,
      },
      studentStatusId: {
        contains: studentStatusId,
      },
      studentCurrentYear: {
        equals: currentYear,
      },
    },
  });

  return { data: students, total };
};

export const getStudentsList = async () => {
  const data = await prisma.student.findMany({
    select: {
      studentId: true,
      studentFullName: true,
      studentTypeId: true,
    },
  });
  const total = data.length;

  return { data, total };
};

export const getStudentsWithAllStudnetData = async () => {
  const data = await prisma.student.findMany({
    include: { StudentType: true, StudentStatus: true },
    orderBy: [{ studentCurrentYear: "asc" }, { studentLastName: "asc" }],
  });

  return data;
};

export const getStudent = async (id: string) => {
  const studentData = await prisma.student.findUnique({
    where: { studentId: id },
    include: { StudentType: true, StudentStatus: true },
  });
  return { ...studentData };
};

export const getStudentByDNI = async (userDNI: string) => {
  const studentData = await prisma.student.findFirst({
    where: { studentDni: userDNI },
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

// export const putStudent = async (
//   id: string,
//   studentData: UpdateStudentInput
// ) => {
//   const student = await prisma.student.update({
//     where: { studentId: id },
//     data: studentData,
//   });

//   return student;
// };
