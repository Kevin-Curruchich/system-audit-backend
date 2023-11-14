import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Student } from "@prisma/client";
import {
  getStudents,
  getStudent,
  getStudentTypes,
  postStudentTypes,
  postStudent,
  getStudentsList,
  putStudent,
} from "../models/students";
import { CreateStudentDto } from "./dto/students/create.student.dto";
import { PutStudentDto } from "./dto/students/put.student.dto";
import studentStatus from "../constants/studentStatus";

//get methods
export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const {
      page,
      take,
      search,
      studentTypeId,
      studentStatusId,
      studentCurrentYear,
    } = req.query;

    const searchQuery = search ? String(search) : "";
    const currentYear =
      studentCurrentYear === "" ? undefined : Number(studentCurrentYear);

    const students = await getStudents(
      Number(page),
      Number(take),
      String(searchQuery),
      String(studentTypeId),
      String(studentStatusId),
      currentYear
    );

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

export const getStudentByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const student = await getStudent(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const data = {
      ...student,
      studentStartDate: moment(student.studentStartDate)
        .utc()
        .format("YYYY-MM-DD"),
      studentBirthDate: moment(student.studentBirthDate)
        .utc()
        .format("YYYY-MM-DD"),
    };

    res.json(data);
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
export const postStudentController = async (
  req: Request<{}, {}, CreateStudentDto>,
  res: Response
) => {
  try {
    const {
      studentName,
      studentLastName,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate,
      studentTypeId,
      studentCurrentYear,
      studentAddress,
      studentBirthDate,
    } = req.body;

    const data: Student = {
      studentId: uuid(),
      studentName: studentName.toUpperCase(),
      studentLastName: studentLastName.toUpperCase(),
      studentFullName: `${studentName.toUpperCase()} ${studentLastName.toUpperCase()}`,
      studentDni,
      studentPhone,
      studentEmail,
      studentStartDate: new Date(moment(studentStartDate).format("YYYY-MM-DD")),
      createdAt: new Date(moment(new Date()).format("YYYY-MM-DD")),
      studentCurrentYear: studentCurrentYear,
      studentAddress: studentAddress,
      studentCountry: "",
      studentCity: "",
      studentProvince: "",
      studentBirthDate: new Date(moment(studentBirthDate).format("YYYY-MM-DD")),
      studentTypeId,
      studentStatusId: studentStatus.ACTIVE,
    };

    const response = await postStudent(data);
    res.status(201).json(response);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
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

export const putStudentController = async (
  req: Request<{ id: string }, {}, PutStudentDto>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const data = req.body;
    data.studentName = data.studentName.toUpperCase();
    data.studentLastName = data.studentLastName.toUpperCase();
    data.studentFullName = `${data.studentName.toUpperCase()} ${data.studentLastName.toUpperCase()}`;
    data.studentStartDate = new Date(
      moment(data.studentStartDate).format("YYYY-MM-DD")
    );
    data.studentBirthDate = new Date(
      moment(data.studentBirthDate).format("YYYY-MM-DD")
    );

    const student = await putStudent(id, data);

    res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
};
