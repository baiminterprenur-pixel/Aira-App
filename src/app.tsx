import React, { useState, useEffect, useRef, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Send, Trash2, Trophy, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import NotFound from "@/pages/not-found";
import KuisPage from "@/pages/KuisPage";
import handleMath from "./utils/handleMath";
import getAiraResponse from "./utils/getAiraResponse";

const queryClient = new QueryClient();
const STORAGE_KEY = "aira_chat_history";
const AI_FALLBACK_MARKER = "__AI_FALLBACK__";

interface Message {
  id: string;
  sender: "aira" | "user";
  text: string;
  timestamp: Date;
  source?: "ai";
}

const pesanPerkenalan: Message[] = [
  {
    id: "intro-1",
    sender: "aira",
    text: "Halo! Perkenalkan, aku Aira 😊\n\nAku adalah asisten digital Desa Mekar Sari, Kecamatan Keluang, yang siap membantu warga kapan saja dan di mana saja.",
    timestamp: new Date(),
  },
  {
    id: "intro-2",
    sender: "aira",
    text: "Aku hadir untuk mempercepat dan mempermudah pelayanan desa, sehingga warga tidak perlu jauh-jauh ke kantor desa hanya untuk mendapatkan informasi dasar 🙏",
    timestamp: new Date(Date.now() + 100),
  },
  {
    id: "intro-3",
    sender: "aira",
    text: "Yang bisa aku bantu:\n\n📋 Informasi perangkat & kontak desa\n📄 Pembuatan surat desa (SKTM, domisili, usaha, dll)\n💰 Informasi bantuan sosial & pengajuan bantuan\n📝 Kritik & saran untuk desa\n🧮 Hitung matematika\n🎭 Tebak-tebakan biar nggak bosan\n🏛️ Informasi presiden Indonesia\n\nDan masih banyak lagi! Cukup ketik atau bicara ke aku 🎙️",
    timestamp: new Date(Date.now() + 200),
  },
  {
    id: "intro-4",
    sender: "aira",
    text: "Ada yang bisa aku bantu hari ini? 😊",
    timestamp: new Date(Date.now() + 300),
  },
];

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return pesanPerkenalan;
    const parsed = JSON.parse(raw) as Array<Omit<Message, "timestamp"> & { timestamp: string }>;
    if (!parsed.length) return pesanPerkenalan;
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return pesanPerkenalan;
  }
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch { /* ignore */ }
}

async function tanyaAI(pertanyaan: string): Promise<{ jawaban: string }> {
  const res = await fetch(`${import.meta.env.BASE_URL}api/ai-fallback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pertanyaan }),
  });
  if (!res.ok) throw new Error("API error");
  return res.json() as Promise<{ jawaban: string }>;
}

const INTERNAL_HOST = "code-asset-manager.replit.app";

function renderWithLinks(text: string) {
  const tokenRegex = /(https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const isInternal = part.includes(INTERNAL_HOST);
      if (isInternal) {
        const path = part.replace(`https://${INTERNAL_HOST}`, "");
        return (
          <a key={i} href={path}
            className="underline break-all font-medium" style={{ color: "#8B0000" }}>
            {part}
          </a>
        );
      }
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className="underline break-all font-medium" style={{ color: "#8B0000" }}>
          {part}
        </a>
      );
    }
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 10) return "Selamat Pagi 🌅";
  if (h < 15) return "Selamat Siang ☀️";
  if (h < 18) return "Selamat Sore 🌤️";
  return "Selamat Malam 🌙";
}

function GarudaIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="72" rx="14" ry="20" fill="white" opacity="0.95" />
      <circle cx="60" cy="44" r="11" fill="white" opacity="0.95" />
      <path d="M60 49 L68 53 L60 57 Z" fill="#CE1126" />
      <path d="M52 38 L55 30 L58 36 L60 28 L62 36 L65 30 L68 38" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M46 65 Q30 55 12 42 Q16 58 22 66 Q30 74 46 76 Z" fill="white" opacity="0.92" />
      <path d="M74 65 Q90 55 108 42 Q104 58 98 66 Q90 74 74 76 Z" fill="white" opacity="0.92" />
      <path d="M46 65 Q35 62 22 55" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 70 Q33 68 20 62" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M46 75 Q33 74 22 70" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M74 65 Q85 62 98 55" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M74 70 Q87 68 100 62" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M74 75 Q87 74 98 70" stroke="rgba(200,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 90 Q55 100 60 102 Q65 100 70 90 Q64 95 60 96 Q56 95 50 90 Z" fill="white" opacity="0.9" />
      <rect x="52" y="60" width="16" height="22" rx="3" fill="#CE1126" />
      <rect x="52" y="71" width="16" height="11" rx="0" fill="white" />
      <rect x="52" y="71" width="16" height="2" fill="#CE1126" />
    </svg>
  );
}

function BenderaStrip() {
  return (
    <div className="flex w-full h-2 shrink-0">
      <div className="flex-1" style={{ background: "#CE1126" }} />
      <div className="flex-1 bg-white" />
    </div>
  );
}

// ===== SPEECH HOOKS =====

// Ambil suara Indonesia terbaik dari daftar suara browser
// Prioritas: Google Indonesia > Microsoft Indonesia (Natural/Online) > Microsoft Indonesia > suara id-ID lain
function pilihSuaraTerbaik(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const cek = (fn: (v: SpeechSynthesisVoice) => boolean) => voices.find(fn) ?? null;
  const n = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const l = (v: SpeechSynthesisVoice) => v.lang.toLowerCase();

  // Cocok bahasa Indonesia: lang dimulai "id" ATAU nama mengandung "indonesian"/"indonesia"
  const isId = (v: SpeechSynthesisVoice) =>
    l(v).startsWith("id") || n(v).includes("indonesian") || n(v).includes("indonesia");

  return (
    // 1. Google Bahasa Indonesia — terbaik di Chrome Android
    cek(v => isId(v) && n(v).includes("google")) ??
    // 2. Microsoft Natural/Online (Windows 11 / Edge)
    cek(v => isId(v) && n(v).includes("microsoft") && n(v).includes("natural")) ??
    cek(v => isId(v) && n(v).includes("microsoft") && n(v).includes("online")) ??
    // 3. Microsoft Gadis (perempuan) atau Andika (laki-laki)
    cek(v => isId(v) && n(v).includes("gadis")) ??
    cek(v => isId(v) && n(v).includes("andika")) ??
    // 4. Semua Microsoft Indonesia
    cek(v => isId(v) && n(v).includes("microsoft")) ??
    // 5. Suara Indonesia apapun
    cek(v => isId(v)) ??
    // 6. Tidak ada — biarkan browser pakai default id-ID
    null
  );
}

// Pecah teks menjadi kalimat pendek agar intonasi lebih alami
function pecahKalimat(text: string): string[] {
  return text
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[^\w\s.,!?;:()\-–—"'\n]/g, "")
    .replace(/\n+/g, ". ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function useSpeechSynthesis() {
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  const stopSpeak = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    utterancesRef.current = [];
  }, []);

  const speakAira = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    stopSpeak();

    const kalimat = pecahKalimat(text);
    if (!kalimat.length) return;

    const doSpeak = (voices: SpeechSynthesisVoice[]) => {
      const suara = pilihSuaraTerbaik(voices);
      const antrian: SpeechSynthesisUtterance[] = [];

      kalimat.forEach((k, i) => {
        // Jeda singkat antar kalimat agar intonasi terasa natural
        if (i > 0) {
          const jeda = new SpeechSynthesisUtterance(" ");
          jeda.volume = 0;
          jeda.rate = 0.1;
          antrian.push(jeda);
        }
        const u = new SpeechSynthesisUtterance(k);
        u.lang = "id-ID";
        if (suara) u.voice = suara;
        u.rate = 0.9;
        u.pitch = 1.05;
        u.volume = 1;
        antrian.push(u);
      });

      utterancesRef.current = antrian;
      antrian.forEach(u => window.speechSynthesis.speak(u));
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak(voices);
    } else {
      // Tunggu daftar suara siap (perlu di beberapa browser)
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        doSpeak(window.speechSynthesis.getVoices());
      }, { once: true });
    }
  }, [stopSpeak]);

  return { speakAira, stopSpeak };
}

