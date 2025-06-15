
//audioRecordModel.js

import mongoose from "mongoose";

const audioRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // UUID from PostgreSQL
  patientId: { type: String },              // Optional UUID
  fileUrl: { type: String, required: true },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AudioRecord", audioRecordSchema);
