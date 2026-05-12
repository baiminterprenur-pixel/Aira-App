import React, { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useGetOpenrouterConversation, getGetOpenrouterConversationQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Sparkles, Loader2, RefreshCw, Brain, TrendingUp,
  AlertCircle, Lightbulb, Heart, Shield, Target, Star, MessageCircle, Zap, BarChart2
} from "lucide-react";
import { ALL_TESTS } from "@/data/tests";

interface PolaPikir {
  nama: string;
  contoh: string;
  dampak: string;
  caraPerbaikan: string;
}

interface KeyakinanMembatasi {
  keyakinan: string;
  realita: string;
  kalimatBaru: string;
}

interface LangkahAksi {
  langkah: string;
  alasan: string;
  caraMulai: string;
}

interface Wellbeing {
  stres: number;
  tidur: number;
  emosi: number;
  produktivitas: number;
  optimisme: number;
}

interface AnalysisResult {
  ringkasan: string;
  kondisiEmosional: string;
  skorKesehatan: number;
  polaPikir: PolaPikir[];
  keyakinanMembatasi: KeyakinanMembatasi[];
  kekuatanTerdeteksi: string[];
  areaTumbuh: string[];
  rekomendasi: LangkahAksi[];
  pesanUntukDiri: string;
  wellbeing?: Wellbeing;
}

const CACHE_PREFIX = "refleksi_analisis_v2_";

function loadCached(id: number): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCache(id: number, data: AnalysisResult) {
  try { localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(data)); } catch {}
}

function saveWellbeing(convId: number, title: string, date: string, wb: Wellbeing) {
  try {
    localStorage.setItem(`refleksi_wb_${convId}`, JSON.stringify({ convId, title, date, ...wb }));
  } catch {}
}

function getStoredTestResults() {
  try { return JSON.parse(localStorage.getItem("refleksi_test_results") || "{}"); } catch { return {}; }
}

