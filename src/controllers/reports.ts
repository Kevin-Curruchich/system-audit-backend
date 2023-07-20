import { Request, Response } from "express";
import excel from "exceljs";
import {
  getCollectionStudent,
  getCollectionsHistoryByStudent,
} from "../models/collections";
import { getStudent } from "../models/students";

export const reportByStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const collections = await getCollectionsHistoryByStudent(String(id));
    const studentData = await getStudent(String(id));

    const totalOwed = collections.reduce((acc, collection) => {
      return acc + collection.collectionStudentAmountOwed;
    }, 0);

    const totalPaid = collections.reduce((acc, collection) => {
      return acc + collection.collectionStudentAmountPaid;
    }, 0);

    const total = totalOwed + totalPaid;

    const workBook = new excel.Workbook();

    const resumenSheet = workBook.addWorksheet("Resumen");

    resumenSheet.columns = [
      { header: "Nombre", key: "name", width: 20 },
      { header: "Apellido", key: "lastName", width: 20 },
      { header: "Total Adeudado", key: "totalOwed", width: 20 },
      { header: "Total Pagado", key: "totalPaid", width: 20 },
      { header: "Total", key: "total", width: 20 },
    ];

    resumenSheet.addRow({
      name: studentData.studentName,
      lastName: studentData.studentLastName,
      totalOwed,
      totalPaid,
      total,
    });

    collections.forEach((element) => {
      const sheetName = `${element.collection.collectionName}`;

      const sheet = workBook.addWorksheet(sheetName);

      sheet.columns = [
        { header: "Total", key: "totalCollection", width: 20 },
        { header: "Abonado", key: "collectionStudentAmountPaid", width: 20 },
        { header: "Saldo", key: "collectionStudentAmountOwed", width: 20 },
        { header: "Fecha", key: "paymentDate", width: 20 },
        { header: "Aporte", key: "paymentAmount", width: 20 },
        { header: "Recibo", key: "paymentSlip", width: 20 },
        { header: "Descripcion", key: "paymentDescription", width: 20 },
      ];

      sheet.addRow({
        totalCollection:
          element.collectionStudentAmountOwed +
          element.collectionStudentAmountPaid,
        collectionStudentAmountPaid: element.collectionStudentAmountPaid,
        collectionStudentAmountOwed: element.collectionStudentAmountOwed,
      });

      sheet.addRows(element.Payment);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        "Reporte_" +
        studentData.studentFullName?.replace(" ", "_") +
        ".xlsx"
    );

    workBook.xlsx.write(res).then(function () {
      res.status(200).end();
    });

    // res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const reportByYearController = async (req: Request, res: Response) => {
  try {
    const { page, take, searchQuery, currentYear } = req.query;

    const studentCurrentYear =
      currentYear === "" ? undefined : Number(currentYear);

    const collectionStudents = await getCollectionStudent(
      Number(page),
      Number(take),
      String(searchQuery),
      studentCurrentYear
    );

    const workBook = new excel.Workbook();

    const resumenSheet = workBook.addWorksheet("Resumen");

    resumenSheet.columns = [
      { header: "Estudiante", key: "studentFullName", width: 20 },
      { header: "Cobro", key: "collectionNameAsigned", width: 20 },
      { header: "Total", key: "total", width: 20 },
      { header: "Abonado", key: "collectionStudentAmountPaid", width: 20 },
      { header: "Saldo", key: "collectionStudentAmountOwed", width: 20 },
    ];

    collectionStudents.data.forEach((element) => {
      resumenSheet.addRow({
        studentFullName: element.studentFullName,
      });

      const dataCollections = element.children.map((collection: any) => {
        return {
          collectionNameAsigned: `${collection.collection.collectionName}-${collection.Quartetly.quartetlyName}`,
          total:
            collection.collectionStudentAmountOwed +
            collection.collectionStudentAmountPaid,
          collectionStudentAmountPaid: collection.collectionStudentAmountPaid,
          collectionStudentAmountOwed: collection.collectionStudentAmountOwed,
        };
      });

      resumenSheet.addRows(dataCollections);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Reporte_" + String(currentYear) + ".xlsx"
    );

    workBook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
