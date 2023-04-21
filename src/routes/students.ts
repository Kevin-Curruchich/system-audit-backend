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
router.get("/student-types", getStudentTypesController);

//post students
router.post("/", postStudentController);
router.post("/student-types", postStudentTypesController);

export default router;
