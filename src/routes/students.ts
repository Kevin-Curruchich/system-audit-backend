// routes/users.js
import express from "express";
import {
  getStudentsController,
  getStudentsListController,
  getStudentByIdController,
  getStudentTypesController,
  postStudentTypesController,
  postStudentController,
  // putStudentController,
} from "../controllers/students";

const router = express.Router();

//get students
router.get("/", getStudentsController);
router.get("/list", getStudentsListController);
router.get("/types", getStudentTypesController);
router.get("/student/:id", getStudentByIdController);

//post students
router.post("/", postStudentController);
router.post("/types", postStudentTypesController);

//put students
// router.put("/:id", putStudentController);

export default router;
