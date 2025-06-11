import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(rateLimiter);
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming request method:", req.method, req.path);
  next();
});

// Root routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// Main API routes
app.use("/api/transactions", transactionsRoute);

// Start server after DB is ready
initDB()
  .then(() => {
    console.log("Database setup complete.");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error during database setup:", error);
  });

export default app;
