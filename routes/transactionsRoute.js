import express from 'express';
import {
  getTransactionsByUserId,
  createTransactions,
  deleteTransactionById,
  updateTransactionById,
  getTransactionSummaryByUserId
} from '../controllers/transactionsController.js';

const router = express.Router();

// ✅ Get transactions for a user
router.get('/:userId', getTransactionsByUserId);

// ✅ Create transaction
router.post('/', createTransactions);

// ✅ Delete transaction
router.delete('/:id', deleteTransactionById);

// ✅ Update transaction
router.put('/:id', updateTransactionById);

// ✅ Get transaction summary for a user
router.get('/summary/:userId', getTransactionSummaryByUserId);

export default router;
