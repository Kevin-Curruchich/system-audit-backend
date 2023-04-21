import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import {
  getStudents,
  getStudentTypes,
  postStudentTypes,
  postStudent,
} from "../models/students";

//get methods
export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const students = await getStudents();
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
    studnetLastName,
    studentDni,
    studentPhone,
    studentEmail,
    studentStartDate,
    studentTypeStudent,
  } = req.body;
  try {
    const student = await postStudent({
      studentId: uuid(),
      studentName,
      studnetLastName,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate: new Date(studentStartDate),
      createdAt: new Date(),
      studentTypeStudent,
    });
    res.status(201).json(student);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
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
