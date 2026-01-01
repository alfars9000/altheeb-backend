import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

app.get("/", (req, res) => {
  res.send("Altheeb AI Backend (DeepSeek Version) is running...");
});

// توليد نص الفيديو باستخدام DeepSeek
async function generateScript({ duration, language, contentType, voiceTone }) {
  const prompt = `
اكتب نص فيديو مدته تقريبًا ${duration} دقيقة.
اللغة: ${language}.
نوع المحتوى: ${contentType}.
نبرة الصوت: ${voiceTone}.
اجعل النص احترافي، واضح، ومناسب للنشر كفيديو.
`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("DeepSeek API returned an invalid response");
  }

  return data.choices[0].message.content;
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
      message: "تم توليد نص الفيديو بنجاح باستخدام DeepSeek",
      script: script,
      videoUrl: null
    });
  } catch (error) {
   console.error("DeepSeek Error:", error);
res.status(500).json({
  status: "error",
  message: "DeepSeek Error Details",
  error: error.message,
  script: null,
  videoUrl: null,
});
return;

    res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء توليد نص الفيديو",
      script: null,
      videoUrl: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Altheeb AI Backend (DeepSeek) running on port ${PORT}`);
});