interface ISpeechRecognition extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  start(): void; stop(): void; abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
}
interface SpeechRecognitionAlternative { transcript: string; confidence: number; }
interface SpeechRecognitionResult { [index: number]: SpeechRecognitionAlternative; length: number; }
interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }
interface SpeechRecognitionEvent { results: SpeechRecognitionResultList; }
declare const SpeechRecognition: { new(): ISpeechRecognition } | undefined;

function useSpeechRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState(() => "SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!supported) return;
    const w = window as unknown as Record<string, { new(): ISpeechRecognition }>;
    const SR = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
    if (!SR) return;
    const rec = new SR();
    rec.lang = "id-ID";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) onResult(transcript.trim());
    };

    recognitionRef.current = rec;
    rec.start();
  }, [supported, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, supported, startListening, stopListening };
}

// ===== HOME =====

const KODE_PRIVATE = "0821849112261995";
const KODE_KUIS = "199509";

type WaitingFor = "langkahku" | "refleksi" | "kuis" | null;

// ===== MODAL KODE AKSES =====
const KODE_INFO: Record<NonNullable<WaitingFor>, { icon: string; title: string; sub: string }> = {
  langkahku: { icon: "📅", title: "Langkahku", sub: "Masukkan kode akses Baim" },
  refleksi:  { icon: "🌸", title: "Refleksi",  sub: "Masukkan kode akses Baim" },
  kuis:      { icon: "🏆", title: "Kuis Desa", sub: "Masukkan kode kuis" },
};

