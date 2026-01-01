import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Altheeb AI Backend is running...");
});

app.post("/api/generate-video", async (req, res) => {
  const { duration, language, contentType, voiceTone, uploadYT } = req.body;

  console.log("New request:", { duration, language, contentType, voiceTone, uploadYT });

  // هنا لاحقًا نربط الذكاء الاصطناعي الحقيقي
  // الآن نرجع رابط وهمي للتجربة
  res.json({
    status: "success",
    message: "تم استقبال الطلب بنجاح من الذئب AI",
    videoUrl: "https://example.com/fake-video.mp4"
  });
});

app.listen(PORT, () => {
  console.log(`Altheeb AI Backend running on port ${PORT}`);
});