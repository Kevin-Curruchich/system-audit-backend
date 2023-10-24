import prisma from "../utils/db";
import { CollectionStudent, Payment, Quartetly } from "@prisma/client";

//get methods
export const getPayments = async (
  page: number,
  take: number,
  searchQuery: string,
  currentYear: any
) => {
  const payments = await prisma.payment.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      collectionStudent: {
        select: {
          collectionStudentId: true,
          collectionStudentAmountOwed: false,
          collectionStudentAmountPaid: false,
          collection: {
            select: {
              collectionId: true,
              collectionName: true,
            },
          },
          Quartetly: {
            select: {
              quartetlyId: true,
              quartetlyName: true,
            },
          },
        },
      },
      student: {
        select: {
          studentId: true,
          studentFullName: true,
        },
      },
    },
    where: {
      student: {
        studentFullName: {
          contains: searchQuery,
          mode: "insensitive",
        },
        studentCurrentYear: {
          equals: currentYear,
        },
      },
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  const paymentsByStudentGroupedByStudent = payments.reduce((acc, payment) => {
    const { studentId } = payment.student;
    if (!acc[studentId]) {
      acc[studentId] = {
        studentId,
        studentFullName: payment.student.studentFullName,
        children: [],
      };
    }

    const paymentData = {
      paymentId: payment.paymentId,
      paymentDate: payment.paymentDate,
      paymentAmount: payment.paymentAmount,
      Quartetly: payment.collectionStudent.Quartetly,
      collectionStudent: payment.collectionStudent,
    };

    acc[studentId].children.push(paymentData);

    return acc;
  }, {} as Record<string, any>);

  const paymentsByStudent = Object.values(paymentsByStudentGroupedByStudent);

  const total = await prisma.payment.count({
    where: {
      student: {
        studentFullName: {
          contains: searchQuery,
          mode: "insensitive",
        },
        studentCurrentYear: {
          equals: currentYear,
        },
      },
    },
  });

  return { data: paymentsByStudent, total };
};

export const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { paymentId: id },
    include: {
      collectionStudent: {
        select: {
          collection: {
            select: {
              collectionName: true,
            },
          },
        },
      },
      student: {
        select: {
          studentId: true,
          studentFullName: true,
          studentEmail: true,
        },
      },
    },
  });
  return payment;
};

//post collections
export const postPayment = async (paymentData: Payment) => {
  const collToUpdate: Awaited<Promise<CollectionStudent>> | null =
    await prisma.collectionStudent.findUnique({
      where: { collectionStudentId: paymentData.collectionStudentId },
    });

  if (!collToUpdate) throw new Error("Collection not found");

  const {
    collectionStudentAmountOwed: oldAmountOwed,
    collectionStudentAmountPaid: oldAmountPaid,
  } = collToUpdate;

  const oldAmountFixed = parseFloat(oldAmountOwed.toFixed(2));

  if (oldAmountFixed < paymentData.paymentAmount)
    throw new Error("Payment amount exceeds amount owed");

  const updateCollection = prisma.collectionStudent.update({
    where: { collectionStudentId: paymentData.collectionStudentId },
    data: {
      collectionStudentAmountOwed: oldAmountOwed - paymentData.paymentAmount,
      collectionStudentAmountPaid: oldAmountPaid + paymentData.paymentAmount,
    },
  });

  const payment = prisma.payment.create({ data: paymentData });

  return prisma.$transaction([updateCollection, payment]);
};
