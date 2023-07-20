import express from "express";

import {
  reportByStudentController,
  reportByYearController,
} from "../controllers/reports";

const router = express.Router();

router.get("/students/:id", reportByStudentController);
router.get("/year", reportByYearController);

export default router;
