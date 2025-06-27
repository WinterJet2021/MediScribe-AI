/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: User financial transactions
 */

import express from 'express';
import {
  getTransactionsByUserId,
  createTransactions,
  deleteTransactionById,
  updateTransactionById,
  getTransactionSummaryByUserId
} from '../controllers/transactionsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions/{userId}:
 *   get:
 *     summary: Get transactions for a user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transactions list
 */
router.get('/:userId', getTransactionsByUserId);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post('/', createTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', deleteTransactionById);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put('/:id', updateTransactionById);

/**
 * @swagger
 * /api/transactions/summary/{userId}:
 *   get:
 *     summary: Get transaction summary by user ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Summary retrieved
 */
router.get('/summary/:userId', getTransactionSummaryByUserId);

export default router;
