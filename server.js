//server.js

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

if(process.env.NODE_ENV === "production")job.start()


dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

//Connect to Database
await connectDB();

app.get("/apihealth" , (req, res) => {
  res.status(200).json("OK");
})

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use(cors());

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming request method:", req.method, req.path);
  next();
});

// Root routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Main API routes
app.use("/api/transactions", transactionsRoute);
app.use("/api/health", healthRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/transcriptions", transcriptionRoutes);
app.use("/api/ehr/", transcriptionRoutes);

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