import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { getPayments, getPaymentById, postPayment } from "../models/payments";
import { transporter } from "../helpers/nodemailer";
import moment from "moment";

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

    const payment = await postPayment(data);

    res.json(payment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postPaymentMail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await getPaymentById(id);

    if (!payment) throw new Error("Payment not found");

    transporter.sendMail({
      from: '"Seminario Biblico Guatemalteco" <admin@sbg.org>',
      to: [payment.student.studentEmail, "kevincxdev@gmail.com"],
      subject: "SBG - Aporte realizado",
      html: `
      <div
      style="
        border: 1px solid #ddd;
        padding: 20px;
        width: 400px;
        margin: 0 auto;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      ">
        <div class="col-md-8 col-sm-10 mx-auto">
        <div class="card p-3">
          <div
            class="company-info"
            style="
              text-align: center;
              margin-bottom: 20px;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <img
              class="company-logo"
              src="https://sbg.org.gt/SBG/static/images/logo_sbg_white.png"
              alt="Logo de la empresa"
              style="max-width: 100px; margin-bottom: 10px"
            />
            <h2 style="margin: 0">SEMINARIO BIBLICO GUATEMALTECO</h2>
            <p style="margin: 5px 0">
              1 Calle 7-206 Z.3 Chimaltenango, Guatemala, Chimaltenango,
              Guatemala
            </p>
            <p style="margin: 5px 0">Tel: 7839-4897</p>
          </div>
          <hr style="margin: 5px 0" />
          <div
            class="invoice-header"
            style="
              text-align: center;
              margin-bottom: 20px;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <p style="margin: 5px 0">
              Fecha:
              ${moment(payment.paymentDate).utc().format("DD/MM/YYYY")}
              </p>
            <p style="margin: 5px 0">
              <b>Correlativo:</b> ${payment.paymentId}
            </p>
          </div>
          <div
            class="customer-info"
            style="
              margin-bottom: 20px;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <p style="margin: 0; font-weight: bold">Estudiante:</p>
            <p style="margin: 5px 0">
              ${payment.student.studentFullName}
            </p>
          </div>
          <table
            class="invoice-table"
            style="
              width: 100%;
              margin-top: 20px;
              border-collapse: collapse;
              background-color: #f9f9f9;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <tr>
              <th
                style="border: 1px solid #ddd; padding: 10px; text-align: left"
              >
                Concepto
              </th>

              <th
                style="border: 1px solid #ddd; padding: 10px; text-align: left"
              >
                Monto
              </th>
            </tr>

            <tr>
              <td
                style="border: 1px solid #ddd; padding: 10px; text-align: left"
              >
              <b>
                ${payment.collectionStudent.collection.collectionName}
              </b>
                <br />
                <small style="font-variant: small-caps">${
                  payment.paymentDescription
                }</small>
              </td>

              <td
                style="border: 1px solid #ddd; padding: 10px; text-align: left"
              >
                Q. ${payment.paymentAmount.toLocaleString("es-GT")}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>


      `,
    });

    res.json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
