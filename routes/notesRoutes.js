import express from 'express';
import {
  createMedicalNote,
  getMedicalNote,
  updateMedicalNote,
  getNotesByDoctor,
  deleteMedicalNote
} from '../controllers/notesController.js';

const router = express.Router();

router.post('/', createMedicalNote);
router.get('/:id', getMedicalNote);
router.put('/:id', updateMedicalNote);
router.get('/doctor/:id', getNotesByDoctor);
router.delete('/:id', deleteMedicalNote);

export default router;
