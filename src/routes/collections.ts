// routes\collections.ts
import express from "express";
import {
  getCollectionTypesController,
  getCollectionsController,
  postCollectionController,
  postCollectionStudentController,
  getCollectionStudentController,
} from "../controllers/collections";

const router = express.Router();

//get collections
router.get("/", getCollectionsController);
router.get("/types", getCollectionTypesController);
router.get("/students", getCollectionStudentController);
// router.get("/student/:id", getStudentByIdController);

//post collections
router.post("/", postCollectionController);
router.post("/student", postCollectionStudentController);

export default router;
