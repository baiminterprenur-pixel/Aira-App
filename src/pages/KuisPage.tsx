import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL;
function apiUrl(path: string) { return `${BASE}api${path}`; }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// ===== TYPES =====
type Mode = "pilih" | "multi" | "solo" | "buat_soal";
type LayarMulti = "home" | "lobby" | "bermain" | "jeda_sesi" | "selesai";
type LayarSolo = "pilih_tingkat" | "bermain" | "selesai" | "pilih_paket";
type TingkatSolo = "mudah" | "sedang" | "sulit";
type PaketSolo = 1 | 2 | 3 | 4 | 5;

interface SoalKustom {
  id: string;
  pertanyaan: string;
  pilihan: [string, string, string];
  jawaban: 0 | 1 | 2;
}
const SOAL_KUSTOM_KEY = "aira_soal_kustom";
function getSoalKustom(): SoalKustom[] {
  try { return JSON.parse(localStorage.getItem(SOAL_KUSTOM_KEY) || "[]"); } catch { return []; }
}
function saveSoalKustom(soal: SoalKustom[]) {
  localStorage.setItem(SOAL_KUSTOM_KEY, JSON.stringify(soal));
}

interface PeringkatItem { peringkat: number; nama: string; skor: number; aktif: boolean; id: string; }
type TingkatBareng = "mudah" | "sedang" | "sulit";

interface StatusResponse {
  status: string; sesi: number; tingkat?: TingkatBareng; isHost: boolean;
  peringkat: PeringkatItem[]; pemainAktif: number; totalPemain: number;
  maks_lolos: number; daftarPemain?: string[];
  soalIndex?: number;
  soal?: { pertanyaan: string; pilihan: string[]; nomor: number; total: number; };
  waktuSisa?: number; sudahJawab?: boolean; jawabanSaya?: number | null; aktif?: boolean; lolos?: boolean;
  sudahJawabCount?: number;
}

const DURASI_BARENG: Record<TingkatBareng, number> = { mudah: 5, sedang: 6, sulit: 7 };
const LABEL_BARENG: Record<TingkatBareng, string> = { mudah: "Mudah", sedang: "Sedang", sulit: "Sulit" };
const WARNA_BARENG: Record<TingkatBareng, string> = {
  mudah: "linear-gradient(135deg,#16a34a,#4ade80)",
  sedang: "linear-gradient(135deg,#d97706,#fbbf24)",
  sulit: "linear-gradient(135deg,#dc2626,#f87171)",
};
interface SoalSoloClient { id: string; pertanyaan: string; pilihan: [string, string, string]; jawaban: 0 | 1 | 2; }

const MEDAL = ["🥇", "🥈", "🥉"];
const WARNA_TINGKAT: Record<TingkatSolo, string> = {
  mudah: "linear-gradient(135deg, #16a34a, #4ade80)",
  sedang: "linear-gradient(135deg, #d97706, #fbbf24)",
  sulit: "linear-gradient(135deg, #dc2626, #f87171)",
};
const LABEL_TINGKAT: Record<TingkatSolo, string> = { mudah: "Mudah", sedang: "Sedang", sulit: "Sulit" };

const PAKET_INFO: Record<PaketSolo, { emoji: string; nama: string; deskripsi: string; warna: string }> = {
  1: { emoji: "🎲", nama: "Campuran", deskripsi: "Semua topik acak", warna: "linear-gradient(135deg,#6366f1,#818cf8)" },
  2: { emoji: "🏛️", nama: "Sejarah & Pahlawan", deskripsi: "Sejarah kemerdekaan Indonesia", warna: "linear-gradient(135deg,#a50d1c,#CE1126)" },
  3: { emoji: "🗺️", nama: "Geografi & Alam", deskripsi: "Alam dan wilayah Indonesia", warna: "linear-gradient(135deg,#0369a1,#38bdf8)" },
  4: { emoji: "🔢", nama: "Matematika & Sains", deskripsi: "Berhitung dan ilmu pengetahuan", warna: "linear-gradient(135deg,#d97706,#fbbf24)" },
  5: { emoji: "🌾", nama: "Desa & Budaya", deskripsi: "Kehidupan desa dan budaya nusantara", warna: "linear-gradient(135deg,#16a34a,#4ade80)" },
};

const BABAK_INFO = [
  { babak: 1, soal: 30, waktu: 30, lolos: 15 },
  { babak: 2, soal: 20, waktu: 25, lolos: 8 },
  { babak: 3, soal: 10, waktu: 20, lolos: 5 },
  { babak: 4, soal: 8, waktu: 15, lolos: 3 },
  { babak: 5, soal: 5, waktu: 10, lolos: 0 },
];

// ===== HEADER KOMPONEN =====
function KuisHeader({ judul, sub, kanan }: { judul: string; sub?: string; kanan?: React.ReactNode }) {
  return (
    <header className="shrink-0 px-4 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 60%, #e8192c 100%)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{judul}</h1>
          {sub && <p className="text-xs mt-0.5" style={{ color: "rgba(255,220,220,0.85)" }}>{sub}</p>}
        </div>
        <div className="flex items-center gap-2">{kanan}</div>
      </div>
    </header>
  );
}

// ===== MAIN COMPONENT =====
export default function KuisPage() {
  const [mode, setMode] = useState<Mode>("pilih");
  const [multiInitKustom, setMultiInitKustom] = useState(false);

  function goToMultiKustom() {
    setMultiInitKustom(true);
    setMode("multi");
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fff8f8 0%, #fff0f0 100%)" }}>
      {mode === "pilih" && <PilihMode onPilih={setMode} />}
      {mode === "multi" && (
        <ModuMulti
          onBack={() => { setMultiInitKustom(false); setMode("pilih"); }}
          initialPakaiSoalKustom={multiInitKustom}
        />
      )}
      {mode === "solo" && <ModuSolo onBack={() => setMode("pilih")} />}
      {mode === "buat_soal" && (
        <BuatSoal onBack={() => setMode("pilih")} onMainkanBareng={goToMultiKustom} />
      )}
    </div>
  );
}

