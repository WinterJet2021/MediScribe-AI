//transcriptionController.js

// controllers/transcriptionController.js

import Transcription from "../models/mongo/transcriptionModel.js";
import AudioRecord from "../models/mongo/audioRecordModel.js";

// Create transcription for a given audio record
export const createTranscription = async (req, res) => {
  try {
    const { audioId, rawText, accuracyEstimate, language } = req.body;

    const audioExists = await AudioRecord.findById(audioId);
    if (!audioExists) return res.status(404).json({ error: "Audio record not found" });

    const newTranscription = await Transcription.create({
      audioId,
      rawText,
      accuracyEstimate,
      language
    });

    res.status(201).json(newTranscription);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transcription", detail: err.message });
  }
};

// Get transcription by audio ID
export const getTranscriptionByAudio = async (req, res) => {
  try {
    const transcription = await Transcription.findOne({ audioId: req.params.audioId });

    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found for audio" });
    }

    res.json(transcription);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transcription" });
  }
};

// Update a transcription by ID
export const updateTranscription = async (req, res) => {
  try {
    const updated = await Transcription.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Transcription not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transcription" });
  }
};
