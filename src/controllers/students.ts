import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
  getStudents,
  getStudentTypes,
  postStudentTypes,
  postStudent,
} from "../models/students";
import studentStatus from "../constants/studentStatus";

//get methods
export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const { page, take } = req.query;
    const students = await getStudents(Number(page), Number(take));

    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStudentTypesController = async (
  req: Request,
  res: Response
) => {
  try {
    const studentTypes = await getStudentTypes();
    res.json(studentTypes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//post mothds
export const postStudentController = async (req: Request, res: Response) => {
  const {
    studentName,
    studentLastName,
    studentDni,
    studentPhone,
    studentEmail,
    studentStartDate,
    studentTypeId,
  } = req.body;
  try {
    const response = await postStudent({
      studentId: uuid(),
      studentName,
      studentLastName,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate: new Date(moment(studentStartDate).format("YYYY-MM-DD")),
      createdAt: new Date(moment(new Date()).format("YYYY-MM-DD")),
      studentTypeId,
      studentStatusId: studentStatus.ACTIVE,
    });
    res.status(201).json(response);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.log({ mes: "catch", err });
      return res.status(404).json({ status: "error", message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error", err });
  }
};

export const postStudentTypesController = async (
  req: Request,
  res: Response
) => {
  const { studentTypeName, studentTypeDesc } = req.body;
  try {
    const studentType = await postStudentTypes({
      studentTypeId: uuid(),
      studentTypeName,
      studentTypeDesc,
    });

    res.status(201).json(studentType);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
};
