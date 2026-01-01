import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد OpenAI من متغير البيئة
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Altheeb AI Backend is running...");
});

// دالة توليد نص الفيديو
async function generateScript({ duration, language, contentType, voiceTone }) {
  const prompt = `
اكتب نص فيديو مدته تقريبًا ${duration} دقيقة.
اللغة: ${language}.
نوع المحتوى: ${contentType}.
نبرة الصوت: ${voiceTone}.
اجعل النص احترافي، واضح، ومناسب للنشر كفيديو.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "أنت مساعد خبير في كتابة سكربتات فيديو عربية احترافية." },
      { role: "user", content: prompt }
    ]
  });

  return completion.choices[0].message.content;
}

// نقطة API الرئيسية
app.post("/api/generate-video", async (req, res) => {
  try {
    const { duration, language, contentType, voiceTone, uploadYT } = req.body;

    console.log("طلب جديد:", { duration, language, contentType, voiceTone, uploadYT });

    // توليد نص الفيديو
    const script = await generateScript({ duration, language, contentType, voiceTone });

    // رد ناجح
    res.json({
      status: "success",
      message: "تم توليد نص الفيديو بنجاح من الذئب AI",
      script: script,
      videoUrl: "https://example.com/fake-video.mp4"
    });
  } catch (error) {
    console.error("خطأ أثناء توليد النص:", error.message);

    res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء توليد نص الفيديو",
      script: null,
      videoUrl: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Altheeb AI Backend running on port ${PORT}`);
});
