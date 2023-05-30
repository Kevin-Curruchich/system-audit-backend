// routes/users.js
import express from "express";
import {
  getQuartersController,
  postQuarterController,
  getQuartersListController,
} from "../controllers/quarters";

const router = express.Router();

//get payments
router.get("/", getQuartersController);
router.get("/list", getQuartersListController);
// router.get("/student/:id", getStudentTypesController);
// router.get("/student/:id", getStudentByIdController);

//post payments
router.post("/", postQuarterController);
// router.post("/types", postStudentTypesController);

export default router;
