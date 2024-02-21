import { Quartetly } from "@prisma/client";
import prisma from "../utils/db";

export const getTotalStudents = async () => {
  const totalStudents = await prisma.student.count();
  return totalStudents;
};

//get total students by year
export const getTotalStudentsByYear = async (year: number) => {
  const totalStudents = await prisma.student.count({
    where: {
      studentCurrentYear: year,
    },
  });
  return totalStudents;
};

//get total payments of paymentAmount from last month
export const getTotalPaymentsPrevMonth = async (prevMonth: number) => {
  const totalPayments = await prisma.payment.aggregate({
    _sum: {
      paymentAmount: true,
    },
    where: {
      paymentDate: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - prevMonth)),
      },
    },
  });
  return totalPayments;
};

//get total collectionStudentAmountOwed from last month
export const getTotalOwedPrevMonth = async (prevMonth: number) => {
  const totalOwed = await prisma.collectionStudent.aggregate({
    _sum: {
      collectionStudentAmountOwed: true,
    },
    where: {
      collectionStudentDate: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - prevMonth)),
      },
    },
  });
  return totalOwed;
};

//get the five students with the highest amount owed, grouped by studentId and in descending order, and include the studentName
export const getHighestOwedStudents = async () => {
  const highestOwed = await prisma.collectionStudent.groupBy({
    by: ["studentId"],
    _sum: {
      collectionStudentAmountOwed: true,
    },
    orderBy: {
      _sum: {
        collectionStudentAmountOwed: "desc",
      },
    },
    take: 5,
  });
  return highestOwed;
};
