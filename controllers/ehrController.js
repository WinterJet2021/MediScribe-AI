// ehrController.js

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import mongoose from "mongoose";

import MedicalNote from "../models/mongo/crc1NoteModel.js";
import { transformEHRFields } from "../utils/transformToMedicalNote.js";

export const getMedicalNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid MongoDB ID format" });
    }

    const note = await MedicalNote.findById(id);

    if (!note) {
      return res.status(404).json({ error: "Medical note not found" });
    }

    console.log("🔎 Full retrieved note from DB:", JSON.stringify(note, null, 2));
    res.status(200).json({ note });
  } catch (err) {
    console.error("❌ Error fetching note:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch medical note", detail: err.message });
  }
};

export const uploadDocx = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.originalname}`);
    fs.writeFileSync(tempPath, file.buffer);

    const pythonProcess = spawn("python", ["./services/ehrProcessor.py", tempPath]);

    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("❌ Python stderr:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      fs.unlinkSync(tempPath);
      console.log("✅ Python exited with code:", code);
      console.log("🧾 Raw Python output:", output);

      if (code === 0) {
        try {
          if (!output.trim()) throw new Error("Empty output from Python script");

          const parsed = JSON.parse(output);
          console.log("🔍 Parsed Python output:", parsed);

          const transformed = transformEHRFields(parsed, {
            patient_name: "Anonymous",
            doctor_id: "demo-doctor"
          });

          console.log("🧠 Transformed full note before save:", JSON.stringify(transformed, null, 2));

          const note = new MedicalNote(transformed);
          const saved = await note.save();

          console.log("✅ Note successfully saved to MongoDB:", saved._id);
          res.status(200).json({ message: "Note saved", note: saved });
        } catch (err) {
          console.error("❌ Parse or DB error:", err.message);
          res.status(500).json({
            error: "Failed to parse or save medical note",
            detail: err.message,
            rawOutput: output,
          });
        }
      } else {
        res.status(500).json({ error: "Python extraction failed" });
      }
    });
  } catch (err) {
    console.error("❌ Internal server error:", err.message);
    res.status(500).json({ error: "Internal server error", detail: err.message });
  }
};