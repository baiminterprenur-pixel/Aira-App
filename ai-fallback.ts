import { Router, type IRouter } from "express";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "dummy",
});

const PERSONA_SISTEM = `Kamu adalah Aira, asisten digital Desa Mekar Sari, Kecamatan Keluang yang ramah dan hangat.

Kepribadianmu:
- Bicara seperti teman yang baik dan perhatian, bukan seperti robot atau ensiklopedia
- Gunakan bahasa Indonesia sehari-hari yang paling mudah dimengerti — bayangkan kamu sedang menjelaskan ke warga desa yang tidak terlalu familiar dengan istilah teknis
- Sesekali tambahkan emoji yang sesuai agar terasa hangat (tapi jangan berlebihan)
- Kalau kamu tidak tahu sesuatu secara pasti, jujur saja

Aturan menjawab — PALING PENTING:
- SEDERHANAKAN selalu. Buang kata-kata sulit, ganti dengan kata sehari-hari
- Hindari istilah teknis, ilmiah, atau asing — kalau terpaksa pakai, langsung jelaskan artinya dengan kata biasa
- Jawaban harus PENDEK dan langsung ke inti — maksimal 3–4 kalimat untuk pertanyaan biasa
- Gaya bercerita seperti ngobrol, bukan seperti artikel atau buku
- Jangan mulai dengan "Tentu!", "Baik!", "Halo!" — langsung ke inti
- Jangan gunakan format markdown seperti **bold**, *italic*, atau # heading
- Tutup dengan kalimat singkat yang mengundang bertanya lagi`;

async function tanyaOpenAI(pertanyaan: string): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 400,
      messages: [
        { role: "system", content: "Kamu asisten AI yang menjawab pertanyaan dengan jelas dan ringkas dalam bahasa Indonesia." },
        { role: "user", content: pertanyaan },
      ],
    });
    return res.choices[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

async function tanyaClaude(pertanyaan: string): Promise<string> {
  try {
    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [
        { role: "user", content: `Jawab pertanyaan berikut dengan jelas dan ringkas dalam bahasa Indonesia:\n\n${pertanyaan}` },
      ],
    });
    const block = res.content[0];
    return block.type === "text" ? block.text : "";
  } catch {
    return "";
  }
}

async function sintesisAira(pertanyaan: string, jawabanA: string, jawabanB: string): Promise<string> {
  const prompt = `Kamu mendapat dua sumber informasi untuk pertanyaan berikut. Tugasmu: ambil inti yang paling penting, sederhanakan, lalu sampaikan dengan bahasa yang mudah dimengerti orang awam — seperti ngobrol dengan teman.

Pertanyaan warga: "${pertanyaan}"

Sumber pertama:
${jawabanA}

Sumber kedua:
${jawabanB}

Aturan wajib:
- Jangan sebut "sumber pertama/kedua" — langsung ke inti
- Buang semua istilah teknis atau kata sulit, ganti dengan kata sehari-hari
- Maksimal 3–4 kalimat saja — singkat, padat, mudah dipahami
- Gaya seperti ngobrol santai, bukan seperti artikel
- Sampaikan sebagai Aira yang hangat dan perhatian`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 512,
    messages: [
      { role: "system", content: PERSONA_SISTEM },
      { role: "user", content: prompt },
    ],
  });
  return res.choices[0]?.message?.content ?? "Maaf, aku tidak bisa menjawab saat ini.";
}

router.post("/ai-fallback", async (req, res) => {
  const { pertanyaan } = req.body as { pertanyaan?: string };
  if (!pertanyaan || typeof pertanyaan !== "string") {
    res.status(400).json({ error: "pertanyaan diperlukan" });
    return;
  }

  try {
    // Panggil dua AI secara paralel
    const [jawabanOpenAI, jawabanClaude] = await Promise.all([
      tanyaOpenAI(pertanyaan),
      tanyaClaude(pertanyaan),
    ]);

    let jawaban: string;

    if (jawabanOpenAI && jawabanClaude) {
      // Kedua sumber berhasil — sintesis
      jawaban = await sintesisAira(pertanyaan, jawabanOpenAI, jawabanClaude);
    } else if (jawabanOpenAI) {
      // Hanya OpenAI yang berhasil
      jawaban = await sintesisAira(pertanyaan, jawabanOpenAI, jawabanOpenAI);
    } else if (jawabanClaude) {
      // Hanya Claude yang berhasil
      jawaban = await sintesisAira(pertanyaan, jawabanClaude, jawabanClaude);
    } else {
      jawaban = "Maaf, aku sedang kesulitan menjawab saat ini. Coba tanya lagi ya 😊";
    }

    res.json({ jawaban });
  } catch (err) {
    req.log.error(err, "AI fallback error");
    res.status(500).json({ error: "Gagal menghubungi AI" });
  }
});

export default router;
