/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: App health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 */

import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

router.get('/', getHealthStatus);

export default router;