async function generateAnalysis(conversationId: number, messages: { role: string; content: string }[]): Promise<AnalysisResult> {
  const allMessages = messages
    .map((m) => `[${m.role === "user" ? "PENGGUNA" : "REVA"}]: ${m.content}`)
    .join("\n---\n");

  if (!messages.some((m) => m.role === "user" && m.content.trim())) {
    throw new Error("Belum ada percakapan untuk dianalisis");
  }

  const prompt = `Berikut adalah percakapan lengkap antara pengguna dan Reva (teman curhat AI):

${allMessages}

---
Buatkan analisis psikologi yang SANGAT MENDALAM dan JUJUR untuk membantu pengguna ini tumbuh dan memperbaiki diri. Fokus utama: POLA PIKIR apa yang perlu diperbaiki dan BAGAIMANA cara memperbaikinya secara konkret.

Berikan respons dalam format JSON berikut (tanpa kode blok, tanpa markdown, hanya JSON murni):
{
  "ringkasan": "Gambaran menyeluruh kondisi pengguna dalam 3-4 kalimat — jujur tapi hangat. Sebutkan hal yang paling menonjol dari percakapan ini.",
  "kondisiEmosional": "Deskripsikan kondisi perasaan dan pikiran pengguna saat ini — apa yang mereka rasakan, apa yang sedang mereka hadapi, dan kira-kira mengapa.",
  "skorKesehatan": 7,
  "polaPikir": [
    {
      "nama": "Nama pola pikir yang perlu diperbaiki — singkat, max 5 kata, pakai bahasa biasa",
      "contoh": "Contoh nyata dari percakapan yang menunjukkan pola ini — kutip atau parafrase kalimat mereka",
      "dampak": "Apa dampak pola pikir ini ke kehidupan mereka sehari-hari jika dibiarkan terus",
      "caraPerbaikan": "Langkah konkret yang bisa dilakukan untuk mengubah pola ini — spesifik, bisa langsung dicoba, bukan nasihat umum"
    },
    {
      "nama": "pola 2",
      "contoh": "...",
      "dampak": "...",
      "caraPerbaikan": "..."
    },
    {
      "nama": "pola 3",
      "contoh": "...",
      "dampak": "...",
      "caraPerbaikan": "..."
    }
  ],
  "keyakinanMembatasi": [
    {
      "keyakinan": "Keyakinan yang membatasi yang terdeteksi dari ucapan pengguna — seperti 'aku memang nggak bisa', 'orang seperti aku susah sukses', dll",
      "realita": "Kenyataan yang lebih akurat dan berimbang tentang situasi mereka",
      "kalimatBaru": "Kalimat yang lebih sehat untuk menggantikan keyakinan lama — yang masih terasa nyata dan tidak lebay"
    },
    {
      "keyakinan": "keyakinan 2",
      "realita": "...",
      "kalimatBaru": "..."
    }
  ],
  "kekuatanTerdeteksi": [
    "Kelebihan atau nilai positif yang terlihat dari cara mereka bicara, bersikap, atau berpikir — spesifik dari percakapan",
    "kekuatan 2",
    "kekuatan 3"
  ],
  "areaTumbuh": [
    "Area yang bisa dikembangkan — sampaikan sebagai peluang menarik, bukan kekurangan. Jelaskan mengapa ini penting untuk mereka.",
    "area 2",
    "area 3"
  ],
  "rekomendasi": [
    {
      "langkah": "Nama langkah aksi yang jelas dan singkat",
      "alasan": "Mengapa langkah ini penting khusus untuk pengguna ini — berdasarkan apa yang mereka ceritakan",
      "caraMulai": "Cara memulainya hari ini atau besok — sangat spesifik dan sederhana"
    },
    {
      "langkah": "langkah 2",
      "alasan": "...",
      "caraMulai": "..."
    },
    {
      "langkah": "langkah 3",
      "alasan": "...",
      "caraMulai": "..."
    },
    {
      "langkah": "langkah 4",
      "alasan": "...",
      "caraMulai": "..."
    }
  ],
  "pesanUntukDiri": "Pesan personal yang hangat dan jujur untuk pengguna ini — seperti surat dari teman yang benar-benar mengenal mereka. 3-4 kalimat. Harus terasa personal, bukan template.",
  "wellbeing": {
    "stres": 6,
    "tidur": 5,
    "emosi": 7,
    "produktivitas": 6,
    "optimisme": 5
  }
}

CATATAN:
- skorKesehatan adalah angka 1-10 menggambarkan kondisi kesehatan pikiran pengguna (1=sangat berat, 10=sangat sehat). Jujur.
- wellbeing: estimasi berdasarkan percakapan, skala 1-10:
  • stres: 10=sangat tenang/tidak stres, 1=sangat stres berat
  • tidur: 10=tidur sangat baik dan cukup, 1=sangat buruk/tidak tidur
  • emosi: 10=emosi sangat stabil dan terkendali, 1=sangat tidak stabil
  • produktivitas: 10=sangat produktif, 1=tidak produktif sama sekali
  • optimisme: 10=sangat optimis tentang masa depan, 1=sangat pesimis
  Kalau tidak ada informasi yang cukup tentang salah satu indikator, berikan estimasi tengah (5-6).`;

  const baseUrl = import.meta.env.BASE_URL || "/refleksi/";
  const apiBase = baseUrl.replace(/\/$/, "").replace("/refleksi", "");
  const resp = await fetch(`${apiBase}/api/openrouter/conversations/${conversationId}/analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!resp.ok) throw new Error("Gagal membuat analisis");
  const data = await resp.json();
  if (data.error) throw new Error(data.error);
  return data as AnalysisResult;
}

const WB_ITEMS = [
  { key: "stres" as const,         label: "Ketenangan",    color: "bg-teal-400",   desc: "tidak stres" },
  { key: "tidur" as const,         label: "Tidur",         color: "bg-violet-400", desc: "kualitas tidur" },
  { key: "emosi" as const,         label: "Stabilitas",    color: "bg-rose-400",   desc: "emosi stabil" },
  { key: "produktivitas" as const, label: "Produktivitas", color: "bg-amber-400",  desc: "produktif" },
  { key: "optimisme" as const,     label: "Optimisme",     color: "bg-blue-400",   desc: "optimis" },
];

function WellbeingBars({ wb }: { wb: { stres: number; tidur: number; emosi: number; produktivitas: number; optimisme: number } }) {
  return (
    <div className="space-y-3">
      {WB_ITEMS.map((item, i) => {
        const val = wb[item.key];
        const pct = (Math.min(Math.max(val, 1), 10) / 10) * 100;
        const label = val <= 3 ? "Perlu perhatian" : val <= 5 ? "Cukup berat" : val <= 7 ? "Cukup baik" : "Baik";
        return (
          <div key={item.key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-white/60 text-xs">{item.label}</span>
                <span className="text-white/30 text-[10px]">({item.desc})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-[10px]">{label}</span>
                <span className="text-white font-semibold text-sm">{val}<span className="text-white/30 text-[10px] font-normal">/10</span></span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 1), 10) * 10;
  const color = score <= 3 ? "bg-red-400" : score <= 5 ? "bg-amber-400" : score <= 7 ? "bg-blue-400" : "bg-green-400";
  const label = score <= 3 ? "Perlu banyak perhatian" : score <= 5 ? "Cukup berat, perlu diurus" : score <= 7 ? "Cukup baik, ada ruang tumbuh" : "Kondisi cukup sehat";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-xs">Kondisi pikiran saat ini</span>
        <span className="text-white font-bold text-lg">{score}<span className="text-white/40 text-sm font-normal">/10</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function Laporan() {
  const [, params] = useRoute("/laporan/:id");
  const conversationId = Number(params?.id);
  const { data: conversation, isLoading } = useGetOpenrouterConversation(conversationId, {
    query: { enabled: !!conversationId, queryKey: getGetOpenrouterConversationQueryKey(conversationId) },
  });

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const stored = getStoredTestResults();
  const takenTests = ALL_TESTS.filter((t) => stored[t.id]);

  useEffect(() => {
    if (conversationId) {
      const cached = loadCached(conversationId);
      if (cached) setAnalysis(cached);
    }
  }, [conversationId]);

  const handleAnalyze = async (force = false) => {
    if (!conversation?.messages) return;
    if (!force && analysis) return;
    setIsAnalyzing(true);
    setError("");
    try {
      const result = await generateAnalysis(conversationId, conversation.messages);
      saveCache(conversationId, result);
      if (result.wellbeing) {
        saveWellbeing(conversationId, conversation.title || "Sesi", new Date().toISOString(), result.wellbeing);
      }
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || "Gagal membuat analisis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const messages = conversation?.messages ?? [];
  const userMessageCount = messages.filter((m: any) => m.role === "user").length;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <div className="pointer-events-none fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />

      <header className="h-16 flex items-center px-5 border-b border-white/5 relative z-10 flex-shrink-0">
        <Link href="/sessions" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors mr-3">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-white">Analisis Psikologi</h1>
          <p className="text-xs text-white/40 truncate">{conversation?.title || "Sesi"}</p>
        </div>
        {analysis && (
          <button
            onClick={() => handleAnalyze(true)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10"
          >
            {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Perbarui
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-5 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Info Sesi */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 text-sm text-white/50">
            <span>💬 {userMessageCount} pesan kamu</span>
            <span>📅 {conversation?.createdAt ? new Date(conversation.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
          </div>

          {/* Generate / Loading state */}
          {!analysis && !isAnalyzing && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/5 border border-primary/20 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-white font-serif text-xl mb-2">Analisis Psikologi Mendalam</h2>
              <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                {userMessageCount === 0
                  ? "Belum ada percakapan untuk dianalisis. Mulai ngobrol dengan Reva dulu ya."
                  : `AI akan menganalisis ${userMessageCount} pesanmu — mencari pola pikir, keyakinan yang membatasi, dan cara konkret untuk memperbaikinya.`}
              </p>
              {userMessageCount > 0 && (
                <button
                  onClick={() => handleAnalyze(true)}
                  className="h-12 px-10 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all flex items-center gap-2 mx-auto shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Mulai Analisis
                </button>
              )}
              {error && <p className="text-red-400 text-xs mt-4">{error}</p>}
            </div>
          )}

          {isAnalyzing && (
            <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-white/60 text-sm">Sedang menganalisis pola pikir dan kondisi mentalmu...</p>
              <p className="text-white/30 text-xs mt-1">Ini butuh sekitar 15–30 detik</p>
            </div>
          )}

          {/* Analysis Result */}
          <AnimatePresence>
            {analysis && !isAnalyzing && (
              <motion.div initial="hidden" animate="show" className="space-y-4">

                {/* Ringkasan + Skor */}
                <motion.div custom={0} variants={fadeUp} className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-violet-500/5 border border-primary/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-widest">Gambaran Keseluruhan</h3>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed font-serif">{analysis.ringkasan}</p>
                  {typeof analysis.skorKesehatan === "number" && (
                    <div className="pt-1">
                      <ScoreBar score={analysis.skorKesehatan} />
                    </div>
                  )}
                </motion.div>

                {/* Kondisi Emosional */}
                <motion.div custom={1} variants={fadeUp} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-widest">Kondisi Saat Ini</h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{analysis.kondisiEmosional}</p>
                </motion.div>

                {/* Wellbeing Indicators */}
                {analysis.wellbeing && (
                  <motion.div custom={1.5} variants={fadeUp} className="rounded-2xl overflow-hidden border border-white/10">
                    <div className="px-5 py-4 bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Indikator Wellbeing</h3>
                      </div>
                      <Link href="/grafik">
                        <span className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
                          <BarChart2 className="w-3 h-3" />
                          Lihat grafik
                        </span>
                      </Link>
                    </div>
                    <div className="p-5">
                      <WellbeingBars wb={analysis.wellbeing} />
                    </div>
                  </motion.div>
                )}

                {/* Pola Pikir — MAIN SECTION */}
                {analysis.polaPikir?.length > 0 && (
                  <motion.div custom={2} variants={fadeUp} className="rounded-2xl overflow-hidden border border-amber-400/20">
                    <div className="px-5 py-4 bg-amber-400/10 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Pola Pikir yang Perlu Diperbaiki</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {analysis.polaPikir.map((p, i) => (
                        <div key={i} className="p-5 bg-white/[0.02] space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-400 font-bold text-xs mt-0.5">{i + 1}</span>
                            <h4 className="text-white font-medium text-sm">{p.nama}</h4>
                          </div>
                          {p.contoh && (
                            <div className="ml-9 px-3 py-2 rounded-lg bg-white/5 border-l-2 border-white/20">
                              <p className="text-white/50 text-xs italic">"{p.contoh}"</p>
                            </div>
                          )}
                          <div className="ml-9 space-y-2">
                            <div className="flex gap-2 items-start">
                              <span className="text-red-400/80 text-xs mt-0.5 flex-shrink-0">⚠</span>
                              <p className="text-white/55 text-xs leading-relaxed">{p.dampak}</p>
                            </div>
                            <div className="flex gap-2 items-start p-3 rounded-lg bg-green-400/5 border border-green-400/15">
                              <Zap className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-green-400 text-xs font-medium mb-1">Cara memperbaikinya:</p>
                                <p className="text-white/70 text-xs leading-relaxed">{p.caraPerbaikan}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Keyakinan yang Membatasi */}
                {analysis.keyakinanMembatasi?.length > 0 && (
                  <motion.div custom={3} variants={fadeUp} className="rounded-2xl overflow-hidden border border-violet-400/20">
                    <div className="px-5 py-4 bg-violet-400/10 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-400" />
                      <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Keyakinan yang Membatasi</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {analysis.keyakinanMembatasi.map((k, i) => (
                        <div key={i} className="p-5 bg-white/[0.02] space-y-3">
                          <div className="p-3 rounded-lg bg-red-400/5 border border-red-400/15">
                            <p className="text-xs text-red-400/70 mb-1">Yang sering kamu pikirkan:</p>
                            <p className="text-white/70 text-sm italic">"{k.keyakinan}"</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Kenyataannya:</p>
                            <p className="text-white/65 text-sm leading-relaxed">{k.realita}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-400/5 border border-green-400/15">
                            <p className="text-xs text-green-400/80 mb-1">Coba ganti dengan:</p>
                            <p className="text-white/80 text-sm font-medium">"{k.kalimatBaru}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Kekuatan */}
                {analysis.kekuatanTerdeteksi?.length > 0 && (
                  <motion.div custom={4} variants={fadeUp} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-green-400" />
                      <h3 className="text-xs font-semibold text-green-400 uppercase tracking-widest">Kekuatanmu yang Terlihat</h3>
                    </div>
                    <div className="space-y-2">
                      {analysis.kekuatanTerdeteksi.map((k, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-green-400 flex-shrink-0 text-sm">✓</span>
                          <p className="text-white/70 text-sm leading-relaxed">{k}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Area Tumbuh */}
                {analysis.areaTumbuh?.length > 0 && (
                  <motion.div custom={5} variants={fadeUp} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Peluang untuk Tumbuh</h3>
                    </div>
                    <div className="space-y-2">
                      {analysis.areaTumbuh.map((a, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-blue-400 flex-shrink-0">→</span>
                          <p className="text-white/70 text-sm leading-relaxed">{a}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Rekomendasi Aksi */}
                {analysis.rekomendasi?.length > 0 && (
                  <motion.div custom={6} variants={fadeUp} className="rounded-2xl overflow-hidden border border-yellow-400/20">
                    <div className="px-5 py-4 bg-yellow-400/10 flex items-center gap-2">
                      <Target className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Langkah Konkret untuk Berubah</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {analysis.rekomendasi.map((r, i) => (
                        <div key={i} className="p-5 bg-white/[0.02] space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-yellow-400/15 flex items-center justify-center text-yellow-400 font-bold text-sm flex-shrink-0">{i + 1}</span>
                            <h4 className="text-white font-medium text-sm">{r.langkah}</h4>
                          </div>
                          {r.alasan && (
                            <p className="ml-10 text-white/45 text-xs leading-relaxed">{r.alasan}</p>
                          )}
                          {r.caraMulai && (
                            <div className="ml-10 flex gap-2 items-start p-2.5 rounded-lg bg-yellow-400/5 border border-yellow-400/10">
                              <Lightbulb className="w-3.5 h-3.5 text-yellow-400/80 flex-shrink-0 mt-0.5" />
                              <p className="text-white/65 text-xs leading-relaxed">{r.caraMulai}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Pesan Untuk Diri */}
                {analysis.pesanUntukDiri && (
                  <motion.div custom={7} variants={fadeUp} className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent border border-primary/15">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-semibold text-primary uppercase tracking-widest">Pesan untuk Kamu</h3>
                    </div>
                    <p className="text-white/80 text-sm leading-loose font-serif italic">"{analysis.pesanUntukDiri}"</p>
                  </motion.div>
                )}

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Results Summary */}
          {takenTests.length > 0 && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Hasil Tes Diri</h3>
              <div className="space-y-2">
                {takenTests.map((test) => {
                  const data = stored[test.id];
                  return (
                    <Link key={test.id} href={`/tes/${test.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                        <span className="text-xl">{test.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/40">{test.title}</p>
                          <p className="text-sm text-white truncate">{data.result.title}</p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-white/30 rotate-180 flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
              {takenTests.length < ALL_TESTS.length && (
                <Link href="/tes">
                  <p className="text-center text-xs text-primary/70 mt-3 hover:text-primary transition-colors">
                    + {ALL_TESTS.length - takenTests.length} tes belum dikerjakan
                  </p>
                </Link>
              )}
            </div>
          )}

          {takenTests.length === 0 && analysis && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/40 text-sm mb-2">Belum ada tes yang diselesaikan</p>
              <Link href="/tes">
                <button className="text-xs text-primary hover:text-primary/80 transition-colors">Mulai Tes Diri →</button>
              </Link>
            </div>
          )}

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
