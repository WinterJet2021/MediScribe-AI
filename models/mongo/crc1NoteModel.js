import mongoose from 'mongoose';

const specimenSchema = new mongoose.Schema({
  label: String,
  length_cm: Number,
  colon_max_circumference_cm: Number,
  terminal_ileum_max_circumference_cm: Number,
  transverse_colon_max_circumference_cm: Number,
  descending_colon_max_circumference_cm: String,
  sigmoid_colon_max_circumference_cm: Number,
  cecum_length_cm: Number,
  ascending_colon_length_cm: Number,
  transverse_colon_length_cm: Number,
  descending_colon_length_cm: Number,
  sigmoid_colon_length_cm: Number,
  terminal_ileum_length_cm: Number,
  appendix_length_cm: Number,
  appendix_diameter_cm: Number
});

const tumorSchema = new mongoose.Schema({
  size_cm: String,
  type: String,
  appearance: String,
  color_consistency: String,
  location: String,
  shape: String,
  thickness_cm: Number,
  wall_side: String,
  invasion_level: String
});

const marginSchema = new mongoose.Schema({
  proximal_cm: Number,
  distal_cm: Number,
  radial_cm: Number,
  mesenteric_cm: Number,
  distance_from_proximal_margin_cm: Number,
  distance_from_distal_margin_cm: Number,
  distance_from_mesenteric_margin_cm: Number,
  distance_from_retroperitoneal_margin_cm: Number
});

const lymphNodeSchema = new mongoose.Schema({
  found: String,
  positive: String,
  examined: String,
  positions: String,
  extranodal_extension: String,
  lymphovascular_invasion: String,
  perineural_invasion: String,
  extramural_vascular_invasion: String,
  tumor_budding: String
});

const polypSchema = new mongoose.Schema({
  presence: String,
  size_cm: Number,
  distance_from_main_lesion_cm: Number
});

const stagingSchema = new mongoose.Schema({
  pT: String,
  pN: String,
  pM: String,
  distance_to_serosa: String,
  synchronous_polyps: String
});

const tissueSurfaceSchema = new mongoose.Schema({
  serosal_surface: String,
  retroperitoneal_surface: String,
  omentum_findings: String,
  other_findings: String
});

const adminSchema = new mongoose.Schema({
  pathologist: String,
  diagnosis_date: String,
  block_count: String,
  report_conclusion: String
});

const medicalNoteSchema = new mongoose.Schema({
  specimen: specimenSchema,
  tumor: tumorSchema,
  margins: marginSchema,
  lymph_nodes: lymphNodeSchema,
  polyp: polypSchema,
  staging: stagingSchema,
  tissue_surfaces: tissueSurfaceSchema,
  admin: adminSchema,

  patient_name: String,
  doctor_id: String,
  visit_date: Date,

  audio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AudioRecord' },
  transcription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription' },
  ai_summary_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AISummary' },

  transcription_raw: String,
  transcription_summary: String,
  status: {
    type: String,
    enum: ['draft', 'finalized', 'archived'],
    default: 'draft'
  }
}, { timestamps: true });

const MedicalNote = mongoose.models.MedicalNote || mongoose.model('MedicalNote', medicalNoteSchema, 'ehr_medical_notes');
export default MedicalNote;