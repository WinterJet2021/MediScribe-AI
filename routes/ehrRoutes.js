// routes/ehrRoutes.js

import express from "express";
import multer from "multer";
import { uploadDocx, getMedicalNoteById } from "../controllers/ehrController.js";

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadDocx);
router.get("/:id", getMedicalNoteById); 

export default router;