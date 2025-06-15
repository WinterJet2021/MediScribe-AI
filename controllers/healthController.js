// healthController.js

import mongoose from 'mongoose';
import { sql } from '../config/postgresql.db.js';

export async function getHealthStatus(req, res) {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  try {
    // Ping PostgreSQL
    await sql`SELECT 1`;

    res.status(200).json({
      mongo: mongoStatus,
      postgres: 'connected',
      status: '✅ Healthy'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      mongo: mongoStatus,
      postgres: 'disconnected',
      status: '❌ One or more databases are disconnected'
    });
  }
}
