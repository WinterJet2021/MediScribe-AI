// medicalNoteModel.js

import mongoose from 'mongoose';

const medicalNoteSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  doctor_id: { type: String, required: true }, // Clerk UUID (from PostgreSQL)

  visit_date: { type: Date, required: true },

  organ_examined: String,
  specimen_type: String,
  diagnosis: String,
  cancer_presence: String,
  perineural_invasion: {
    type: String,
    enum: ["Present", "Absent", "Not Evaluated"],
    default: "Not Evaluated"
  },

  notes: String,

  // Relational linking to other collections
  audio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AudioRecord' },
  transcription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription' },
  ai_summary_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AISummary' },

  audio_url: String,
  transcription_raw: String,
  transcription_summary: String,

  status: {
    type: String,
    enum: ['draft', 'in_review', 'finalized'],
    default: 'draft'
  },

  created_at: {
    type: Date,
    default: () => new Date()
  },
  updated_at: {
    type: Date,
    default: () => new Date()
  }
});

// Update timestamp on save
medicalNoteSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const MedicalNote = mongoose.model('MedicalNote', medicalNoteSchema);
export default MedicalNote;