import MedicalNote from '../models/mongo/medicalNoteModel.js';

export const createMedicalNote = async (req, res) => {
  try {
    const note = await MedicalNote.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note', detail: err.message });
  }
};

export const getMedicalNote = async (req, res) => {
  try {
    const note = await MedicalNote.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

export const updateMedicalNote = async (req, res) => {
  try {
    const updated = await MedicalNote.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const getNotesByDoctor = async (req, res) => {
  try {
    const notes = await MedicalNote.find({ doctor_id: req.params.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes for doctor' });
  }
};

export const deleteMedicalNote = async (req, res) => {
  try {
    const deletedNote = await MedicalNote.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
