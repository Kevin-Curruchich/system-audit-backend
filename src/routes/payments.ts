// routes/users.js
import express from "express";
import {
  getPaymentsController,
  postPaymentController,
} from "../controllers/payments";

const router = express.Router();

//get payments
router.get("/", getPaymentsController);
// router.get("/student/:id", getStudentTypesController);
// router.get("/student/:id", getStudentByIdController);

//post payments
router.post("/", postPaymentController);
// router.post("/types", postStudentTypesController);

export default router;
