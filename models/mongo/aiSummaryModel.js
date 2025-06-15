  //aiSummaryModel.js

  import mongoose from "mongoose";

  const aiSummarySchema = new mongoose.Schema({
    transcriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcription" },
    structuredFields: {
      diagnosis: String,
      organ: String,
      notes: String,
      staging: String
    },
    modelUsed: { type: String, default: "Gemini" },
    createdAt: { type: Date, default: Date.now }
  });

  export default mongoose.model("AISummary", aiSummarySchema);
