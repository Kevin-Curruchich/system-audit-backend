// routes/users.js
import express from "express";
import {
  getStudentsController,
  getStudentTypesController,
  postStudentTypesController,
  postStudentController,
} from "../controllers/students";

const router = express.Router();

//get students
router.get("/", getStudentsController);
router.get("/types", getStudentTypesController);

//post students
router.post("/", postStudentController);
router.post("/types", postStudentTypesController);

export default router;
