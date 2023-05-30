import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
  getStudents,
  getStudent,
  getStudentTypes,
  postStudentTypes,
  postStudent,
  getStudentsList,
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

export const getStudentsListController = async (
  req: Request,
  res: Response
) => {
  try {
    const students = await getStudentsList();

    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStudentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await getStudent(String(id));

    res.json(student);
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
  try {
    const {
      studentName,
      studentLastName,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate,
      studentTypeId,
    } = req.body;

    const data = {
      studentId: uuid(),
      studentName: studentName.toUpperCase(),
      studentLastName: studentLastName.toUpperCase(),
      studentFullName: `${studentName.toUpperCase()} ${studentLastName.toUpperCase()}`,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate: new Date(moment(studentStartDate).format("YYYY-MM-DD")),
      createdAt: new Date(moment(new Date()).format("YYYY-MM-DD")),
      studentCurrentYear: 1,
      studentAddress: "",
      studentCountry: "",
      studentCity: "",
      studentProvince: "",
      studentBirthDate: new Date(moment(new Date()).format("YYYY-MM-DD")),
      studentTypeId,
      studentStatusId: studentStatus.ACTIVE,
    };

    const response = await postStudent(data);
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
