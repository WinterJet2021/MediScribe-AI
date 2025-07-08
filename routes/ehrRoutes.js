// File: backend/routes/ehrRoutes.js

import express from "express";
import multer from "multer";
import {
  getMedicalNoteById,
  uploadDocx,
  updateMedicalNote,
  deleteMedicalNote,
  generateSummary,
  getNotesByUserId,
  getAllNotes,
} from "../controllers/ehrController.js";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalNote:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "64a8b9c123456789abcdef01"
 *         patient_name:
 *           type: string
 *           description: Name of the patient
 *           example: "John Doe"
 *         doctor_id:
 *           type: string
 *           description: ID of the doctor who created the note
 *           example: "doctor123"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the note was created
 *           example: "2024-01-15T10:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the note was last updated
 *           example: "2024-01-15T15:45:00Z"
 *       required:
 *         - patient_name
 *         - doctor_id
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Medical note not found"
 *         detail:
 *           type: string
 *           description: Detailed error information
 *           example: "No document found with ID: 64a8b9c123456789abcdef01"
 *     
 *     GenerateSummaryRequest:
 *       type: object
 *       properties:
 *         prompt:
 *           type: string
 *           description: The prompt to generate a summary for
 *           example: "Summarize the key findings from this medical report"
 *       required:
 *         - prompt
 *     
 *     GenerateSummaryResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           description: Generated summary text
 *           example: "The medical report shows normal vital signs with no significant abnormalities detected."
 *         model:
 *           type: string
 *           description: The model used for generation
 *           example: "llama3"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of generation
 *           example: "2024-01-15T10:30:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: EHR
 *   description: Endpoints for Electronic Health Records management
 */

/**
 * @swagger
 * /api/ehr/upload:
 *   post:
 *     summary: Upload DOCX file and extract medical information
 *     description: Uploads a DOCX file, processes it using Python script to extract medical information, and saves it to the database
 *     tags: [EHR]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: DOCX file containing medical information
 *               patient_name:
 *                 type: string
 *                 description: Name of the patient
 *                 example: "John Doe"
 *               user_id:
 *                 type: string
 *                 description: ID of the doctor/user uploading the file
 *                 example: "doctor123"
 *             required:
 *               - file
 *               - patient_name
 *               - user_id
 *     responses:
 *       200:
 *         description: File successfully processed and note saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note saved"
 *                 note:
 *                   $ref: '#/components/schemas/MedicalNote'
 *       400:
 *         description: Bad request - missing file or required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_file:
 *                 value:
 *                   error: "No file uploaded"
 *               missing_fields:
 *                 value:
 *                   error: "Missing patient_name or user_id"
 *       500:
 *         description: Internal server error during processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to parse/save"
 *                 detail:
 *                   type: string
 *                   example: "Invalid JSON format in extracted data"
 *                 rawOutput:
 *                   type: string
 *                   description: Raw output from Python script for debugging
 */
router.post(
  "/upload",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "patient_name", maxCount: 1 },
    { name: "user_id", maxCount: 1 },
  ]),
  uploadDocx
);

/**
 * @swagger
 * /api/ehr/{id}:
 *   get:
 *     summary: Get medical note by ID
 *     description: Retrieves a specific medical note from the database using its MongoDB ObjectId
 *     tags: [EHR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the medical note
 *         schema:
 *           type: string
 *           example: "64a8b9c123456789abcdef01"
 *     responses:
 *       200:
 *         description: Medical note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/MedicalNote'
 *       400:
 *         description: Invalid MongoDB ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid MongoDB ID format"
 *       404:
 *         description: Medical note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Medical note not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getMedicalNoteById);

/**
 * @swagger
 * /api/ehr/{id}:
 *   patch:
 *     summary: Update medical note by ID
 *     description: Updates specific fields of a medical note in the database
 *     tags: [EHR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the medical note to update
 *         schema:
 *           type: string
 *           example: "64a8b9c123456789abcdef01"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_name:
 *                 type: string
 *                 description: Updated patient name
 *                 example: "Jane Doe"
 *               diagnosis:
 *                 type: string
 *                 description: Updated diagnosis
 *                 example: "Hypertension"
 *               treatment:
 *                 type: string
 *                 description: Updated treatment plan
 *                 example: "Medication adjustment"
 *             additionalProperties: true
 *             description: Any fields from the MedicalNote schema can be updated
 *     responses:
 *       200:
 *         description: Medical note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalNote'
 *       400:
 *         description: Missing updates in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Missing updates"
 *       404:
 *         description: Medical note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Note not found"
 *       500:
 *         description: Update failed due to server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", updateMedicalNote);

/**
 * @swagger
 * /api/ehr/{id}:
 *   delete:
 *     summary: Delete medical note by ID
 *     description: Permanently deletes a medical note from the database
 *     tags: [EHR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the medical note to delete
 *         schema:
 *           type: string
 *           example: "64a8b9c123456789abcdef01"
 *     responses:
 *       200:
 *         description: Medical note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note deleted successfully"
 *       404:
 *         description: Medical note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Note not found"
 *       500:
 *         description: Failed to delete medical note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", deleteMedicalNote);

/**
 * @swagger
 * /api/ehr/generate-summary:
 *   post:
 *     summary: Generate AI summary from a prompt
 *     description: Uses Ollama's LLaMA3 model to generate a summary based on the provided prompt
 *     tags: [EHR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateSummaryRequest'
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateSummaryResponse'
 *       400:
 *         description: Missing or invalid prompt field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Missing or invalid 'prompt' field"
 *       500:
 *         description: Failed to generate summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Failed to generate summary"
 *               detail: "Connection to Ollama API failed"
 */
router.post("/generate-summary", generateSummary);

/**
 * @swagger
 * /api/ehr/user/{userId}:
 *   get:
 *     summary: Get all medical notes for a specific user/doctor
 *     description: Retrieves all medical notes created by a specific doctor/user
 *     tags: [EHR]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the doctor/user
 *         schema:
 *           type: string
 *           example: "doctor123"
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MedicalNote'
 *       400:
 *         description: Missing userId parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Missing userId"
 *       500:
 *         description: Failed to fetch notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/user/:userId", getNotesByUserId);

/**
 * @swagger
 * /api/ehr:
 *   get:
 *     summary: Get all medical notes (admin access)
 *     description: Retrieves all medical notes from the database, sorted by creation date (newest first). This endpoint is typically used for administrative purposes.
 *     tags: [EHR]
 *     responses:
 *       200:
 *         description: All notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MedicalNote'
 *                   description: Array of all medical notes, sorted by creation date (newest first)
 *       500:
 *         description: Failed to fetch all notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Failed to fetch all notes"
 */
router.get("/", getAllNotes);

export default router;