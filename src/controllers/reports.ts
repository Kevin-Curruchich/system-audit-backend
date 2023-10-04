import { Request, Response } from "express";
import excel from "exceljs";
import {
  getCollectionStudentWithoutPage,
  getCollectionsHistoryByStudent,
} from "../models/collections";
import { getStudent } from "../models/students";
import moment from "moment";

export const reportByStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { quartetlyId } = req.query;

    const collections = await getCollectionsHistoryByStudent(
      String(id),
      String(quartetlyId)
    );
    const studentData = await getStudent(String(id));

    const newCollections = collections.map((collection) => {
      const newCollection = {
        ...collection,
        Payment: collection.Payment.sort((a, b) => {
          return (
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
          );
        }),
      };

      return newCollection;
    });

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
      { header: "Total Saldo", key: "totalOwed", width: 20 },
      { header: "Total Abonado", key: "totalPaid", width: 20 },
    ];

    resumenSheet.addRow({
      name: studentData.studentName,
      lastName: studentData.studentLastName,
      totalOwed,
      totalPaid,
    });

    for (const collectionItem of newCollections) {
      const collectionDate = moment(collectionItem.collectionStudentDate)
        .utc()
        .format("DD-MM");

      const collectionFullDate = moment(collectionItem.collectionStudentDate)
        .utc()
        .format("DD/MM/YYYY");

      const collectionName = collectionItem.collection.collectionName;

      const collectionNameSevenChars =
        collectionName.length > 7
          ? collectionName.substring(0, 7)
          : collectionName;

      const sheetName = `${collectionNameSevenChars}${collectionDate}_${collectionItem.Quartetly?.quartetlyName}`;

      const sheet = workBook.addWorksheet(sheetName);

      sheet.getColumn("A").alignment = { horizontal: "left" };
      sheet.getColumn("B").alignment = { horizontal: "left" };
      sheet.getColumn("C").alignment = { horizontal: "left" };

      sheet.getCell("A1").value = "Cobro";
      sheet.getCell("A1").font = { bold: true };
      sheet.getCell("B1").value = `${collectionName}`;

      sheet.getCell("A2").value = "Trimestre";
      sheet.getCell("A2").font = { bold: true };
      sheet.getCell("B2").value = collectionItem.Quartetly?.quartetlyName;

      sheet.getCell("A3").value = "Fecha";
      sheet.getCell("A3").font = { bold: true };
      sheet.getCell("B3").value = collectionFullDate;

      sheet.getCell("A4").value = "Total";
      sheet.getCell("B4").value = "Abonado";
      sheet.getCell("C4").value = "Saldo";

      sheet.getCell("A4").font = { bold: true };
      sheet.getCell("B4").font = { bold: true };
      sheet.getCell("C4").font = { bold: true };

      sheet.getCell("A5").value =
        collectionItem.collectionStudentAmountOwed +
        collectionItem.collectionStudentAmountPaid;
      sheet.getCell("B5").value = collectionItem.collectionStudentAmountPaid;
      sheet.getCell("C5").value = collectionItem.collectionStudentAmountOwed;

      sheet.getCell("A5").numFmt = "Q0.00";
      sheet.getCell("B5").numFmt = "Q0.00";
      sheet.getCell("C5").numFmt = "Q0.00";

      sheet.getCell("A7").value = "Pagos";
      sheet.getCell("A7").font = { bold: true };

      sheet.getCell("A9").value = "Fecha";
      sheet.getCell("B9").value = "Aporte";
      sheet.getCell("C9").value = "Recibo";
      sheet.getCell("D9").value = "Descripcion";

      let rowIndex = 10;
      for (const payment of collectionItem.Payment) {
        sheet.getCell(`A${rowIndex}`).value = payment.paymentDate;
        sheet.getCell(`B${rowIndex}`).value = payment.paymentAmount;
        sheet.getCell(`B${rowIndex}`).numFmt = "Q0.00";
        sheet.getCell(`C${rowIndex}`).value = payment.paymentSlip;
        sheet.getCell(`D${rowIndex}`).value = payment.paymentDescription;
        rowIndex++;
      }

      //when finish with payments set a formula to calculate the total on the last row of the sheet and set the format to currency
      sheet.getCell(`A${rowIndex}`).value = "Total";
      sheet.getCell(`B${rowIndex}`).value = {
        formula: `SUM(B6:B${rowIndex - 1})`,
        date1904: false,
      };
      sheet.getCell(`B${rowIndex}`).numFmt = "Q0.00";
      sheet.getCell(`B${rowIndex}`).font = { bold: true };

      sheet.getCell(`A${rowIndex}`).border = {
        top: { style: "thin" },
      };
      sheet.getCell(`A${rowIndex}`).font = { bold: true };

      sheet.getCell(`B${rowIndex}`).border = {
        top: { style: "thin" },
      };

      sheet.getCell(`C${rowIndex}`).border = {
        top: { style: "thin" },
      };

      sheet.getColumn("A").width = 25;
      sheet.getColumn("B").width = 10;
      sheet.getColumn("C").width = 25;
      sheet.getColumn("D").width = 40;
    }

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
    const { searchQuery, currentYear, quartetlyId } = req.query;

    const studentCurrentYear =
      currentYear === "" ? undefined : Number(currentYear);

    const collectionStudents = await getCollectionStudentWithoutPage(
      String(searchQuery),
      studentCurrentYear,
      String(quartetlyId)
    );

    const workBook = new excel.Workbook();

    const resumenSheet = workBook.addWorksheet("Resumen");

    resumenSheet.columns = [
      {
        header: "Estudiante",
        key: "studentFullName",
        width: 50,
      },
      {
        header: "Año",
        key: "currentYear",
        width: 20,
      },
      {
        header: "Abonado",
        key: "collectionStudentAmountPaid",
        width: 20,
      },
      {
        header: "Saldo",
        key: "collectionStudentAmountOwed",
        width: 20,
      },
    ];

    resumenSheet.getCell("A1").style = { font: { bold: true } };
    resumenSheet.getCell("B1").style = { font: { bold: true } };
    resumenSheet.getCell("C1").style = { font: { bold: true } };
    resumenSheet.getCell("D1").style = { font: { bold: true } };

    collectionStudents.forEach((element, index) => {
      const collectionStudentAmountPaid = element.children.reduce(
        (acc: any, collection: any) => {
          return acc + collection.collectionStudentAmountPaid;
        },
        0
      );

      const collectionStudentAmountOwed = element.children.reduce(
        (acc: any, collection: any) => {
          return acc + collection.collectionStudentAmountOwed;
        },
        0
      );

      resumenSheet.addRow({
        studentFullName: element.studentFullName,
        currentYear: element.studentCurrentYear,
        collectionStudentAmountPaid,
        collectionStudentAmountOwed,
      });

      resumenSheet.getCell(`C${index + 2}`).numFmt = "Q0.00";
      resumenSheet.getCell(`D${index + 2}`).numFmt = "Q0.00";
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Reporte" + ".xlsx"
    );

    workBook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
