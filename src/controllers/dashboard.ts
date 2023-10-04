import { Request, Response } from "express";
import prisma from "../utils/db";
import {
  getHighestOwedStudents,
  getTotalOwedPrevMonth,
  getTotalPaymentsPrevMonth,
  getTotalStudents,
  getTotalStudentsByYear,
} from "../models/dashboard";

export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const totalStudents = await getTotalStudents();
    const { _sum } = await getTotalPaymentsPrevMonth(1);
    const { _sum: _sum_owed } = await getTotalOwedPrevMonth(1);
    const highestOwed = await getHighestOwedStudents();
    const studentsLastYear = await getTotalStudentsByYear(4);

    const tableWithStudentName = await Promise.all(
      highestOwed.map(async (item) => {
        const student = await prisma.student.findUnique({
          where: {
            studentId: item.studentId,
          },
        });
        return {
          collectionStudentAmountOwed: item._sum?.collectionStudentAmountOwed,
          student,
        };
      })
    );

    //create an object named chartData with the following properties: labels, datasets. labels is an array of strings with the name of the last three months. datasets is an array of numbers with the total payments for each month.
    const arrayPayments = await Promise.all(
      [1, 2, 3].map(async (item) => {
        const { _sum } = await getTotalPaymentsPrevMonth(item);
        return _sum?.paymentAmount;
      })
    );

    // create an array of strings with the name of the last three months
    const labels = await Promise.all(
      [1, 2, 3].map(async (item) => {
        const date = new Date(
          new Date().setMonth(new Date().getMonth() - item)
        );
        const month = date.toLocaleString("default", { month: "long" });
        return month;
      })
    );

    const chartData = {
      labels,
      datasets: arrayPayments,
    };

    res.json({
      totalStudents,
      totalPayments: _sum.paymentAmount,
      totalOwed: _sum_owed.collectionStudentAmountOwed,
      studentsLastYear,
      tableWithStudentName,
      chartData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
