// transcriptionRoutes.js
  
/**
 * @swagger
 * tags:
 *   name: Transcriptions
 *   description: Audio transcription management
 */

import express from "express";
import {
  createTranscription,
  getTranscriptionByAudio,
  updateTranscription
} from "../controllers/transcriptionController.js";

const router = express.Router();

/**
 * @swagger
 * /api/transcriptions:
 *   post:
 *     summary: Create a transcription
 *     tags: [Transcriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audioId
 *               - rawText
 *             properties:
 *               audioId:
 *                 type: string
 *               rawText:
 *                 type: string
 *               accuracyEstimate:
 *                 type: number
 *               language:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transcription created
 */
router.post("/", createTranscription);

/**
 * @swagger
 * /api/transcriptions/{audioId}:
 *   get:
 *     summary: Get transcription by audio ID
 *     tags: [Transcriptions]
 *     parameters:
 *       - name: audioId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the audio file
 *     responses:
 *       200:
 *         description: Transcription retrieved
 */
router.get("/:audioId", getTranscriptionByAudio);

/**
 * @swagger
 * /api/transcriptions/{id}:
 *   put:
 *     summary: Update a transcription
 *     tags: [Transcriptions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Transcription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Transcription updated
 */
router.put("/:id", updateTranscription);

export default router;