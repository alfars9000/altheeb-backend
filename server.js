import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000;

// Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Altheeb AI Backend (Gemini Version) is running...");
});

// توليد نص الفيديو باستخدام Gemini
async function generateScript({ duration, language, contentType, voiceTone }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
اكتب نص فيديو مدته تقريبًا ${duration} دقيقة.
اللغة: ${language}.
نوع المحتوى: ${contentType}.
نبرة الصوت: ${voiceTone}.
اجعل النص احترافي، واضح، ومناسب للنشر كفيديو.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.post("/api/generate-video", async (req, res) => {
  try {
    const { duration, language, contentType, voiceTone } = req.body;

    const script = await generateScript({
      duration,
      language,
      contentType,
      voiceTone,
    });

    res.json({
      status: "success",
      message: "تم توليد نص الفيديو بنجاح باستخدام Gemini",
      script: script,
      videoUrl: null
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء توليد نص الفيديو",
      script: null,
      videoUrl: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Altheeb AI Backend (Gemini) running on port ${PORT}`);
});
