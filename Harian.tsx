import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, X, Edit2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type SlotKey = "pagi" | "siang" | "sore" | "malam";
interface SlotEntry { mood: number; catatan: string; waktu: string }
type DayData = Partial<Record<SlotKey, SlotEntry>>;
type AllData = Record<string, DayData>; // key = "YYYY-MM-DD"

// ── Constants ─────────────────────────────────────────────────────────────────
const SLOTS: { key: SlotKey; label: string; icon: string; range: string; hours: [number, number] }[] = [
  { key: "pagi",  label: "Pagi",  icon: "🌅", range: "05.00–11.59", hours: [5, 11]  },
  { key: "siang", label: "Siang", icon: "☀️", range: "12.00–15.59", hours: [12, 15] },
  { key: "sore",  label: "Sore",  icon: "🌆", range: "16.00–19.59", hours: [16, 19] },
  { key: "malam", label: "Malam", icon: "🌙", range: "20.00–04.59", hours: [20, 28] },
];

const MOODS = [
  { val: 1, emoji: "😞", label: "Sangat Buruk", color: "text-red-400",    bg: "bg-red-500/20 border-red-500/40"    },
  { val: 2, emoji: "😕", label: "Kurang Baik",  color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/40" },
  { val: 3, emoji: "😐", label: "Biasa Saja",   color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/40" },
  { val: 4, emoji: "😊", label: "Baik",         color: "text-green-400",  bg: "bg-green-500/20 border-green-500/40"  },
  { val: 5, emoji: "😄", label: "Sangat Baik",  color: "text-emerald-400",bg: "bg-emerald-500/20 border-emerald-500/40" },
];

const MOOD_BAR_COLOR = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-400"];
const MOOD_DOT_COLOR = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-400"];

const STORAGE_KEY = "refleksi_harian";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toDateKey(d: Date) {
  return d.toLocaleDateString("sv-SE"); // "YYYY-MM-DD"
}

function loadAll(): AllData {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveAll(data: AllData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function currentSlot(): SlotKey | null {
  const h = new Date().getHours();
  if (h >= 5  && h <= 11) return "pagi";
  if (h >= 12 && h <= 15) return "siang";
  if (h >= 16 && h <= 19) return "sore";
  if (h >= 20 || h <= 4)  return "malam";
  return null;
}

function nowStr() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return toDateKey(d);
  });
}

function dayLabel(dateKey: string) {
  const d = new Date(dateKey);
  return d.toLocaleDateString("id-ID", { weekday: "short" }).slice(0, 3);
}

function avgMood(day: DayData): number | null {
  const vals = Object.values(day).map((e) => e?.mood).filter(Boolean) as number[];
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function filledCount(day: DayData) {
  return SLOTS.filter((s) => day[s.key]).length;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Harian() {
  const [allData, setAllData]       = useState<AllData>(loadAll);
  const [openSlot, setOpenSlot]     = useState<SlotKey | null>(null);
  const [draft, setDraft]           = useState({ mood: 0, catatan: "" });
  const [historyPage, setHistoryPage] = useState(0); // 0 = this week, older pages
  const textRef = useRef<HTMLTextAreaElement>(null);

  const todayKey  = toDateKey(new Date());
  const today     = allData[todayKey] || {};
  const active    = currentSlot();
  const days7     = last7Days();
  const totalFilled = Object.values(allData).reduce((a, d) => a + filledCount(d), 0);

  useEffect(() => { if (openSlot && textRef.current) textRef.current.focus(); }, [openSlot]);

  function openEntry(slot: SlotKey) {
    const existing = today[slot];
    setDraft({ mood: existing?.mood || 0, catatan: existing?.catatan || "" });
    setOpenSlot(slot);
  }

  function saveEntry() {
    if (!draft.mood) return;
    const updated: AllData = { ...allData, [todayKey]: { ...today, [openSlot!]: { mood: draft.mood, catatan: draft.catatan.trim(), waktu: nowStr() } } };
    setAllData(updated);
    saveAll(updated);
    setOpenSlot(null);
  }

  function deleteEntry(slot: SlotKey) {
    const day = { ...today };
    delete day[slot];
    const updated = { ...allData, [todayKey]: day };
    setAllData(updated);
    saveAll(updated);
  }

  // History: group past days (excluding today) by weeks
  const pastKeys = Object.keys(allData)
    .filter((k) => k !== todayKey && Object.keys(allData[k]).length > 0)
    .sort((a, b) => b.localeCompare(a));

  const PAGE_SIZE = 7;
  const histStart = historyPage * PAGE_SIZE;
  const histDays  = pastKeys.slice(histStart, histStart + PAGE_SIZE);

  const moodInfo = (m: number) => MOODS.find((x) => x.val === m) || MOODS[2];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <div className="pointer-events-none fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />

      {/* Header */}
      <header className="h-16 flex items-center px-5 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors mr-3">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </Link>
        <div>
          <h1 className="text-sm font-medium text-white">Jurnal 24 Jam</h1>
          <p className="text-xs text-white/40">{totalFilled} catatan tersimpan</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-5 space-y-6">

          {/* ── Today's Date ── */}
          <div className="text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Hari ini</p>
            <p className="text-white font-serif text-xl">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-xs text-white/40 mt-1">{filledCount(today)}/4 waktu diisi</p>
          </div>

          {/* ── Today's 4 Slots ── */}
          <div className="grid grid-cols-2 gap-3">
            {SLOTS.map((slot) => {
              const entry = today[slot.key];
              const isActive = active === slot.key;
              const mood = entry ? moodInfo(entry.mood) : null;
              return (
                <button
                  key={slot.key}
                  onClick={() => openEntry(slot.key)}
                  className={`relative rounded-2xl p-4 text-left transition-all duration-200 border ${
                    entry
                      ? "bg-white/8 border-white/15 hover:bg-white/12"
                      : isActive
                      ? "bg-primary/10 border-primary/30 hover:bg-primary/15 ring-1 ring-primary/20"
                      : "bg-white/4 border-white/8 hover:bg-white/8"
                  }`}
                >
                  {isActive && !entry && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                  {entry && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteEntry(slot.key); }}
                      className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-3 h-3 text-white/40" />
                    </button>
                  )}
                  <span className="text-2xl mb-2 block">{slot.icon}</span>
                  <p className="text-xs text-white/50 mb-1">{slot.label} · {slot.range}</p>
                  {entry ? (
                    <>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg">{mood!.emoji}</span>
                        <span className={`text-xs font-medium ${mood!.color}`}>{mood!.label}</span>
                      </div>
                      {entry.catatan && <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{entry.catatan}</p>}
                      <p className="text-[10px] text-white/25 mt-1">{entry.waktu}</p>
                    </>
                  ) : (
                    <p className="text-xs text-white/30 italic">{isActive ? "Waktumu sekarang ✦" : "Belum diisi"}</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Weekly Chart ── */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">7 Hari Terakhir</h3>
            <div className="flex items-end justify-between gap-1.5 h-20">
              {days7.map((dk) => {
                const d   = allData[dk] || {};
                const avg = avgMood(d);
                const isToday = dk === todayKey;
                const pct = avg ? Math.round((avg / 5) * 100) : 0;
                return (
                  <div key={dk} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex-1 flex items-end rounded-md overflow-hidden bg-white/5">
                      {avg !== null && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`w-full rounded-md ${isToday ? "bg-primary" : MOOD_BAR_COLOR[Math.round(avg)]}`}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] ${isToday ? "text-primary font-semibold" : "text-white/30"}`}>
                      {dayLabel(dk)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3">
              {[1,2,3,4,5].map((m) => {
                const mi = moodInfo(m);
                return <span key={m} className="text-sm" title={mi.label}>{mi.emoji}</span>;
              })}
            </div>
          </div>

          {/* ── History ── */}
          {histDays.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Riwayat</h3>
                <div className="flex items-center gap-1">
                  <button disabled={historyPage === 0} onClick={() => setHistoryPage((p) => p - 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 transition">
                    <ChevronLeft className="w-4 h-4 text-white/60" />
                  </button>
                  <button disabled={histStart + PAGE_SIZE >= pastKeys.length} onClick={() => setHistoryPage((p) => p + 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 transition">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>

              {histDays.map((dk) => {
                const d   = allData[dk] || {};
                const avg = avgMood(d);
                const filled = filledCount(d);
                const dateObj = new Date(dk);
                return (
                  <div key={dk} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-white font-medium">
                          {dateObj.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
                        </p>
                        <p className="text-xs text-white/40">{filled}/4 diisi</p>
                      </div>
                      {avg !== null && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{moodInfo(Math.round(avg)).emoji}</span>
                          <span className={`text-xs ${moodInfo(Math.round(avg)).color}`}>{avg.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {SLOTS.map((slot) => {
                        const e = d[slot.key];
                        return (
                          <div key={slot.key} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-base">{slot.icon}</span>
                            {e ? (
                              <div className={`w-2 h-2 rounded-full ${MOOD_DOT_COLOR[e.mood]}`} title={moodInfo(e.mood).label} />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-white/10" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Short notes preview */}
                    {SLOTS.filter((s) => d[s.key]?.catatan).slice(0, 2).map((slot) => (
                      <p key={slot.key} className="text-xs text-white/40 mt-2 line-clamp-1">
                        <span className="mr-1">{slot.icon}</span>
                        {d[slot.key]!.catatan}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* empty state */}
          {pastKeys.length === 0 && filledCount(today) === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📔</p>
              <p className="text-white/40 text-sm">Belum ada catatan.</p>
              <p className="text-white/25 text-xs mt-1">Isi perasaanmu hari ini, satu slot dulu.</p>
            </div>
          )}

        </div>
      </div>

      {/* ── Modal: Entry Form ── */}
      <AnimatePresence>
        {openSlot && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpenSlot(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-[#1a1a24] border-t border-white/10 p-6 pb-10"
            >
              {/* Drag indicator */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              {(() => {
                const slot = SLOTS.find((s) => s.key === openSlot)!;
                return (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-3xl">{slot.icon}</span>
                      <div>
                        <h2 className="text-white font-serif text-lg">{slot.label}</h2>
                        <p className="text-xs text-white/40">{slot.range} · {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>

                    {/* Mood Selector */}
                    <p className="text-xs text-white/40 mb-3">Bagaimana perasaanmu sekarang?</p>
                    <div className="flex gap-2 mb-5">
                      {MOODS.map((m) => (
                        <button
                          key={m.val}
                          onClick={() => setDraft((d) => ({ ...d, mood: m.val }))}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-150 ${
                            draft.mood === m.val ? m.bg : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-xl">{m.emoji}</span>
                          <span className={`text-[10px] leading-tight text-center ${draft.mood === m.val ? m.color : "text-white/30"}`}>
                            {m.label.split(" ").map((w, i) => <span key={i} className="block">{w}</span>)}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Note */}
                    <textarea
                      ref={textRef}
                      value={draft.catatan}
                      onChange={(e) => setDraft((d) => ({ ...d, catatan: e.target.value }))}
                      placeholder="Ceritakan sedikit... (opsional)"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 resize-none mb-4"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setOpenSlot(null)}
                        className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={saveEntry}
                        disabled={!draft.mood}
                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium disabled:opacity-30 flex items-center justify-center gap-2 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Simpan
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
