// routes/users.js
import express from "express";
import {
  getPaymentsController,
  getPaymentByIdController,
  postPaymentController,
  postPaymentMail,
} from "../controllers/payments";

const router = express.Router();

//get payments
router.get("/", getPaymentsController);
router.get("/:id", getPaymentByIdController);
// router.get("/student/:id", getStudentByIdController);

//post payments
router.post("/", postPaymentController);
router.post("/payment-mail/:id", postPaymentMail);

export default router;
