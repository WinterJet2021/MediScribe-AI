// ehrRoutes.js

/**
 * @swagger
 * tags:
 *   name: EHR
 *   description: Medical record upload and retrieval
 */

import express from "express";
import multer from "multer";
import { uploadDocx, getMedicalNoteById } from "../controllers/ehrController.js";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * /api/ehr/upload:
 *   post:
 *     summary: Upload a .docx medical record
 *     tags: [EHR]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The DOCX file to upload
 *     responses:
 *       200:
 *         description: DOCX uploaded and parsed
 */
router.post("/upload", upload.single("file"), uploadDocx);

/**
 * @swagger
 * /api/ehr/{id}:
 *   get:
 *     summary: Get medical note by ID
 *     tags: [EHR]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the medical note
 *     responses:
 *       200:
 *         description: Medical note data
 */
router.get("/:id", getMedicalNoteById);

export default router;
