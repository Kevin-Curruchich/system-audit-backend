import express from "express";

import {
  reportAllStudentsController,
  reportByStudentController,
  reportByYearController,
} from "../controllers/reports";

const router = express.Router();

router.get("/students/:id", reportByStudentController);
router.get("/year", reportByYearController);
router.get("/all-students", reportAllStudentsController);

export default router;
