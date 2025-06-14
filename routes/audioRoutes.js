import express from 'express';
import { uploadAudioMetadata, getAudioById } from '../controllers/audioController.js';

const router = express.Router();

router.post('/', uploadAudioMetadata);
router.get('/:id', getAudioById);

export default router;
