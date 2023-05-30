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
} from "../controllers/collections";

const router = express.Router();

//get collections
router.get("/", getCollectionsController);
router.get("/types", getCollectionTypesController);
router.get("/students", getCollectionStudentController);
router.get("/students/:id", getCollectionsByIdController);
router.get("/students/:id/owed", getCollectionsOwedByIdController);

//post collections
router.post("/", postCollectionController);
router.post("/student", postCollectionStudentController);

export default router;
