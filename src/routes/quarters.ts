// routes/users.js
import express from "express";
import { validateIdParam } from "../middlewares/validate-id-param.interface";
import {
  getQuartersController,
  postQuarterController,
  getQuartersListController,
  getStudentQuarterController,
  putQuarterController,
} from "../controllers/quarters";

const router = express.Router();

//get payments
router.get("/", getQuartersController);
router.get("/list", getQuartersListController);
router.get("/student/:id", getStudentQuarterController);
// router.get("/student/:id", getStudentByIdController);

//post payments
router.post("/", postQuarterController);

//put
router.put("/:id", validateIdParam, putQuarterController);

export default router;
