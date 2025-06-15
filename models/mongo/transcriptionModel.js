//transcriptionModel.js

import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema({
  audioId: { type: mongoose.Schema.Types.ObjectId, ref: "AudioRecord", required: true },
  rawText: { type: String, required: true },
  accuracyEstimate: { type: Number },
  language: { type: String, default: "en" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transcription", transcriptionSchema);
