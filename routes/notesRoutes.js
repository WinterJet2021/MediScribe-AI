// notesRoutes.js

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Medical notes management
 */

import express from 'express';
import {
  createMedicalNote,
  getMedicalNote,
  updateMedicalNote,
  getNotesByDoctor,
  deleteMedicalNote
} from '../controllers/notesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new medical note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Medical note object
 *     responses:
 *       201:
 *         description: Medical note created
 */
router.post('/', createMedicalNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a medical note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the medical note
 *     responses:
 *       200:
 *         description: Medical note found
 */
router.get('/:id', getMedicalNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a medical note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Medical note updated
 */
router.put('/:id', updateMedicalNote);

/**
 * @swagger
 * /api/notes/doctor/{id}:
 *   get:
 *     summary: Get all notes by doctor ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Notes retrieved
 */
router.get('/doctor/:id', getNotesByDoctor);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a medical note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted
 */
router.delete('/:id', deleteMedicalNote);

export default router;
