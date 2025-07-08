// File: server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/postgresql.db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from "./config/cron.js";
import connectDB from './config/mongodb.db.js';
import healthRoutes from './routes/healthRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import transcriptionRoutes from './routes/transcriptionRoutes.js';
import ehrRoutes from './routes/ehrRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { startOllamaIfNotRunning } from './middleware/startOllama.js';

dotenv.config();

if (process.env.NODE_ENV === "production") job.start();

// Start Ollama server if not running
startOllamaIfNotRunning();

const app = express();
const port = process.env.PORT || 5001;

// Mongo
await connectDB();

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/transactions", transactionsRoute);
app.use("/api/health", healthRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/transcriptions", transcriptionRoutes);
app.use("/api/ehr", ehrRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initDB()
  .then(() => {
    console.log("PostgreSQL database setup complete.");
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error during database setup:", error);
  });

export default app;