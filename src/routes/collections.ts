// routes\collections.ts
import express from "express";
import { validateIdParam } from "../middlewares/validate-id-param.middleware";
import {
  getCollectionTypesController,
  getCollectionsController,
  getCollectionsByIdController,
  getCollectionStudentController,
  getCollectionsOwedByIdController,
  postCollectionController,
  postCollectionStudentController,
  getCollectionsStudentByIdController,
  putCollectionAmountOwedController,
  putCollectionController,
} from "../controllers/collections";
import { convertPaginationParamsToNumber } from "../middlewares/convert-pagination.middleware";

const router = express.Router();

//get collections
router.get("/", getCollectionsController);
router.get("/types", getCollectionTypesController);
router.get(
  "/students",
  convertPaginationParamsToNumber,
  getCollectionStudentController
);
router.get("/students/:id", validateIdParam, getCollectionsByIdController);
router.get(
  "/students/:id/owed",
  validateIdParam,
  getCollectionsOwedByIdController
);
router.get(
  "/students/:id/history",
  validateIdParam,
  getCollectionsStudentByIdController
);

//post collections
router.post("/", postCollectionController);
router.post("/student", postCollectionStudentController);

//put collections
router.put("/:id", validateIdParam, putCollectionController);
router.put("/students/:id", validateIdParam, putCollectionAmountOwedController);

export default router;
