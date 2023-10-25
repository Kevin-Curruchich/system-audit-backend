// routes\collections.ts
import express from "express";
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
} from "../controllers/collections";

const router = express.Router();

//get collections
router.get("/", getCollectionsController);
router.get("/types", getCollectionTypesController);
router.get("/students", getCollectionStudentController);
router.get("/students/:id", getCollectionsByIdController);
router.get("/students/:id/owed", getCollectionsOwedByIdController);
router.get("/students/:id/history", getCollectionsStudentByIdController);

//post collections
router.post("/", postCollectionController);
router.post("/student", postCollectionStudentController);

router.put("/students/:id", putCollectionAmountOwedController);

export default router;