// ===== PILIH MODE =====
function PilihMode({ onPilih }: { onPilih: (m: Mode) => void }) {
  return (
    <>
      <KuisHeader judul="🎯 Kuis Desa" sub="Uji pengetahuanmu, raih juara!"
        kanan={
          <Link href="/" className="text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
            💬 Chat
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        <button onClick={() => onPilih("solo")}
          className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg flex flex-col items-center gap-1"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}>
          <span className="text-3xl">🧑‍💻</span>
          <span>Kuis Solo</span>
          <span className="text-xs font-normal opacity-80">5 paket tema · 3 tingkat kesulitan</span>
        </button>

        <button onClick={() => onPilih("multi")}
          className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg flex flex-col items-center gap-1"
          style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>
          <span className="text-3xl">👥</span>
          <span>Kuis Bareng</span>
          <span className="text-xs font-normal opacity-80">Multiplayer · 5 babak eliminasi</span>
        </button>

        <button onClick={() => onPilih("buat_soal")}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex flex-col items-center gap-1"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>
          <span className="text-3xl">✏️</span>
          <span>Buat Soal Sendiri</span>
          <span className="text-xs font-normal opacity-80">Buat pertanyaan &amp; jawaban kustom</span>
        </button>

        {/* Info Paket Solo */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border text-sm" style={{ borderColor: "#dbeafe" }}>
          <p className="font-bold text-gray-700 mb-2">🎲 5 Paket Soal Kuis Solo</p>
          {([1,2,3,4,5] as PaketSolo[]).map((p) => (
            <div key={p} className="flex items-center gap-2 py-1 text-xs border-b last:border-0" style={{ borderColor: "#eff6ff" }}>
              <span className="text-base">{PAKET_INFO[p].emoji}</span>
              <span className="font-semibold text-gray-700">{PAKET_INFO[p].nama}</span>
              <span className="ml-auto text-gray-400">{PAKET_INFO[p].deskripsi}</span>
            </div>
          ))}
        </div>

        {/* Info Babak Bareng */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border text-sm" style={{ borderColor: "#fdd5d8" }}>
          <p className="font-bold text-gray-700 mb-2">📋 Kuis Bareng — 5 Babak Eliminasi</p>
          {BABAK_INFO.map((b) => (
            <div key={b.babak} className="flex items-center gap-2 py-1 border-b last:border-0 text-xs" style={{ borderColor: "#fef2f2" }}>
              <span className="w-16 font-bold" style={{ color: "#a50d1c" }}>Babak {b.babak}</span>
              <span className="text-gray-600">{b.soal} soal · 5-7dtk/soal</span>
              <span className="ml-auto font-semibold" style={{ color: b.lolos === 0 ? "#a50d1c" : "#6b7280" }}>
                {b.lolos === 0 ? "🏆 Final" : `Top ${b.lolos} lolos`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ===== MODE SOLO =====
function ModuSolo({ onBack }: { onBack: () => void }) {
  const [layar, setLayar] = useState<LayarSolo>("pilih_tingkat");
  const [tingkat, setTingkat] = useState<TingkatSolo>("mudah");
  const [paket, setPaket] = useState<PaketSolo>(1);
  const [soalList, setSoalList] = useState<SoalSoloClient[]>([]);
  const [indeks, setIndeks] = useState(0);
  const [skorBenar, setSkorBenar] = useState(0);
  const [jawabanDipilih, setJawabanDipilih] = useState<number | null>(null);
  const [feedbackBenar, setFeedbackBenar] = useState<boolean | null>(null);
  const [waktuSisa, setWaktuSisa] = useState(30);
  const [loading, setLoading] = useState(false);
  const [isKustom, setIsKustom] = useState(false);
  const [isAISolo, setIsAISolo] = useState(false);
  const [soloJudul, setSoloJudul] = useState<{ emoji: string; nama: string }>({ emoji: "🎲", nama: "Campuran" });
  const [topikAISolo, setTopikAISolo] = useState("");
  const [jumlahAISolo, setJumlahAISolo] = useState(5);
  const [loadingAISolo, setLoadingAISolo] = useState(false);
  const [errorAISolo, setErrorAISolo] = useState("");
  const [durasiCustom, setDurasiCustom] = useState(10);
  const [jumlahCustom, setJumlahCustom] = useState(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soalSekarang = soalList[indeks];
  const totalSoal = soalList.length;

  const majuSoal = useCallback((benar: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSkorBenar(prev => benar ? prev + 1 : prev);
    setJawabanDipilih(null);
    setFeedbackBenar(null);
    setIndeks(prev => {
      if (prev + 1 >= soalList.length) {
        setLayar("selesai");
        return prev;
      }
      return prev + 1;
    });
  }, [soalList.length]);

  const prosesJawaban = useCallback((pilihan: number) => {
    if (jawabanDipilih !== null || !soalSekarang) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const benar = pilihan === soalSekarang.jawaban;
    setJawabanDipilih(pilihan);
    setFeedbackBenar(benar);
    feedbackRef.current = setTimeout(() => majuSoal(benar), 1500);
  }, [jawabanDipilih, soalSekarang, majuSoal]);

  useEffect(() => {
    if (layar !== "bermain" || jawabanDipilih !== null) return;
    setWaktuSisa(durasiCustom);
    timerRef.current = setInterval(() => {
      setWaktuSisa(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setJawabanDipilih(-1);
          setFeedbackBenar(false);
          feedbackRef.current = setTimeout(() => majuSoal(false), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [layar, indeks, jawabanDipilih, durasiCustom, majuSoal]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
  }, []);

  async function mulaiSolo(t: TingkatSolo, p: PaketSolo) {
    setLoading(true);
    setTingkat(t);
    setPaket(p);
    setIsKustom(false);
    try {
      const res = await fetch(apiUrl(`/kuis/soal-solo?tingkat=${t}&paket=${p}&jumlah=${jumlahCustom}`));
      const data = (await res.json()) as { soal: SoalSoloClient[] };
      setSoalList(data.soal);
      setIndeks(0); setSkorBenar(0); setJawabanDipilih(null); setFeedbackBenar(null);
      setLayar("bermain");
    } catch { alert("Gagal memuat soal. Coba lagi."); }
    finally { setLoading(false); }
  }

  function mulaiKustom() {
    const kustom = getSoalKustom();
    if (kustom.length === 0) {
      alert("Belum ada soal kustom! Buat dulu di menu 'Buat Soal Sendiri'.");
      return;
    }
    const shuffled = [...kustom].sort(() => Math.random() - 0.5) as SoalSoloClient[];
    setSoalList(shuffled);
    setTingkat("mudah");
    setIsKustom(true);
    setIsAISolo(false);
    setSoloJudul({ emoji: "✏️", nama: "Soal Buatan Sendiri" });
    setIndeks(0); setSkorBenar(0); setJawabanDipilih(null); setFeedbackBenar(null);
    setLayar("bermain");
  }

  async function mulaiSoloAI() {
    if (!topikAISolo.trim()) { setErrorAISolo("Isi topik soal dulu!"); return; }
    setLoadingAISolo(true); setErrorAISolo("");
    try {
      const res = await fetch(apiUrl("/kuis/generate-soal"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topik: topikAISolo.trim(), jumlah: jumlahAISolo }),
      });
      const data = await res.json() as { soal?: SoalSoloClient[]; error?: string };
      if (!res.ok || !data.soal || data.soal.length === 0) {
        setErrorAISolo(data.error ?? "Gagal membuat soal. Coba lagi.");
        return;
      }
      const topikLabel = topikAISolo.trim();
      setSoalList(data.soal);
      setTingkat("mudah");
      setIsKustom(true);
      setIsAISolo(true);
      setSoloJudul({ emoji: "✨", nama: topikLabel });
      setIndeks(0); setSkorBenar(0); setJawabanDipilih(null); setFeedbackBenar(null);
      setLayar("bermain");
    } catch {
      setErrorAISolo("Koneksi gagal. Coba lagi.");
    } finally {
      setLoadingAISolo(false);
    }
  }

  // --- Pilih Tingkat ---
  if (layar === "pilih_tingkat") {
    const jumlahKustom = getSoalKustom().length;
    return (
      <>
        <KuisHeader judul="🧑‍💻 Kuis Solo" sub="Pilih tingkat kesulitan"
          kanan={<button onClick={onBack} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>← Kembali</button>} />
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Card: Pengaturan Kuis */}
          <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm border-2" style={{ borderColor: "#d8b4fe", background: "linear-gradient(135deg,#fdf4ff,#f3e8ff)" }}>
            <p className="text-sm font-black" style={{ color: "#7c3aed" }}>⚙️ Pengaturan Kuis</p>
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#6d28d9" }}>⏱ Waktu per soal</p>
              <div className="flex gap-1.5">
                {[3, 5, 10, 15, 20, 30].map(d => (
                  <button key={d} onClick={() => setDurasiCustom(d)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: durasiCustom === d ? "#7c3aed" : "white",
                      color: durasiCustom === d ? "white" : "#7c3aed",
                      border: `2px solid ${durasiCustom === d ? "#7c3aed" : "#d8b4fe"}`,
                    }}>
                    {d}s
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#6d28d9" }}>📝 Jumlah soal (paket bawaan)</p>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setJumlahCustom(n)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: jumlahCustom === n ? "#7c3aed" : "white",
                      color: jumlahCustom === n ? "white" : "#7c3aed",
                      border: `2px solid ${jumlahCustom === n ? "#7c3aed" : "#d8b4fe"}`,
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-1" style={{ color: "#9d4ed6" }}>
                *Pengaturan ini berlaku untuk Paket Soal Bawaan &amp; Soal Buatan Sendiri
              </p>
            </div>
          </div>

          {/* Card: Minta Aira Buatkan Soal (AI) */}
          <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-md border-2" style={{ borderColor: "#bae6fd", background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <p className="text-sm font-black" style={{ color: "#0284c7" }}>Minta Aira Buatkan Soal</p>
            </div>
            <input
              value={topikAISolo}
              onChange={e => setTopikAISolo(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loadingAISolo && mulaiSoloAI()}
              placeholder="Ketik topik soal... (contoh: Pertanian, Sejarah)"
              className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              style={{ background: "white", border: "2px solid #bae6fd", color: "#0c4a6e", fontSize: "16px" }}
              disabled={loadingAISolo}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold shrink-0" style={{ color: "#0369a1" }}>Jumlah:</span>
              {[3, 5, 7, 10].map(n => (
                <button key={n} onClick={() => setJumlahAISolo(n)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: jumlahAISolo === n ? "#0284c7" : "white",
                    color: jumlahAISolo === n ? "white" : "#0369a1",
                    border: jumlahAISolo === n ? "2px solid #0284c7" : "2px solid #bae6fd",
                  }}>
                  {n}
                </button>
              ))}
            </div>
            {errorAISolo && <p className="text-xs text-red-600 font-semibold">{errorAISolo}</p>}
            <button onClick={mulaiSoloAI} disabled={loadingAISolo || !topikAISolo.trim()}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50 shadow-sm"
              style={{ background: "linear-gradient(135deg,#0284c7,#0ea5e9)" }}>
              {loadingAISolo ? "⏳ Aira sedang membuat soal..." : "🚀 Generate & Langsung Main"}
            </button>
          </div>

          {/* Soal Kustom Card */}
          <div className="rounded-2xl overflow-hidden shadow-md border-2" style={{ borderColor: "#7c3aed" }}>
            <div className="py-3 px-4 text-white font-bold flex items-center gap-2" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
              <span className="text-2xl">✏️</span>
              <div>
                <div className="text-base">Soal Buatan Sendiri</div>
                <div className="text-xs font-normal opacity-85">{jumlahKustom > 0 ? `${jumlahKustom} soal · ${durasiCustom} detik/soal` : "Belum ada soal kustom"}</div>
              </div>
            </div>
            <div className="bg-white p-3 flex gap-2">
              <button onClick={mulaiKustom} disabled={jumlahKustom === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
                {jumlahKustom > 0 ? `▶ Main (${jumlahKustom} soal)` : "Belum ada soal"}
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">— atau pilih soal bawaan —</p>
          {(["mudah", "sedang", "sulit"] as TingkatSolo[]).map((t) => (
            <div key={t} className="rounded-2xl overflow-hidden shadow-md">
              <div className="py-3 px-4 text-white font-bold flex items-center gap-2" style={{ background: WARNA_TINGKAT[t] }}>
                <span className="text-2xl">{t === "mudah" ? "😊" : t === "sedang" ? "🤔" : "🔥"}</span>
                <div>
                  <div className="text-base">{LABEL_TINGKAT[t]}</div>
                  <div className="text-xs font-normal opacity-85">
                    {jumlahCustom} soal · {durasiCustom} detik/soal
                  </div>
                </div>
              </div>
              <div className="bg-white grid grid-cols-5 divide-x" style={{ borderColor: "#fdd5d8" }}>
                {([1,2,3,4,5] as PaketSolo[]).map((p) => (
                  <button key={p} onClick={() => mulaiSolo(t, p)} disabled={loading}
                    className="py-3 flex flex-col items-center gap-0.5 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
                    title={PAKET_INFO[p].nama}>
                    <span className="text-lg">{PAKET_INFO[p].emoji}</span>
                    <span className="text-[9px] text-gray-500 font-semibold">{p}</span>
                  </button>
                ))}
              </div>
              <div className="bg-gray-50 px-3 py-1.5 flex gap-1 flex-wrap">
                {([1,2,3,4,5] as PaketSolo[]).map((p) => (
                  <span key={p} className="text-[10px] text-gray-500">{PAKET_INFO[p].emoji} {PAKET_INFO[p].nama}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // --- Bermain Solo ---
  if (layar === "bermain" && soalSekarang) {
    const durasi = durasiCustom;
    const persen = waktuSisa / durasi;
    const warnaTimer = persen > 0.5 ? "#16a34a" : persen > 0.25 ? "#d97706" : "#dc2626";
    const paketInfo = PAKET_INFO[paket];

    return (
      <>
        <header className="shrink-0 px-4 pt-4 pb-3"
          style={{ background: isKustom ? (isAISolo ? "linear-gradient(135deg,#0284c7,#0ea5e9)" : "linear-gradient(135deg,#7c3aed,#a78bfa)") : WARNA_TINGKAT[tingkat] }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/80">
              {isKustom ? `${soloJudul.emoji} ${soloJudul.nama}` : `${paketInfo.emoji} ${paketInfo.nama}`}
            </span>
            <span className="text-xs text-white/80">Soal {indeks + 1}/{totalSoal}</span>
            <span className="text-lg font-black text-white">{waktuSisa}s</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${persen * 100}%`, background: warnaTimer }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-white/70">
            <span>✅ {skorBenar} benar</span>
            <span className="font-semibold">{LABEL_TINGKAT[tingkat]}</span>
            <span>❌ {indeks - skorBenar} salah</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center flex items-center justify-center min-h-[90px]" style={{ borderColor: "#fdd5d8" }}>
            <p className="text-base font-semibold text-gray-800 leading-relaxed">{soalSekarang.pertanyaan}</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {soalSekarang.pilihan.map((p, i) => {
              const dipilih = jawabanDipilih === i;
              const benar = soalSekarang.jawaban === i;
              const showFeedback = feedbackBenar !== null;
              let bg = "white";
              let border = "#fdd5d8";
              let txtColor = "#a50d1c";
              if (showFeedback && benar) { bg = "linear-gradient(135deg,#16a34a,#4ade80)"; border = "#16a34a"; txtColor = "white"; }
              else if (showFeedback && dipilih && !benar) { bg = "linear-gradient(135deg,#dc2626,#f87171)"; border = "#dc2626"; txtColor = "white"; }
              const disabled = jawabanDipilih !== null;
              return (
                <button key={i} onClick={() => prosesJawaban(i)} disabled={disabled}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-sm font-medium transition-all shadow-sm"
                  style={{ background: bg, color: txtColor, border: `2px solid ${border}`, opacity: disabled && !dipilih && !(showFeedback && benar) ? 0.45 : 1 }}>
                  <span className="font-bold mr-2">{["A", "B", "C"][i]}.</span> {p}
                  {showFeedback && benar && <span className="float-right">✅</span>}
                  {showFeedback && dipilih && !benar && <span className="float-right">❌</span>}
                </button>
              );
            })}
          </div>

          {feedbackBenar === true && (
            <div className="text-center font-bold text-green-600 animate-in fade-in text-sm">🎉 Benar! +1 poin</div>
          )}
          {feedbackBenar === false && jawabanDipilih !== -1 && (
            <div className="text-center font-bold text-red-500 animate-in fade-in text-sm">
              ❌ Kurang tepat. Jawaban: {["A","B","C"][soalSekarang.jawaban]}
            </div>
          )}
          {jawabanDipilih === -1 && (
            <div className="text-center font-bold text-orange-500 animate-in fade-in text-sm">⏰ Waktu habis!</div>
          )}
        </div>
      </>
    );
  }

  // --- Selesai Solo ---
  if (layar === "selesai") {
    const persen = Math.round((skorBenar / totalSoal) * 100);
    const nilai = persen >= 80 ? { emoji: "🏆", pesan: "Luar biasa! Kamu sangat pintar!", warna: "#16a34a" }
      : persen >= 60 ? { emoji: "🥳", pesan: "Bagus! Terus tingkatkan ya!", warna: "#d97706" }
      : persen >= 40 ? { emoji: "💪", pesan: "Lumayan! Coba lagi untuk hasil lebih baik.", warna: "#2563eb" }
      : { emoji: "😊", pesan: "Jangan menyerah! Belajar lagi yuk!", warna: "#a50d1c" };
    const paketInfo = PAKET_INFO[paket];

    return (
      <>
        <KuisHeader judul="📊 Hasil Kuis Solo"
          sub={isKustom ? `${soloJudul.emoji} ${soloJudul.nama}` : `${paketInfo.emoji} ${paketInfo.nama} · ${LABEL_TINGKAT[tingkat]}`}
          kanan={<button onClick={onBack} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>← Menu</button>} />
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border text-center" style={{ borderColor: "#fdd5d8" }}>
            <div className="text-5xl mb-2">{nilai.emoji}</div>
            <div className="text-4xl font-black mb-1" style={{ color: nilai.warna }}>{persen}%</div>
            <div className="text-base font-semibold text-gray-700 mb-1">{skorBenar} dari {totalSoal} soal benar</div>
            <p className="text-sm text-gray-500">{nilai.pesan}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: "#fdd5d8" }}>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <div className="text-2xl font-black text-green-600">{skorBenar}</div>
                <div className="text-xs text-gray-500">Benar</div>
              </div>
              <div>
                <div className="text-2xl font-black text-red-500">{totalSoal - skorBenar}</div>
                <div className="text-xs text-gray-500">Salah</div>
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: nilai.warna }}>{persen}%</div>
                <div className="text-xs text-gray-500">Skor</div>
              </div>
            </div>
          </div>

          {/* Tombol ulangi — disesuaikan mode */}
          {isKustom ? (
            isAISolo ? (
              <button onClick={mulaiSoloAI} disabled={loadingAISolo}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#0284c7,#0ea5e9)" }}>
                {loadingAISolo ? "⏳ Membuat soal baru..." : `🔄 Generate Ulang (${soloJudul.nama})`}
              </button>
            ) : (
              <button onClick={mulaiKustom}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
                🔄 Ulangi Soal Buatan Sendiri
              </button>
            )
          ) : (
            <button onClick={() => mulaiSolo(tingkat, paket)}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md"
              style={{ background: WARNA_TINGKAT[tingkat] }}>
              🔄 Ulangi Paket Ini ({paketInfo.emoji} {paketInfo.nama})
            </button>
          )}

          {/* Pilih Paket Lain — hanya untuk mode bawaan */}
          {!isKustom && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: "#dbeafe" }}>
              <p className="text-sm font-bold text-gray-700 mb-3">🎲 Coba Paket Soal Lain</p>
              <div className="grid grid-cols-1 gap-2">
                {([1,2,3,4,5] as PaketSolo[]).filter((p) => p !== paket).map((p) => (
                  <button key={p} onClick={() => mulaiSolo(tingkat, p)} disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center gap-3 shadow-sm disabled:opacity-50"
                    style={{ background: PAKET_INFO[p].warna }}>
                    <span className="text-xl">{PAKET_INFO[p].emoji}</span>
                    <div className="text-left">
                      <div className="font-bold">Paket {p}: {PAKET_INFO[p].nama}</div>
                      <div className="text-xs opacity-80">{PAKET_INFO[p].deskripsi}</div>
                    </div>
                    <span className="ml-auto text-lg">▶</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ganti Tingkat / kembali ke pilih */}
          <button onClick={() => setLayar("pilih_tingkat")}
            className="w-full py-3 rounded-2xl font-bold text-base border-2"
            style={{ color: "#1d4ed8", borderColor: "#3b82f6", background: "white" }}>
            ↩ {isKustom ? "Pilih Soal Lain" : "Pilih Tingkat & Paket Baru"}
          </button>
          <button onClick={onBack}
            className="w-full py-3 rounded-2xl font-bold text-base border-2"
            style={{ color: "#a50d1c", borderColor: "#CE1126", background: "white" }}>
            ← Menu Utama
          </button>
        </div>
      </>
    );
  }

  return null;
}

// ===== MODE MULTIPLAYER =====
function ModuMulti({ onBack, initialPakaiSoalKustom = false }: { onBack: () => void; initialPakaiSoalKustom?: boolean }) {
  const [layar, setLayar] = useState<LayarMulti>("home");
  const [pemainId] = useState(() => uid());
  const [hostId, setHostId] = useState(() => uid());
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kodeRuang, setKodeRuang] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pilihanDipilih, setPilihanDipilih] = useState<number | null>(null);
  const [jawabLoading, setJawabLoading] = useState(false);
  const [tingkatDipilih, setTingkatDipilih] = useState<TingkatBareng>("mudah");
  const [pakaiSoalKustom, setPakaiSoalKustom] = useState(initialPakaiSoalKustom);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // FIX: track the correct player ID (host uses hostId, guest uses pemainId)
  const myIdRef = useRef<string>(pemainId);
  // FIX: track soalIndex to reset pilihanDipilih exactly when soal changes
  const lastSoalIndexRef = useRef<number>(-1);
  // Delta skor untuk animasi leaderboard host
  const prevSkorRef = useRef<Record<string, number>>({});
  const [skorDelta, setSkorDelta] = useState<Record<string, number>>({});
  const deltaClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    if (!kodeRuang) return;
    try {
      // FIX: use myIdRef.current (correct ID for both host and guest)
      const res = await fetch(apiUrl(`/kuis/status/${kodeRuang}?pemainId=${myIdRef.current}`));
      if (!res.ok) return;
      const data = (await res.json()) as StatusResponse;
      setStatus(data);
      if (data.status === "menunggu") setLayar("lobby");
      else if (data.status === "berjalan") {
        setLayar("bermain");
        // FIX: reset pilihanDipilih when soal changes, else sync from server
        if (data.soalIndex !== undefined && data.soalIndex !== lastSoalIndexRef.current) {
          lastSoalIndexRef.current = data.soalIndex;
          setPilihanDipilih(null);
        } else if (data.jawabanSaya !== null && data.jawabanSaya !== undefined) {
          setPilihanDipilih(data.jawabanSaya);
        }
      }
      else if (data.status === "jeda_sesi") { setLayar("jeda_sesi"); lastSoalIndexRef.current = -1; }
      else if (data.status === "selesai") setLayar("selesai");
    } catch { /* retry */ }
  }, [kodeRuang]);

  useEffect(() => {
    if (kodeRuang && layar !== "home" && layar !== "selesai") {
      pollingRef.current = setInterval(poll, 1200);
      poll();
      return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }
    return undefined;
  }, [kodeRuang, layar, poll]);

  useEffect(() => {
    if (layar === "selesai" && pollingRef.current) clearInterval(pollingRef.current);
  }, [layar]);

  // Hitung delta skor untuk animasi leaderboard host
  useEffect(() => {
    if (!status?.peringkat || !isHost) return;
    const newDelta: Record<string, number> = {};
    for (const p of status.peringkat) {
      const prev = prevSkorRef.current[p.id];
      if (prev !== undefined && p.skor > prev) {
        newDelta[p.id] = p.skor - prev;
      }
      prevSkorRef.current[p.id] = p.skor;
    }
    if (Object.keys(newDelta).length > 0) {
      setSkorDelta(prev => ({ ...prev, ...newDelta }));
      if (deltaClearRef.current) clearTimeout(deltaClearRef.current);
      deltaClearRef.current = setTimeout(() => setSkorDelta({}), 2000);
    }
  }, [status?.peringkat, isHost]);

  async function handleBuat() {
    if (!nama.trim()) { setError("Masukkan nama kamu dulu ya!"); return; }
    setLoading(true); setError("");
    try {
      const newHostId = uid();
      setHostId(newHostId);
      myIdRef.current = newHostId; // FIX: set correct ID for host
      const soalKustom = pakaiSoalKustom ? getSoalKustom() : undefined;
      if (pakaiSoalKustom && (!soalKustom || soalKustom.length === 0)) {
        setError("Belum ada soal kustom. Buat dulu di menu 'Buat Soal Sendiri'.");
        setLoading(false); return;
      }
      const res = await fetch(apiUrl("/kuis/buat"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hostId: newHostId, tingkat: tingkatDipilih, soalKustom }) });
      const data = (await res.json()) as { kode?: string; error?: string };
      if (!res.ok || !data.kode) { setError(data.error ?? "Gagal membuat ruang"); return; }
      setKodeRuang(data.kode);
      // Host TIDAK bergabung sebagai pemain — cukup set kode & mulai polling
      setIsHost(true); setLayar("lobby");
    } catch { setError("Koneksi bermasalah, coba lagi."); }
    finally { setLoading(false); }
  }

  async function handleMasuk() {
    if (!nama.trim()) { setError("Masukkan nama kamu dulu!"); return; }
    if (!kode.trim()) { setError("Masukkan kode kuis dulu!"); return; }
    setLoading(true); setError("");
    try {
      myIdRef.current = pemainId; // FIX: guest uses pemainId
      const res = await fetch(apiUrl("/kuis/masuk"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kode: kode.toUpperCase(), pemainId, nama }) });
      const data = (await res.json()) as { ok?: boolean; isHost?: boolean; error?: string };
      if (!res.ok || !data.ok) { setError(data.error ?? "Gagal bergabung"); return; }
      setKodeRuang(kode.toUpperCase()); setIsHost(data.isHost ?? false); setLayar("lobby");
    } catch { setError("Koneksi bermasalah, coba lagi."); }
    finally { setLoading(false); }
  }

  async function handleMulai() {
    // FIX: always use myIdRef.current
    await fetch(apiUrl("/kuis/mulai"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kode: kodeRuang, hostId: myIdRef.current }) });
    await poll();
  }

  async function handleJawab(idx: number) {
    if (pilihanDipilih !== null || jawabLoading) return;
    setPilihanDipilih(idx); setJawabLoading(true);
    // FIX: always use myIdRef.current
    await fetch(apiUrl("/kuis/jawab"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kode: kodeRuang, pemainId: myIdRef.current, pilihan: idx }) });
    setJawabLoading(false);
  }

  function handleMainLagi() {
    if (pollingRef.current) clearInterval(pollingRef.current);
    lastSoalIndexRef.current = -1;
    setKodeRuang("");
    setKode("");
    setIsHost(false);
    setStatus(null);
    setPilihanDipilih(null);
    setError("");
    setLayar("home");
  }

  const DURASI_PER_SESI: Record<number, number> = { 1: 30, 2: 25, 3: 20, 4: 15, 5: 10 };
  const tingkatAktif: TingkatBareng = status?.tingkat ?? tingkatDipilih;

  // --- Home Multiplayer ---
  if (layar === "home") {
    return (
      <>
        <KuisHeader judul="👥 Kuis Bareng" sub="5 Babak Eliminasi · Soal Selalu Berbeda"
          kanan={<button onClick={onBack} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>← Kembali</button>} />
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">{error}</div>}
          <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: "#fdd5d8" }}>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Nama kamu</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan namamu..." maxLength={20}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ background: "#fff5f5", border: "1px solid #fdd5d8", color: "#3d1a1a" }} />
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: "#fdd5d8" }}>
            <p className="text-sm font-semibold text-gray-600 mb-2">Pilih tingkat (khusus host)</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(["mudah", "sedang", "sulit"] as TingkatBareng[]).map((t) => (
                <button key={t} onClick={() => setTingkatDipilih(t)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: tingkatDipilih === t ? WARNA_BARENG[t] : "#fff5f5",
                    color: tingkatDipilih === t ? "white" : "#a50d1c",
                    border: tingkatDipilih === t ? "2px solid transparent" : "2px solid #fdd5d8",
                  }}>
                  {LABEL_BARENG[t]}<br />
                  <span className="text-xs font-normal opacity-90">{DURASI_BARENG[t]}dtk/soal</span>
                </button>
              ))}
            </div>
            {/* Pilihan soal kustom */}
            <button onClick={() => setPakaiSoalKustom(v => !v)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-3 transition-all text-left"
              style={{ background: pakaiSoalKustom ? "#f3e8ff" : "#fdf4ff", border: `2px solid ${pakaiSoalKustom ? "#7c3aed" : "#e9d5ff"}` }}>
              <span className="text-xl">{pakaiSoalKustom ? "✅" : "⬜"}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: pakaiSoalKustom ? "#7c3aed" : "#6b7280" }}>Gunakan Soal Buatan Sendiri</div>
                <div className="text-xs text-gray-400">
                  {getSoalKustom().length > 0 ? `${getSoalKustom().length} soal tersedia` : "Belum ada soal — buat di menu Buat Soal"}
                </div>
              </div>
            </button>
            <p className="text-sm font-semibold text-gray-600 mb-3">Kamu adalah...</p>
            <button onClick={handleBuat} disabled={loading}
              className="w-full py-3 rounded-2xl text-white font-bold text-base mb-3 shadow-md disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>
              🏆 Buat Kuis Baru (Jadi Host)
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">atau</span><div className="flex-1 h-px bg-gray-200" />
            </div>
            <input value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="Kode kuis (4 huruf)" maxLength={4}
              className="w-full rounded-xl px-4 py-2.5 text-sm mb-2 focus:outline-none focus:ring-2 text-center font-mono text-lg tracking-widest"
              style={{ background: "#fff5f5", border: "1px solid #fdd5d8", color: "#3d1a1a" }} />
            <button onClick={handleMasuk} disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-base border-2 disabled:opacity-50"
              style={{ color: "#a50d1c", borderColor: "#CE1126", background: "white" }}>
              🙋 Ikut Kuis
            </button>
          </div>
          <div className="rounded-2xl p-4 text-sm border" style={{ background: "#fff5f5", borderColor: "#fdd5d8", color: "#7f1d1d" }}>
            <p className="font-semibold mb-2">📋 Alur 5 Babak</p>
            {BABAK_INFO.map((b) => (
              <p key={b.babak}>• <b>Babak {b.babak}</b>: {b.soal} soal · {DURASI_BARENG[tingkatDipilih]}dtk → {b.lolos === 0 ? "🏆 Juara ditentukan!" : `Top ${b.lolos} lolos`}</p>
            ))}
          </div>
        </div>
      </>
    );
  }

  // --- Lobby ---
  if (layar === "lobby") {
    return (
      <>
        <header className="shrink-0 px-5 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 100%)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Ruang Kuis</h2>
              <p className="text-xs" style={{ color: "rgba(255,220,220,0.8)" }}>{isHost ? "Kamu adalah host" : "Menunggu host..."}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,240,200,0.9)" }}>
                ⏱ {LABEL_BARENG[tingkatAktif]} · {DURASI_BARENG[tingkatAktif]}dtk/soal
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black font-mono text-white tracking-widest">{kodeRuang}</div>
              <div className="text-[10px]" style={{ color: "rgba(255,220,220,0.7)" }}>KODE KUIS</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4" style={{ borderColor: "#fdd5d8" }}>
            <p className="text-sm font-semibold text-gray-600 mb-3">Peserta ({status?.daftarPemain?.length ?? 0})</p>
            {status?.daftarPemain?.length ? (
              <div className="space-y-2">
                {status.daftarPemain.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#CE1126" }}>{i + 1}</span>
                    <span className="text-gray-700">{n}</span>
                    {n === nama && <span className="text-xs text-red-600 font-semibold">(kamu)</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 italic">Belum ada peserta...</p>}
          </div>
          {isHost && (
            <button onClick={handleMulai} disabled={!status?.daftarPemain?.length}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>
              🚀 Mulai Babak 1
            </button>
          )}
          {!isHost && <div className="text-center text-gray-500 text-sm py-6 animate-pulse">⏳ Menunggu host memulai kuis...</div>}
        </div>
      </>
    );
  }

  // --- Bermain ---
  if (layar === "bermain" && status?.soal) {
    const { soal, waktuSisa = 0, sudahJawab, aktif } = status;
    const durasi = DURASI_BARENG[tingkatAktif];
    const persen = waktuSisa / durasi;
    const warnaTimer = persen > 0.5 ? "#16a34a" : persen > 0.25 ? "#d97706" : "#dc2626";
    const sudahJawabCount = status.sudahJawabCount ?? 0;

    if (!aktif) {
      return (
        <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto items-center justify-center p-6" style={{ background: "linear-gradient(160deg, #fff8f8 0%, #fff0f0 100%)" }}>
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Kamu tidak lolos ke babak berikutnya</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Jangan menyerah, ikut lagi di kuis berikutnya ya!</p>
          <button onClick={handleMainLagi} className="py-3 px-6 rounded-2xl font-bold text-white mb-3 w-full" style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>🔄 Main Lagi (Soal Baru)</button>
          <button onClick={onBack} className="py-3 px-6 rounded-2xl font-bold border-2 w-full" style={{ color: "#a50d1c", borderColor: "#CE1126", background: "white" }}>← Menu Kuis</button>
        </div>
      );
    }

    // ===== TAMPILAN HOST: LEADERBOARD LIVE =====
    if (isHost) {
      return (
        <>
          <header className="shrink-0 px-4 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 100%)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-red-200 uppercase tracking-widest">👑 Host · Babak {status.sesi}</span>
              <span className="text-xs text-red-200">Soal {soal.nomor}/{soal.total}</span>
              <span className="text-lg font-black text-white">{waktuSisa}s</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${persen * 100}%`, background: warnaTimer }} />
            </div>
            <div className="flex items-center justify-between text-[11px]" style={{ color: "rgba(255,220,220,0.85)" }}>
              <span>✅ Sudah jawab: <b className="text-white">{sudahJawabCount}</b>/{status.pemainAktif}</span>
              <span>⏱ {LABEL_BARENG[tingkatAktif]} · {durasi}dtk/soal</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Pertanyaan aktif */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border mb-3 text-center" style={{ borderColor: "#fdd5d8" }}>
              <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wider font-semibold">Pertanyaan {soal.nomor} dari {soal.total}</p>
              <p className="text-sm font-semibold text-gray-700 leading-snug">{soal.pertanyaan}</p>
            </div>

            {/* Label papan skor */}
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#a50d1c" }}>📊 Papan Skor Live</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: "#16a34a" }}>
                ✅ {sudahJawabCount}/{status.pemainAktif} jawab
              </span>
            </div>

            {/* Leaderboard animasi */}
            <div className="flex flex-col gap-1.5">
              <AnimatePresence>
                {status.peringkat.map((p, idx) => {
                  const isTop3 = idx < 3;
                  const bgColors = [
                    "linear-gradient(135deg,#f59e0b,#fbbf24)",
                    "linear-gradient(135deg,#9ca3af,#d1d5db)",
                    "linear-gradient(135deg,#b45309,#d97706)",
                  ];
                  const rankBg = isTop3 ? bgColors[idx] : "linear-gradient(135deg,#e5e7eb,#f3f4f6)";
                  const rankColor = isTop3 ? "white" : "#6b7280";
                  const delta = skorDelta[p.id];
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: p.aktif ? 1 : 0.4, x: 0 }}
                      transition={{ layout: { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }, opacity: { duration: 0.3 } }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl shadow-sm relative overflow-hidden"
                      style={{
                        background: isTop3 ? "linear-gradient(135deg,#fff8f0,#fff5f5)" : "white",
                        border: isTop3 ? "1.5px solid #fdd5d8" : "1px solid #f3f4f6",
                      }}
                    >
                      {/* Kilap latar saat skor naik */}
                      {delta && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          initial={{ opacity: 0.35 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 1.2 }}
                          style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)" }}
                        />
                      )}

                      {/* Peringkat badge */}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs shadow-sm"
                        style={{ background: rankBg, color: rankColor }}>
                        {isTop3 ? MEDAL[idx] : p.peringkat}
                      </div>

                      {/* Nama */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{p.nama}</p>
                        {!p.aktif && <p className="text-[10px] text-gray-400">gugur</p>}
                      </div>

                      {/* Skor + delta */}
                      <div className="text-right shrink-0 relative">
                        <div className="text-base font-black tabular-nums" style={{ color: isTop3 ? "#a50d1c" : "#374151" }}>
                          {p.skor}
                        </div>
                        <div className="text-[9px] text-gray-400">poin</div>
                        {/* Animasi +N poin */}
                        <AnimatePresence>
                          {delta && (
                            <motion.span
                              key={`delta-${p.id}-${delta}`}
                              className="absolute -top-5 right-0 text-xs font-black"
                              style={{ color: "#16a34a" }}
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 0, y: -18 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.4, ease: "easeOut" }}
                            >
                              +{delta}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {status.peringkat.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">Belum ada peserta...</div>
              )}
            </div>
          </div>
        </>
      );
    }

    // ===== TAMPILAN PESERTA: SOAL KUIS =====
    return (
      <>
        <header className="shrink-0 px-4 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 100%)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-200 uppercase tracking-widest">Babak {status.sesi}</span>
            <span className="text-xs text-red-200">Soal {soal.nomor}/{soal.total}</span>
            <span className="text-lg font-black text-white">{waktuSisa}s</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${persen * 100}%`, background: warnaTimer }} />
          </div>
        </header>
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center" style={{ borderColor: "#fdd5d8" }}>
            <p className="text-base font-semibold text-gray-800 leading-relaxed">{soal.pertanyaan}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {soal.pilihan.map((p, i) => {
              const dipilih = pilihanDipilih === i;
              const disabled = sudahJawab || pilihanDipilih !== null || waktuSisa === 0;
              return (
                <button key={i} onClick={() => handleJawab(i)} disabled={disabled || jawabLoading}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-sm font-medium transition-all shadow-sm"
                  style={{
                    background: dipilih ? "linear-gradient(135deg,#2563eb,#60a5fa)" : "white",
                    color: dipilih ? "white" : "#374151",
                    border: dipilih ? "2px solid #2563eb" : "2px solid #e5e7eb",
                    opacity: disabled && !dipilih ? 0.5 : 1,
                  }}>
                  <span className="font-bold mr-2">{["A", "B", "C"][i]}.</span> {p}
                  {dipilih && <span className="float-right">✔</span>}
                </button>
              );
            })}
          </div>
          {(sudahJawab || pilihanDipilih !== null) && <div className="text-center text-green-700 font-semibold text-sm animate-in fade-in">✅ Jawaban tersimpan! Tunggu soal berikutnya...</div>}
          {waktuSisa === 0 && pilihanDipilih === null && <div className="text-center text-red-500 font-semibold text-sm">⏰ Waktu habis!</div>}
        </div>
      </>
    );
  }

  // --- Jeda Sesi ---
  if (layar === "jeda_sesi") {
    const topN = status?.maks_lolos ?? 8;
    const lolos = status?.lolos ?? false;
    const nextBabak = (status?.sesi ?? 1) + 1;

    return (
      <>
        <KuisHeader judul={`🏁 Babak ${status?.sesi} Selesai!`}
          sub={lolos ? `🎉 Selamat! Lanjut ke Babak ${nextBabak}!` : "Kamu belum lolos ke babak berikutnya."} />
        <div className="flex-1 overflow-y-auto p-4">
          {isHost ? (
            <>
              <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4" style={{ borderColor: "#fdd5d8" }}>
                <p className="text-sm font-bold text-gray-600 mb-3">📊 Peringkat Babak {status?.sesi}</p>
                {status?.peringkat.slice(0, topN).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-b-0" style={{ borderColor: "#fff5f5" }}>
                    <span className="w-8 text-lg font-black text-center">{p.peringkat <= 3 ? MEDAL[p.peringkat - 1] : p.peringkat}</span>
                    <span className="flex-1 font-medium text-sm text-gray-700">{p.nama}</span>
                    <span className="font-bold text-sm" style={{ color: "#a50d1c" }}>{p.skor} poin</span>
                    {p.aktif && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fff0f0", color: "#a50d1c" }}>Lolos</span>}
                  </div>
                ))}
              </div>
              <button onClick={handleMulai}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md"
                style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>
                🚀 Mulai Babak {nextBabak}
              </button>
            </>
          ) : (
            () => {
              const saya = status?.peringkat.find(p => p.id === myIdRef.current);
              return (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="text-5xl">{lolos ? "🎉" : "😢"}</div>
                  <p className="text-lg font-black text-gray-800">{lolos ? "Selamat, kamu lolos!" : "Kamu belum lolos"}</p>
                  {saya && (
                    <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border text-center" style={{ borderColor: "#fdd5d8" }}>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Posisimu</p>
                      <p className="text-4xl font-black mb-1" style={{ color: "#a50d1c" }}>
                        {saya.peringkat <= 3 ? MEDAL[saya.peringkat - 1] : `#${saya.peringkat}`}
                      </p>
                      <p className="text-sm font-bold text-gray-700">{saya.skor} poin</p>
                    </div>
                  )}
                  <p className="text-center text-gray-500 text-sm animate-pulse">⏳ Menunggu host mulai Babak {nextBabak}...</p>
                </div>
              );
            }
          )()}
        </div>
      </>
    );
  }

  // --- Selesai ---
  if (layar === "selesai") {
    const top3 = status?.peringkat.slice(0, 3) ?? [];
    return (
      <>
        <header className="shrink-0 px-5 pt-5 pb-4 text-center" style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 100%)" }}>
          <div className="text-4xl mb-1">🏆</div>
          <h2 className="text-xl font-black text-white">Kuis Selesai!</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(255,210,210,0.85)" }}>Desa Mekar Sari · Bumdes Sari Mandiri</p>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          {isHost ? (
            <>
              {/* Podium */}
              <div className="flex justify-center items-end gap-3 mb-4">
                {top3[1] && (
                  <div className="text-center flex-1">
                    <div className="text-3xl">🥈</div>
                    <div className="bg-white rounded-2xl py-4 px-2 shadow-sm border" style={{ borderColor: "#fdd5d8" }}>
                      <div className="font-bold text-sm text-gray-700 truncate">{top3[1].nama}</div>
                      <div className="font-black text-base" style={{ color: "#a50d1c" }}>{top3[1].skor}</div>
                      <div className="text-xs text-gray-400">poin</div>
                    </div>
                  </div>
                )}
                {top3[0] && (
                  <div className="text-center flex-1">
                    <div className="text-4xl">🥇</div>
                    <div className="rounded-2xl py-5 px-2 shadow-md border-2 text-white" style={{ background: "linear-gradient(135deg,#a50d1c,#CE1126)", borderColor: "#a50d1c" }}>
                      <div className="font-bold text-sm truncate">{top3[0].nama}</div>
                      <div className="font-black text-xl">{top3[0].skor}</div>
                      <div className="text-xs text-red-200">poin</div>
                    </div>
                  </div>
                )}
                {top3[2] && (
                  <div className="text-center flex-1">
                    <div className="text-3xl">🥉</div>
                    <div className="bg-white rounded-2xl py-4 px-2 shadow-sm border" style={{ borderColor: "#fdd5d8" }}>
                      <div className="font-bold text-sm text-gray-700 truncate">{top3[2].nama}</div>
                      <div className="font-black text-base" style={{ color: "#a50d1c" }}>{top3[2].skor}</div>
                      <div className="text-xs text-gray-400">poin</div>
                    </div>
                  </div>
                )}
              </div>
              {/* Daftar peringkat lengkap */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border mb-4" style={{ borderColor: "#fdd5d8" }}>
                <p className="text-sm font-bold text-gray-600 mb-3">📊 Peringkat Akhir</p>
                {status?.peringkat.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-b-0" style={{ borderColor: "#fff5f5" }}>
                    <span className="w-8 text-center font-black text-sm">{p.peringkat <= 3 ? MEDAL[p.peringkat - 1] : p.peringkat}</span>
                    <span className="flex-1 font-medium text-sm text-gray-700">{p.nama}</span>
                    <span className="font-bold text-sm" style={{ color: "#a50d1c" }}>{p.skor} poin</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Peserta: hanya lihat posisi diri sendiri */
            (() => {
              const saya = status?.peringkat.find(p => p.id === myIdRef.current);
              const menang = saya && saya.peringkat === 1;
              return (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <div className="text-6xl">{saya?.peringkat === 1 ? "🏆" : saya?.peringkat === 2 ? "🥈" : saya?.peringkat === 3 ? "🥉" : "🎯"}</div>
                  <p className="text-xl font-black text-gray-800">{menang ? "Selamat, Juara 1!" : "Kuis Selesai!"}</p>
                  {saya ? (
                    <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border text-center w-full max-w-xs" style={{ borderColor: "#fdd5d8" }}>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Posisi Akhirmu</p>
                      <p className="text-5xl font-black mb-2" style={{ color: "#a50d1c" }}>
                        {saya.peringkat <= 3 ? MEDAL[saya.peringkat - 1] : `#${saya.peringkat}`}
                      </p>
                      <p className="text-2xl font-black" style={{ color: "#374151" }}>{saya.skor}</p>
                      <p className="text-xs text-gray-400">poin</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Tidak ada data hasil</p>
                  )}
                </div>
              );
            })()
          )}

          <button onClick={handleMainLagi}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md mb-3"
            style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}>
            🔄 Main Lagi (Soal Berbeda)
          </button>
          <button onClick={onBack}
            className="w-full py-3 rounded-2xl font-bold text-base border-2"
            style={{ color: "#a50d1c", borderColor: "#CE1126", background: "white" }}>
            ← Menu Kuis
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full max-w-md mx-auto items-center justify-center">
      <div className="text-center text-gray-500"><div className="text-3xl mb-2 animate-pulse">⏳</div><p className="text-sm">Memuat...</p></div>
    </div>
  );
}

// ===== BUAT SOAL SENDIRI =====
function BuatSoal({ onBack, onMainkanBareng }: { onBack: () => void; onMainkanBareng?: () => void }) {
  const [soalList, setSoalList] = useState<SoalKustom[]>(() => getSoalKustom());
  const [modeForm, setModeForm] = useState<"list" | "tambah" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [formPertanyaan, setFormPertanyaan] = useState("");
  const [formPilihan, setFormPilihan] = useState(["", "", ""]);
  const [formJawaban, setFormJawaban] = useState<0 | 1 | 2>(0);
  const [topikAI, setTopikAI] = useState("");
  const [jumlahAI, setJumlahAI] = useState(5);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");
  const [tampilFormAI, setTampilFormAI] = useState(false);

  function bukaTambah() {
    setEditId(null);
    setFormPertanyaan(""); setFormPilihan(["", "", ""]); setFormJawaban(0);
    setModeForm("tambah");
  }

  function bukaEdit(s: SoalKustom) {
    setEditId(s.id);
    setFormPertanyaan(s.pertanyaan);
    setFormPilihan([...s.pilihan]);
    setFormJawaban(s.jawaban);
    setModeForm("edit");
  }

  fu
