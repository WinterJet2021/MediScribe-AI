// controllers/audioController.js

import AudioRecord from "../models/mongo/audioRecordModel.js";

export const uploadAudioMetadata = async (req, res) => {
  try {
    const { file_url, duration, patientId } = req.body;
    const userId = req.auth.userId;

    const newAudio = await AudioRecord.create({
      userId,
      fileUrl: file_url,
      duration,
      patientId
    });

    res.status(201).json(newAudio);
  } catch (err) {
    console.error("❌ Audio upload failed:", err);
    res.status(500).json({ error: "Failed to upload audio metadata." });
  }
};

export const getAudioById = async (req, res) => {
  try {
    const audio = await AudioRecord.findById(req.params.id);
    if (!audio) return res.status(404).json({ error: "Audio not found" });

    res.json(audio);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audio metadata" });
  }
};