function CodeModal({ dest, onClose }: { dest: NonNullable<WaitingFor>; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const expectedCode = dest === "kuis" ? KODE_KUIS : KODE_PRIVATE;
  const info = KODE_INFO[dest];

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const navigateTo = (path: string) => {
    const a = document.createElement("a");
    a.href = path;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const verify = useCallback((val: string) => {
    if (val === expectedCode) {
      if (dest === "kuis") sessionStorage.setItem("baim_kuis_ok", "1");
      else sessionStorage.setItem("baim_private_ok", "1");
      setSuccess(true);
      const path = dest === "langkahku" ? "/langkahku/" : dest === "refleksi" ? "/refleksi/" : "/kuis";
      setTimeout(() => navigateTo(path), 400);
    } else {
      setError("Kode salah. Coba lagi.");
      setShake(true);
      setTimeout(() => { setShake(false); setInput(""); setError(""); }, 650);
    }
  }, [dest, expectedCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, expectedCode.length);
    setInput(val);
    setError("");
    if (val.length === expectedCode.length) verify(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.length >= 4) verify(input);
  };

  const filledDots = Math.min(input.length, expectedCode.length);
  const totalDots = Math.min(expectedCode.length, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl"
        style={{ animation: "slideUp 0.25s cubic-bezier(.22,.68,0,1.2)" }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        {/* Ikon + judul */}
        <div className="text-center mb-5">
          {success
            ? <div className="text-4xl mb-1">✅</div>
            : <div className="text-4xl mb-1">{info.icon}</div>}
          <h2 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>
            {success ? "Kode Benar!" : info.title}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {success ? `Membuka ${info.title}...` : info.sub}
          </p>
        </div>

        {/* Indikator dots */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-150"
              style={{
                background: success
                  ? "#16a34a"
                  : i < filledDots
                    ? "#CE1126"
                    : "rgba(0,0,0,0.12)",
                transform: i < filledDots ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
          {expectedCode.length > 8 && (
            <span className="text-xs text-gray-400 self-center ml-1">
              +{expectedCode.length - 8}
            </span>
          )}
        </div>

        {/* Input */}
        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={input}
              onChange={handleChange}
              placeholder={`${"●".repeat(Math.min(6, expectedCode.length))}`}
              className="w-full h-13 px-4 py-3.5 text-center text-xl tracking-[0.35em] font-mono rounded-2xl border-2 focus:outline-none transition-all"
              style={{
                borderColor: shake ? "#ef4444" : error ? "#fca5a5" : "#e5e7eb",
                background: shake ? "#fef2f2" : "#f9fafb",
              }}
            />
            {error && <p className="text-red-500 text-xs text-center -mt-1">{error}</p>}
            <button
              type="submit"
              disabled={input.length < 4}
              className="w-full h-11 rounded-2xl text-white font-semibold text-sm transition disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}
            >
              Buka
            </button>
            <button type="button" onClick={onClose} className="w-full py-1.5 text-sm text-gray-400">
              Batal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [suaraAktif, setSuaraAktif] = useState(true);
  // Modal kode akses — null = tertutup
  const [codeModalTarget, setCodeModalTarget] = useState<NonNullable<WaitingFor> | null>(null);
  // Bersihkan key lama yang tidak terpisah
  useEffect(() => { localStorage.removeItem("baim_akses"); }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { speakAira, stopSpeak } = useSpeechSynthesis();
  const isSendingRef = useRef(false);

  const addAiraMsg = (text: string) => {
    setMessages((prev) => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: "aira" as const,
      text,
      timestamp: new Date(),
    }]);
    setIsTyping(false);
    isSendingRef.current = false;
  };

  const navigateTo = (path: string) => {
    const a = document.createElement("a");
    a.href = path;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const requestAccess = useCallback((dest: NonNullable<WaitingFor>) => {
    stopSpeak();
    // Jika sudah diverifikasi di sesi ini, langsung buka
    const isPrivate = dest === "langkahku" || dest === "refleksi";
    if (isPrivate && sessionStorage.getItem("baim_private_ok") === "1") {
      navigateTo(dest === "langkahku" ? "/langkahku/" : "/refleksi/");
      return;
    }
    if (dest === "kuis" && sessionStorage.getItem("baim_kuis_ok") === "1") {
      navigateTo("/kuis");
      return;
    }
    // Belum diverifikasi — tampilkan modal kode
    isSendingRef.current = false;
    setCodeModalTarget(dest);
  }, [stopSpeak]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || isTyping || isSendingRef.current) return;
    isSendingRef.current = true;
    stopSpeak();

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    const delay = 450 + Math.random() * 500;
    setTimeout(async () => {
      const lowerText = text.trim().toLowerCase();

      // ===== CEK KEYWORD REFLEKSI =====
      const refleksiKata = ["psikolog reva", "reva", "refleksi"];
      if (refleksiKata.some((k) => lowerText.includes(k))) {
        setIsTyping(false);
        isSendingRef.current = false;
        requestAccess("refleksi");
        return;
      }

      // ===== CEK KEYWORD LANGKAHKU =====
      const langkahkuKata = ["jadwal baim", "langkahku", "langkah ku", "bara", "jadwal hidup baim", "life planner baim", "planner baim", "goals baim", "target baim"];
      if (langkahkuKata.some((k) => lowerText.includes(k))) {
        setIsTyping(false);
        isSendingRef.current = false;
        requestAccess("langkahku");
        return;
      }

      // ===== CEK KEYWORD KUIS =====
      const kuisKata = ["kuis", "quiz", "main kuis", "soal", "tebak soal"];
      if (kuisKata.some((k) => lowerText.includes(k))) {
        setIsTyping(false);
        isSendingRef.current = false;
        requestAccess("kuis");
        return;
      }

      const mathResult = handleMath(text);
      const airaResponse = mathResult ?? getAiraResponse(text);

      let finalText = "";
      let isAI = false;

      if (airaResponse === AI_FALLBACK_MARKER) {
        try {
          const { jawaban } = await tanyaAI(text);
          finalText = jawaban;
          isAI = true;
        } catch {
          finalText = "Maaf, aku sedang tidak bisa menjawab pertanyaan itu saat ini 🙏 Coba tanyakan kembali nanti ya.";
        }
      } else {
        finalText = airaResponse;
      }

      const airaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "aira",
        text: finalText,
        timestamp: new Date(),
        ...(isAI ? { source: "ai" as const } : {}),
      };
      setMessages((prev) => [...prev, airaMsg]);
      setIsTyping(false);
      isSendingRef.current = false;

      if (suaraAktif) speakAira(finalText);
    }, delay);
  }, [isTyping, suaraAktif, speakAira, stopSpeak]);

  const { isListening, supported: micSupported, startListening, stopListening } = useSpeechRecognition(
    useCallback((text: string) => {
      setInputValue(text);
      setTimeout(() => handleSend(text), 100);
    }, [handleSend])
  );

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const toggleSuara = () => {
    if (suaraAktif) stopSpeak();
    setSuaraAktif(v => !v);
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => { saveMessages(messages); }, [messages]);
  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClearChat = () => {
    stopSpeak();
    setMessages(pesanPerkenalan);
    setShowClearConfirm(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const quickTips = ["Apa yang bisa kamu bantu?", "Buat surat", "Bantuan desa", "Tebak-tebakan", "Perangkat desa"];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto shadow-xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fff8f8 0%, #fff0f0 100%)" }}>

      <BenderaStrip />

      {/* Header */}
      <header className="shrink-0 flex flex-col px-4 pt-4 pb-3"
        style={{ background: "linear-gradient(135deg, #a50d1c 0%, #CE1126 60%, #e8192c 100%)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center"
                style={{ background: "linear-gradient(145deg, #b8000f, #8B0000)", border: "2px solid rgba(255,255,255,0.35)" }}>
                <GarudaIcon size={48} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-lime-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-lg tracking-tight">Aira</h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                  Online
                </span>
              </div>
              <p className="text-[11px] font-medium" style={{ color: "rgba(255,220,220,0.95)" }}>{greeting}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col rounded overflow-hidden shadow-sm shrink-0" style={{ width: 22, height: 15 }}>
              <div className="flex-1" style={{ background: "#CE1126" }} />
              <div className="flex-1 bg-white" />
            </div>

            {/* Tombol suara on/off */}
            <button onClick={toggleSuara} title={suaraAktif ? "Matikan suara Aira" : "Hidupkan suara Aira"}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: suaraAktif ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
              {suaraAktif
                ? <Volume2 className="w-3.5 h-3.5 text-white" />
                : <VolumeX className="w-3.5 h-3.5 text-white/50" />}
            </button>

            <button onClick={() => requestAccess("kuis")} title="Kuis Desa"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Trophy className="w-3.5 h-3.5 text-white/85" />
            </button>
            <button onClick={() => setShowClearConfirm(true)} title="Hapus riwayat chat"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Trash2 className="w-3.5 h-3.5 text-white/85" />
            </button>
          </div>
        </div>

        <div className="mt-1.5 text-[9px] text-right uppercase tracking-widest font-semibold"
          style={{ color: "rgba(255,210,210,0.65)" }}>
          🇮🇩 Bumdes Sari Mandiri · Desa Mekar Sari Kec. Keluang
        </div>
      </header>

      <BenderaStrip />

      {/* Navigasi Aplikasi Lain */}
      <div className="shrink-0 flex gap-2 px-3 py-2 border-b" style={{ background: "#fff8f8", borderColor: "#fdd5d8" }}>
        <button onClick={() => requestAccess("langkahku")}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ background: "linear-gradient(135deg, #fff0f0, #ffe0e0)", color: "#a50d1c", border: "1px solid #f5b8bf" }}>
          📅 Langkahku
        </button>
        <button onClick={() => requestAccess("refleksi")}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ background: "linear-gradient(135deg, #f5f0ff, #ede0ff)", color: "#6b21a8", border: "1px solid #d8b4fe" }}>
          🌸 Refleksi
        </button>
      </div>

      {/* Konfirmasi hapus */}
      {showClearConfirm && (
        <div className="z-20 mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm shadow animate-in fade-in">
          <span className="text-red-700 font-medium">Hapus semua riwayat chat?</span>
          <div className="flex gap-2">
            <button onClick={handleClearChat} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700">Hapus</button>
            <button onClick={() => setShowClearConfirm(false)} className="bg-white border text-gray-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-50">Batal</button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="chat-area">
        {messages.map((msg) => (
          <div key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}
            data-testid={`msg-${msg.sender}`}>

            {msg.sender === "aira" && (
              <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-sm flex items-center justify-center"
                style={{ background: "linear-gradient(145deg, #b8000f, #8B0000)" }}>
                <GarudaIcon size={28} />
              </div>
            )}

            <div className={`max-w-[80%] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-line ${
              msg.sender === "user" ? "rounded-2xl rounded-br-sm shadow-md" : "rounded-2xl rounded-bl-sm shadow-sm bg-white"
            }`}
            style={msg.sender === "user" ? {
              background: "linear-gradient(135deg, #a50d1c, #CE1126)",
              color: "white",
            } : { color: "#3d1a1a" }}>
              {renderWithLinks(msg.text)}
              <div className="text-[10px] mt-1 text-right opacity-60">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-sm flex items-center justify-center"
              style={{ background: "linear-gradient(145deg, #b8000f, #8B0000)" }}>
              <GarudaIcon size={28} />
            </div>
            <div className="bg-white shadow-sm px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: "#CE1126", animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Tips */}
      <div className="px-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {quickTips.map((tip, idx) => (
          <button key={idx} onClick={() => handleSend(tip)} disabled={isTyping}
            className="shrink-0 bg-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50"
            style={{ color: "#a50d1c", border: "1px solid #f5b8bf" }}
            data-testid={`btn-quicktip-${idx}`}>
            {tip}
          </button>
        ))}
      </div>

      {/* Notif mikrofon mendengarkan */}
      {isListening && (
        <div className="mx-4 mt-2 px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in"
          style={{ background: "#fff0f0", border: "1px solid #f5b8bf" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#CE1126" }} />
          <span className="text-xs font-medium" style={{ color: "#a50d1c" }}>Aira sedang mendengarkan... bicara sekarang 🎙️</span>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t p-3 flex items-center gap-2 mt-2 shrink-0"
        style={{ borderColor: "#fdd5d8" }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="flex items-center gap-2 w-full">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(inputValue); }
            }}
            placeholder="Tulis pesan atau tekan 🎙️..."
            disabled={isTyping}
            rows={1}
            data-testid="input-message"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            className="flex-1 resize-none overflow-hidden rounded-2xl px-4 py-2.5 text-sm leading-snug focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              background: "#fff5f5",
              border: "1px solid #f5b8bf",
              color: "#3d1a1a",
              maxHeight: "8rem",
            }}
          />

          {/* Tombol mikrofon */}
          {micSupported && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={isTyping}
              title={isListening ? "Berhenti mendengarkan" : "Bicara ke Aira"}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: isListening
                  ? "linear-gradient(135deg, #CE1126, #ff4444)"
                  : "linear-gradient(135deg, #fff0f0, #ffe0e0)",
                border: isListening ? "none" : "1px solid #f5b8bf",
              }}>
              {isListening
                ? <MicOff className="w-4 h-4 text-white" />
                : <Mic className="w-4 h-4" style={{ color: "#a50d1c" }} />}
            </button>
          )}

          {/* Tombol kirim */}
          <button type="submit" disabled={!inputValue.trim() || isTyping}
            data-testid="btn-send"
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #a50d1c, #CE1126)" }}>
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* Modal kode akses */}
      {codeModalTarget && (
        <CodeModal
          dest={codeModalTarget}
          onClose={() => setCodeModalTarget(null)}
        />
      )}
    </div>
  );
}

function KuisGuard() {
  const [, navigate] = useLocation();
  const ok = sessionStorage.getItem("baim_kuis_ok") === "1";
  useEffect(() => {
    if (!ok) navigate("~/");
  }, [ok, navigate]);
  if (!ok) return null;
  return <KuisPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kuis" component={KuisGuard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
