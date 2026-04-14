import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ✅ IMPORTANT (Railway fix)
const PORT = process.env.PORT || 5000;

// ✅ Model (safe default)
const model = process.env.OPENAI_MODEL || "gpt-5.2";

// ✅ Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Health check route (IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.json({ message: "YogPilot backend is running 🚀" });
});

// ✅ AI route
app.post("/ask-ai", async (req, res) => {
  const { message } = req.body || {};

  console.log("Received /ask-ai request:", message);

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      reply: "Please send a valid message.",
      error: "Message is required."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing.");
    return res.status(500).json({
      reply: "Server missing OpenAI API key.",
      error: "Server configuration error."
    });
  }

  try {
    const response = await openai.responses.create({
      model,
      input: [
        {
          role: "system",
          content: "You are YogPilot, a helpful, clear, and friendly AI assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      response.output_text ||
      "Sorry, I could not generate a reply right now.";

    console.log("OpenAI reply generated successfully.");

    return res.json({ reply });
  } catch (error) {
    console.error("Error while calling OpenAI:", error);

    return res.status(500).json({
      reply: "Something went wrong. Please try again.",
      error: error?.message || "Unknown error"
    });
  }
});

// ✅ Fallback (frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ START SERVER (MOST IMPORTANT)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 YogPilot running on port ${PORT}`);
});