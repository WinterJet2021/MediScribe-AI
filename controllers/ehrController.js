// File: backend/controllers/ehrController.js

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import mongoose from "mongoose";
import axios from "axios";

import MedicalNote from "../models/mongo/crc1NoteModel.js";
import { transformEHRFields } from "../utils/transformToMedicalNote.js";

// Controller functions for handling EHR operations

/**
 * @description Retrieve a medical note by ID
 * @param {string} id - MongoDB ID of the note to retrieve
 * @returns {Promise<Object>} - Retrieved note with all fields
 * @throws {Error} if the ID is invalid or the note is not found
 */
export const getMedicalNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Invalid MongoDB ID format
      return res.status(400).json({ error: "Invalid MongoDB ID format" });
    }

    // Retrieve the medical note by ID
    const note = await MedicalNote.findById(id);
    if (!note) {
      // Medical note not found
      return res.status(404).json({ error: "Medical note not found" });
    }

    // Clean the retrieved note by converting the _id field to string
    const cleanedNote = { ...note.toObject(), _id: note._id.toString() };

    console.log("🔎 Full retrieved note from DB:", JSON.stringify(cleanedNote, null, 2));
    res.status(200).json({ note: cleanedNote });
  } catch (err) {
    console.error("❌ Error fetching note:", err.message);
    res.status(500).json({ error: "Failed to fetch medical note", detail: err.message });
  }
};

/**
 * @description Upload a .docx file and extract relevant medical information
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @returns {Promise<void>} - Resolves with extracted information or rejects with an error
 */
export const uploadDocx = async (req, res) => {
  try {
    // Get the uploaded file, patient name, and user ID from the request
    const file = req.files?.file?.[0];
    const patient_name = req.body?.patient_name;
    const user_id = req.body?.user_id;

    console.log("📂 Uploaded file:", file?.originalname);
    console.log("📝 patient_name:", patient_name);
    console.log("👨‍⚕️ user_id:", user_id);

    // Validate the request
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!patient_name || !user_id) return res.status(400).json({ error: "Missing patient_name or user_id" });

    // Save the uploaded file to a temporary path
    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.originalname}`);
    fs.writeFileSync(tempPath, file.buffer);

    // Spawn the Python script to extract the medical information
    const pythonProcess = spawn("python", ["./services/ehrProcessor.py", tempPath]);

    // Handle the output from the Python script
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("❌ Python stderr:", data.toString());
    });

    // Handle the exit event of the Python script
    pythonProcess.on("close", async (code) => {
      // Delete the temporary file
      fs.unlinkSync(tempPath);

      // Handle the outcome of the Python script
      if (code !== 0) {
        return res.status(500).json({ error: "Python extraction failed" });
      }

      try {
        // Parse the output from the Python script
        const parsed = JSON.parse(output.trim());
        const transformed = transformEHRFields(parsed, {
          patient_name,
          doctor_id: user_id,
        });

        // Save the extracted information to the database
        const note = new MedicalNote(transformed);
        const saved = await note.save();

        console.log("✅ Saved note:", saved._id);
        res.status(200).json({ message: "Note saved", note: saved });
      } catch (err) {
        console.error("❌ Parse/save error:", err.message);
        res.status(500).json({ error: "Failed to parse/save", detail: err.message, rawOutput: output });
      }
    });
  } catch (err) {
    console.error("❌ Upload handler failed:", err.message);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
};

/**
 * Updates a medical note in the database.
 *
 * @param {string} id - The ID of the note to update.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object>} - The updated note.
 */
export const updateMedicalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate the updates
    if (!updates) return res.status(400).json({ error: "Missing updates" });

    // Update the note in the database
    const updated = await MedicalNote.findByIdAndUpdate(id, updates, { new: true });

    // Check if the note was found
    if (!updated) return res.status(404).json({ error: "Note not found" });

    // Clean the returned note
    const cleanedNote = { ...updated.toObject(), _id: updated._id.toString() };

    // Return the updated note
    res.status(200).json(cleanedNote);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: "Update failed", detail: err.message });
  }
};

/**
 * Delete a medical note by ID.
 *
 * @param {Object} req - The incoming request
 * @param {string} req.params.id - The ID of the note to delete
 * @param {Object} res - The response object
 * @returns {Promise<Object>} - A JSON response with a success message
 */
export const deleteMedicalNote = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the note
    const deleted = await MedicalNote.findByIdAndDelete(id);

    // Check if the note was found
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting note:", err.message);
    res.status(500).json({
      error: "Failed to delete medical note",
      detail: err.message
    });
  }
};

/**
 * Generates a summary based on the provided prompt.
 *
 * @param {Object} req - The incoming request object
 * @param {Object} req.body - The body of the request
 * @param {string} req.body.prompt - The prompt to generate a summary for
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A JSON response with the generated summary or an error message
 */
export const generateSummary = async (req, res) => {
  const { prompt } = req.body;

  // Validate the prompt
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'prompt' field" });
  }

  try {
    // Send a POST request to the generation API
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false
    });

    // Return the generated summary
    return res.status(200).json(response.data);
  } catch (err) {
    // Handle any errors during the generation process
    console.error("❌ Ollama generation failed:", err.message);
    res.status(500).json({
      error: "Failed to generate summary",
      detail: err.message
    });
  }
};


export const getNotesByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const notes = await MedicalNote.find({ doctor_id: userId });
    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes", detail: err.message });
  }
};

/**
 * @description Get all medical notes from the database
 * @returns {Array} Array of all medical notes
 */
export const getAllNotes = async (req, res) => {
  try {
    const notes = await MedicalNote.find().sort({ created_at: -1 }); // newest first
    res.status(200).json({ notes });
  } catch (err) {
    console.error("❌ Failed to fetch all notes:", err.message);
    res.status(500).json({ error: "Failed to fetch all notes", detail: err.message });
  }
};

