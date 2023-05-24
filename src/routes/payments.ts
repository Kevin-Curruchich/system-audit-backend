// routes/users.js
import express from "express";
import {
  getPaymentssController,
  postPaymentController,
} from "../controllers/payments";

const router = express.Router();

//get payments
router.get("/", getPaymentssController);
// router.get("/types", getStudentTypesController);
// router.get("/student/:id", getStudentByIdController);

//post payments
router.post("/", postPaymentController);
// router.post("/types", postStudentTypesController);

export default router;
