// audioRoutes.js

/**
 * @swagger
 * tags:
 *   name: Audio
 *   description: Audio upload and retrieval
 */

import express from 'express';
import { uploadAudioMetadata, getAudioById } from '../controllers/audioController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

/**
 * @swagger
 * /api/audio:
 *   post:
 *     summary: Upload audio metadata
 *     tags: [Audio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - file_url
 *               - duration
 *               - patientId
 *             properties:
 *               file_url:
 *                 type: string
 *                 description: URL of the uploaded audio file
 *               duration:
 *                 type: number
 *                 description: Length of the audio in seconds
 *               patientId:
 *                 type: string
 *                 description: MongoDB ID of the patient
 *     responses:
 *       201:
 *         description: Audio metadata uploaded successfully
 */
router.post('/', requireAuth(), uploadAudioMetadata);

/**
 * @swagger
 * /api/audio/{id}:
 *   get:
 *     summary: Get audio by ID
 *     tags: [Audio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ID of the audio
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audio metadata retrieved
 */
router.get('/:id', requireAuth(), getAudioById);

export default router;
