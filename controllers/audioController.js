import { v4 as uuidv4 } from 'uuid';

const audioMetadata = []; // Temp in-memory store, replace with PostgreSQL later

export const uploadAudioMetadata = async (req, res) => {
  try {
    const { user_id, file_url, duration } = req.body;

    const newAudio = {
      id: uuidv4(),
      user_id,
      file_url,
      duration,
      status: "pending",
      uploaded_at: new Date()
    };

    audioMetadata.push(newAudio); // Save temporarily
    res.status(201).json(newAudio);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload audio metadata." });
  }
};

export const getAudioById = async (req, res) => {
  const audio = audioMetadata.find(a => a.id === req.params.id);
  if (!audio) return res.status(404).json({ error: "Audio not found" });
  res.json(audio);
};
