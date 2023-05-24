import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { getPayments, postPayment } from "../models/payments";

//get controllers
export const getPaymentssController = async (req: Request, res: Response) => {
  try {
    const { page, take } = req.query;
    const collectionTypes = await getPayments(Number(page), Number(take));
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
    } = req.body;

    const data = {
      paymentId: uuid(),
      studentId,
      collectionStudentId,
      paymentDate: new Date(paymentDate),
      paymentAmount,
      paymentDescription,
    };

    const collection = await postPayment(data);

    res.json(collection);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
