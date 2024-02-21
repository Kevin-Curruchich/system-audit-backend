// routes/users.js
import express from "express";
import { validateIdParam } from "../middlewares/validate-id-param.middleware";
import {
  getStudentsController,
  getStudentsListController,
  getStudentByIdController,
  getStudentTypesController,
  postStudentTypesController,
  postStudentController,
  putStudentController,
} from "../controllers/students";

const router = express.Router();

//get students
router.get("/", getStudentsController);
router.get("/list", getStudentsListController);
router.get("/types", getStudentTypesController);
router.get("/student/:id", validateIdParam, getStudentByIdController);

//post students
router.post("/", postStudentController);
router.post("/types", postStudentTypesController);

// put students
router.put("/student/:id", validateIdParam, putStudentController);

export default router;
