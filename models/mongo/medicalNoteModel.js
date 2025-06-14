import mongoose from 'mongoose';

const medicalNoteSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  doctor_id: { type: String, required: true }, // Clerk UUID
  visit_date: { type: Date, required: true },
  organ_examined: String,
  specimen_type: String,
  diagnosis: String,
  cancer_presence: String,
  perineural_invasion: {
    type: String,
    enum: ["Present", "Absent", "Not Evaluated"]
  },
  notes: String,
  audio_url: String,
  transcription_raw: String,
  transcription_summary: String,
  created_at: {
    type: Date,
    default: () => new Date()
  },
  updated_at: {
    type: Date,
    default: () => new Date()
  }
});

medicalNoteSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const MedicalNote = mongoose.model('MedicalNote', medicalNoteSchema);
export default MedicalNote;
