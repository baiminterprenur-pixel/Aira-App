import { Router, type IRouter } from "express";
import {
  buatRuang,
  getRuang,
  tambahPemain,
  mulaiSesi,
  mulaiSesiBerikutnya,
  cekDanMajuSoal,
  rekamJawaban,
  getPeringkat,
  getPemainAktif,
  type SoalKustom,
} from "../utils/ruangKuis";
import { DURASI_BARENG, MAKS_LOLOS, getSoalSolo, DURASI_SOLO, JUMLAH_SOLO } from "../utils/bankSoal";
import { type TingkatBareng } from "../utils/ruangKuis";

const router: IRouter = Router();

// POST /api/kuis/buat — host membuat ruang baru
router.post("/kuis/buat", (req, res) => {
  const { hostId, tingkat, soalKustom } = req.body as {
    hostId?: string;
    tingkat?: string;
    soalKustom?: unknown[];
  };
  if (!hostId || typeof hostId !== "string") {
    res.status(400).json({ error: "hostId diperlukan" });
    return;
  }
  const tingkatValid: TingkatBareng =
    tingkat === "sedang" || tingkat === "sulit" ? tingkat : "mudah";

  let validSoalKustom: SoalKustom[] | undefined;
  if (Array.isArray(soalKustom) && soalKustom.length > 0) {
    validSoalKustom = (soalKustom as Record<string, unknown>[])
      .filter(
        (s) =>
          typeof s.pertanyaan === "string" &&
          s.pertanyaan.trim() &&
          Array.isArray(s.pilihan) &&
          (s.pilihan as unknown[]).length === 3 &&
          (s.pilihan as unknown[]).every((p) => typeof p === "string") &&
          (s.jawaban === 0 || s.jawaban === 1 || s.jawaban === 2)
      )
      .slice(0, 200)
      .map((s, i) => ({
        id: (s.id as string) || `k-${i}`,
        pertanyaan: (s.pertanyaan as string).trim(),
        pilihan: s.pilihan as [string, string, string],
        jawaban: s.jawaban as 0 | 1 | 2,
      }));
  }

  const ruang = buatRuang(hostId, tingkatValid, validSoalKustom);
  res.json({ kode: ruang.kode, pakaiSoalKustom: !!validSoalKustom?.length });
});

// POST /api/kuis/masuk — pemain masuk ke ruang
router.post("/kuis/masuk", (req, res) => {
  const { kode, pemainId, nama } = req.body as {
    kode?: string;
    pemainId?: string;
    nama?: string;
  };
  if (!kode || !pemainId || !nama) {
    res.status(400).json({ error: "kode, pemainId, dan nama diperlukan" });
    return;
  }
  const ruang = getRuang(kode);
  if (!ruang) {
    res.status(404).json({ error: "Ruang tidak ditemukan. Cek kode kuis." });
    return;
  }
  if (ruang.status !== "menunggu") {
    res.status(400).json({ error: "Kuis sudah dimulai, tidak bisa bergabung." });
    return;
  }
  // Host tidak masuk ke daftar pemain — hanya peserta yang boleh bergabung
  const isHost = ruang.hostId === pemainId;
  if (isHost) {
    res.json({ ok: true, nama: nama.trim().slice(0, 20), isHost: true });
    return;
  }
  if (ruang.pemain.size >= 100) {
    res.status(400).json({ error: "Ruang sudah penuh (maks 100 peserta)." });
    return;
  }
  const pemain = tambahPemain(ruang, pemainId, nama);
  res.json({ ok: true, nama: pemain.nama, isHost: false });
});

