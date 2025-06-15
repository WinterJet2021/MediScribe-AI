// routes/audioRoutes.js

import express from 'express';
import { uploadAudioMetadata, getAudioById } from '../controllers/audioController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// Protect all routes
router.post('/', requireAuth(), uploadAudioMetadata);
router.get('/:id', requireAuth(), getAudioById);

export default router;

