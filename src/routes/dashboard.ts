import express from "express";
import { getDashboardController } from "../controllers/dashboard";

const router = express.Router();

router.get("/", getDashboardController);

export default router;