// POST /api/kuis/mulai — host memulai sesi
router.post("/kuis/mulai", (req, res) => {
  const { kode, hostId } = req.body as { kode?: string; hostId?: string };
  if (!kode || !hostId) {
    res.status(400).json({ error: "kode dan hostId diperlukan" });
    return;
  }
  const ruang = getRuang(kode);
  if (!ruang) {
    res.status(404).json({ error: "Ruang tidak ditemukan" });
    return;
  }
  if (ruang.hostId !== hostId) {
    res.status(403).json({ error: "Hanya host yang bisa memulai kuis" });
    return;
  }
  if (ruang.status === "menunggu") {
    if (ruang.pemain.size < 1) {
      res.status(400).json({ error: "Belum ada peserta" });
      return;
    }
    mulaiSesi(ruang);
    res.json({ ok: true, sesi: ruang.sesi });
  } else if (ruang.status === "jeda_sesi") {
    const lanjut = mulaiSesiBerikutnya(ruang);
    if (!lanjut) {
      res.status(400).json({ error: "Tidak bisa lanjut ke sesi berikutnya" });
      return;
    }
    res.json({ ok: true, sesi: ruang.sesi });
  } else {
    res.status(400).json({ error: "Status ruang tidak memungkinkan untuk memulai" });
  }
});

// POST /api/kuis/jawab — peserta menjawab soal
router.post("/kuis/jawab", (req, res) => {
  const { kode, pemainId, pilihan } = req.body as {
    kode?: string;
    pemainId?: string;
    pilihan?: number;
  };
  if (!kode || !pemainId || pilihan === undefined) {
    res.status(400).json({ error: "kode, pemainId, dan pilihan diperlukan" });
    return;
  }
  const ruang = getRuang(kode);
  if (!ruang) {
    res.status(404).json({ error: "Ruang tidak ditemukan" });
    return;
  }
  cekDanMajuSoal(ruang);
  const berhasil = rekamJawaban(ruang, pemainId, pilihan);
  res.json({ ok: berhasil, pesan: berhasil ? "Jawaban tersimpan!" : "Terlambat atau sudah menjawab." });
});

// GET /api/kuis/status/:kode — polling status ruang
router.get("/kuis/status/:kode", (req, res) => {
  const { kode } = req.params;
  const pemainId = req.query["pemainId"] as string | undefined;

  const ruang = getRuang(kode ?? "");
  if (!ruang) {
    res.status(404).json({ error: "Ruang tidak ditemukan" });
    return;
  }

  // Auto-advance timer
  cekDanMajuSoal(ruang);

  const pemain = pemainId ? ruang.pemain.get(pemainId) : undefined;
  const isHost = pemainId ? ruang.hostId === pemainId : false;
  const peringkat = getPeringkat(ruang);
  const aktifCount = getPemainAktif(ruang).length;

  const base = {
    status: ruang.status,
    sesi: ruang.sesi,
    tingkat: ruang.tingkat,
    isHost,
    peringkat,
    pemainAktif: aktifCount,
    totalPemain: ruang.pemain.size,
    maks_lolos: MAKS_LOLOS[ruang.sesi],
  };

  if (ruang.status === "menunggu") {
    const daftarPemain = [...ruang.pemain.values()].map((p) => p.nama);
    res.json({ ...base, daftarPemain });
    return;
  }

  if (ruang.status === "berjalan") {
    const soal = ruang.soalList[ruang.soalIndex];
    const durasi = DURASI_BARENG[ruang.tingkat] * 1000;
    const waktuBerlalu = Date.now() - ruang.waktuSoalMulai;
    const waktuSisa = Math.max(0, Math.ceil((durasi - waktuBerlalu) / 1000));
    const sudahJawab = pemain ? pemain.jawaban[ruang.soalIndex] !== undefined : false;
    const jawabanSaya = pemain ? (pemain.jawaban[ruang.soalIndex] ?? null) : null;
    const aktif = pemain?.aktif ?? true;

    const sudahJawabCount = [...ruang.pemain.values()].filter(
      (p) => p.aktif && p.jawaban[ruang.soalIndex] !== undefined
    ).length;

    res.json({
      ...base,
      soalIndex: ruang.soalIndex,
      soal: soal
        ? {
            pertanyaan: soal.pertanyaan,
            pilihan: soal.pilihan,
            nomor: ruang.soalIndex + 1,
            total: ruang.soalList.length,
          }
        : null,
      waktuSisa,
      sudahJawab,
      jawabanSaya,
      aktif,
      sudahJawabCount,
    });
    return;
  }

  if (ruang.status === "jeda_sesi" || ruang.status === "selesai") {
    const lolos = pemain?.aktif ?? false;
    res.json({ ...base, lolos });
    return;
  }

  res.json(base);
});

