import { postPayment } from "../models/payments";
import { Payment, PrismaClient } from "@prisma/client";
import prisma from "../utils/db";

describe("postPayment", () => {
  it("should throw an error if the collection student is not found", async () => {
    // Arrange
    const paymentData: Payment = {
      paymentId: "abc123",
      paymentAmount: 100,
      collectionStudentId: "invalidId",
      paymentDate: new Date(),
      paymentDescription: "test payment",
      paymentSlip: "test payment",
      studentId: "user123",
    };

    // Act & Assert
    await expect(postPayment(paymentData)).rejects.toThrow(
      "Collection not found"
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

// it("should create a new payment and update the collection student amount owed and amount paid", async () => {
//   // Arrange
//   const paymentData: Payment = {
//     paymentId: "abc123",
//     paymentAmount: 100,
//     collectionStudentId: "def456",
//     paymentDate: new Date(),
//     paymentDescription: "test payment",
//     paymentSlip: "test payment",
//     studentId: "user123",
//   };

//   // Act
//   const transaction = await postPayment(paymentData);

//   // Assert
//   expect(transaction).toHaveLength(2);
//   expect(transaction[0]).toHaveProperty("collectionStudentAmountOwed");
//   expect(transaction[0]).toHaveProperty("collectionStudentAmountPaid");
//   expect(transaction[1]).toHaveProperty("paymentId", paymentData.paymentId);
//   expect(transaction[1]).toHaveProperty(
//     "collectionStudentId",
//     paymentData.collectionStudentId
//   );
//   expect(transaction[1]).toHaveProperty(
//     "paymentAmount",
//     paymentData.paymentAmount
//   );

//   const updatedColl = await prisma.collectionStudent.findUnique({
//     where: { collectionStudentId: paymentData.collectionStudentId },
//   });

//   expect(updatedColl).toHaveProperty("collectionStudentAmountOwed", 0);
//   expect(updatedColl).toHaveProperty(
//     "collectionStudentAmountPaid",
//     paymentData.paymentAmount
//   );
// });

// it("should throw an error if the payment amount exceeds the amount owed", async () => {
//   // Arrange
//   const paymentData: Payment = {
//     paymentId: "abc123",
//     paymentAmount: 1000,
//     collectionStudentId: "def456",
//     paymentDate: new Date(),
//     paymentDescription: "test payment",
//     paymentSlip: "test payment",
//     studentId: "user123",
//   };

//   // Act & Assert
//   await expect(postPayment(paymentData)).rejects.toThrow(
//     "Payment amount exceeds amount owed"
//   );
// });
