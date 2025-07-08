// File: middleware/startOllama.js

import http from 'http';
import { spawn } from 'child_process';

export function startOllamaIfNotRunning() {
  const ollamaPath = "C:\\Users\\tueyc\\AppData\\Local\\Programs\\Ollama\\ollama.exe";

  const isOllamaRunning = (callback) => {
    const req = http.request({ method: 'GET', host: '127.0.0.1', port: 11434, path: '/' }, res => {
      callback(true); // Already running
    });
    req.on('error', () => callback(false)); // Not running
    req.end();
  };

  isOllamaRunning((running) => {
    if (!running) {
      const ollamaProcess = spawn(ollamaPath, ["serve"]);
      console.log("🧠 Starting Ollama server...");

      ollamaProcess.stdout.on("data", (data) => {
        console.log(`[OLLAMA] ${data.toString().trim()}`);
      });

      ollamaProcess.stderr.on("data", (data) => {
        console.error(`[OLLAMA ERROR] ${data.toString().trim()}`);
      });

      ollamaProcess.on("close", (code) => {
        console.log(`[OLLAMA] exited with code ${code}`);
      });
    } else {
      console.log("⚠️ Ollama is already running on port 11434.");
    }
  });
}
