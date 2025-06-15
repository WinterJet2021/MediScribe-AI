// routes/transcriptionRoutes.js

import express from "express";
import {
  createTranscription,
  getTranscriptionByAudio,
  updateTranscription
} from "../controllers/transcriptionController.js";

const router = express.Router();

router.post("/", createTranscription);
router.get("/:audioId", getTranscriptionByAudio);
router.put("/:id", updateTranscription);

export default router;
