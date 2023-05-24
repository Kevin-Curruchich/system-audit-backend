import prisma from "../utils/db";
import { CollectionStudent, Payment } from "@prisma/client";

//get methods
export const getPayments = async (page: number, take: number) => {
  const total = await prisma.payment.count();
  const payments = await prisma.payment.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      collectionStudent: {
        select: {
          collectionStudentId: true,
          collectionStudentAmountOwed: true,
          collectionStudentAmountPaid: true,
          collectionDescription: true,
        },
      },
      student: {
        select: {
          studentId: true,
          studentName: true,
          studentLastName: true,
        },
      },
    },
  });
  return { data: payments, total };
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

  if (oldAmountOwed < paymentData.paymentAmount)
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
