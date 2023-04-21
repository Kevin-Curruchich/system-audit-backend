import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
  getStudents,
  getStudentTypes,
  postStudentTypes,
  postStudent,
} from "../models/students";

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
    const student = await postStudent({
      studentId: uuid(),
      studentName,
      studentLastName,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate: new Date(moment(studentStartDate).format("YYYY-MM-DD")),
      createdAt: new Date(new Date().toUTCString()),
      studentTypeId,
      studentStatusId: "cf28faa2-7bc7-4d67-ba56-46a76fa7d68f",
    });
    res.status(201).json(student);
  } catch (err) {
    console.log({ err });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};
