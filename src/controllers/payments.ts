import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { getPayments, getPaymentById, postPayment } from "../models/payments";

//get controllers
export const getPaymentsController = async (req: Request, res: Response) => {
  try {
    const { page, take, searchQuery, currentYear } = req.query;

    const studentCurrentYear =
      currentYear === "" ? undefined : Number(currentYear);

    const collectionTypes = await getPayments(
      Number(page),
      Number(take),
      String(searchQuery),
      studentCurrentYear
    );
    res.json(collectionTypes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collectionTypes = await getPaymentById(id);
    res.json(collectionTypes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//post controllers
export const postPaymentController = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      collectionStudentId,
      paymentDate,
      paymentAmount,
      paymentDescription,
      paymentSlip,
    } = req.body;

    const data = {
      paymentId: uuid(),
      studentId,
      collectionStudentId,
      paymentDate: new Date(paymentDate),
      paymentAmount,
      paymentDescription,
      paymentSlip,
    };

    const collection = await postPayment(data);

    res.json(collection);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
