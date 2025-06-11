import { sql } from "../config/db.js";

//this is for getting transactions by the endpoint "/api/transactions/:userId"
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
     SELECT * FROM transactions
     WHERE user_id = ${userId}
     ORDER BY created_at DESC
   `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// this is for the endpoing for "/api/transactions"
export async function createTransactions (req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    console.log("Transaction inserted:", transaction[0]);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error inserting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//this is for deleting transactions by the endpoint "/api/transactions/:id"
export async function deleteTransactionById(req, res) {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// this is for updating transactions by the endpoint "/api/transactions/:id"
export async function updateTransactionById (req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedTransaction = await sql`
      UPDATE transactions
      SET title = ${title}, amount = ${amount}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedTransaction.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//this is for getting the summary of all transactions from the user endpoint "/api/transactions/summary/:userId"
export async function getTransactionSummaryByUserId (req, res) {
  try {
    const { userId } = req.params;

    // Total balance
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;

    // Income (positive amounts)
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    // Expense (convert negative sum to positive)
    const expenseResult = await sql`
      SELECT COALESCE(SUM(ABS(amount)), 0) AS expense
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    const balance = balanceResult[0].balance;
    const income = incomeResult[0].income;
    const expense = expenseResult[0].expense;

    res.status(200).json({ balance, income, expense });
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};