// GET /api/kuis/soal-solo?tingkat=mudah&paket=1
router.get("/kuis/soal-solo", (req, res) => {
  const tingkat = req.query["tingkat"] as string;
  if (tingkat !== "mudah" && tingkat !== "sedang" && tingkat !== "sulit") {
    res.status(400).json({ error: "tingkat harus mudah, sedang, atau sulit" });
    return;
  }
  const paketRaw = parseInt(req.query["paket"] as string ?? "0", 10);
  const paket = [1, 2, 3, 4, 5].includes(paketRaw) ? (paketRaw as 1 | 2 | 3 | 4 | 5) : undefined;
  const jumlahRaw = parseInt(req.query["jumlah"] as string ?? "0", 10);
  const jumlah = jumlahRaw >= 3 && jumlahRaw <= 50 ? jumlahRaw : JUMLAH_SOLO[tingkat];
  const soal = getSoalSolo(tingkat, jumlah, paket).map((s) => ({
    id: s.id,
    pertanyaan: s.pertanyaan,
    pilihan: s.pilihan,
    jawaban: s.jawaban,
  }));
  res.json({ soal, durasi: DURASI_SOLO[tingkat] });
});

// POST /api/kuis/generate-soal — buat soal kuis otomatis dengan AI
router.post("/kuis/generate-soal", async (req, res) => {
  const { topik, jumlah } = req.body as { topik?: string; jumlah?: number };
  if (!topik || typeof topik !== "string" || topik.trim().length < 2) {
    res.status(400).json({ error: "topik diperlukan (minimal 2 karakter)" });
    return;
  }

  const baseUrl = process.env["AI_INTEGRATIONS_OPENROUTER_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENROUTER_API_KEY"];
  if (!baseUrl || !apiKey) {
    res.status(503).json({ error: "Fitur AI belum dikonfigurasi di server." });
    return;
  }

  const jumlahBersih = Math.min(Math.max(Number(jumlah) || 5, 3), 10);

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ baseURL: baseUrl, apiKey });

    const prompt = `Kamu adalah pembuat soal kuis untuk masyarakat desa Indonesia.
Buat ${jumlahBersih} soal pilihan ganda tentang topik: "${topik.trim()}".
Gunakan Bahasa Indonesia yang mudah dipahami oleh masyarakat umum.
Setiap soal harus memiliki TEPAT 3 pilihan jawaban.

Format output WAJIB berupa JSON array murni tanpa teks lain, tanpa markdown:
[
  {
    "pertanyaan": "Isi pertanyaannya di sini?",
    "pilihan": ["Pilihan A", "Pilihan B", "Pilihan C"],
    "jawaban": 0
  }
]
"jawaban" adalah index (0, 1, atau 2) dari pilihan yang benar. Buat soal yang bervariasi dan menarik.`;

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3.6-flash",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8192,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Format respons AI tidak valid, coba lagi." });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      pertanyaan: string;
      pilihan: string[];
      jawaban: number;
    }>;

    const soal: SoalKustom[] = parsed
      .filter(s => s.pertanyaan && Array.isArray(s.pilihan) && s.pilihan.length === 3)
      .map((s, i) => ({
        id: `ai-${Date.now()}-${i}`,
        pertanyaan: String(s.pertanyaan).trim(),
        pilihan: [String(s.pilihan[0]).trim(), String(s.pilihan[1]).trim(), String(s.pilihan[2]).trim()],
        jawaban: ([0, 1, 2].includes(s.jawaban) ? s.jawaban : 0) as 0 | 1 | 2,
      }));

    if (soal.length === 0) {
      res.status(500).json({ error: "AI tidak menghasilkan soal valid, coba topik lain." });
      return;
    }

    res.json({ soal });
  } catch (err) {
    req.log.error(err, "generate-soal error");
    res.status(500).json({ error: "Gagal membuat soal. Coba lagi." });
  }
});

export default router;
