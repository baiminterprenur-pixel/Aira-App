import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import { savePin, verifyPin, hasPin, removePin } from "@/lib/pin";

type Mode = "enter" | "setup" | "confirm";

interface PinLockProps {
  onUnlock: () => void;
}

const DOT_COUNT = 4;

export default function PinLock({ onUnlock }: PinLockProps) {
  const [mode, setMode] = useState<Mode>(hasPin() ? "enter" : "setup");
  const [inputValue, setInputValue] = useState("");
  const firstPinRef = useRef("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [mode]);

  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (lockedUntil) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setError("");
    setInputValue(val);
  };

  const handleSubmit = useCallback(async () => {
    if (lockedUntil) return;

    if (mode === "enter") {
      const ok = await verifyPin(inputValue);
      if (ok) {
        setAttempts(0);
        onUnlock();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockedUntil(Date.now() + 30_000);
          setTimeLeft(30);
          setError("Terlalu banyak percobaan. Tunggu 30 detik.");
        } else {
          setError(`PIN salah. ${5 - newAttempts} percobaan tersisa.`);
        }
        triggerShake();
        setInputValue("");
      }
    } else if (mode === "setup") {
      if (inputValue.length < 4) {
        setError("PIN minimal 4 digit.");
        triggerShake();
        return;
      }
      firstPinRef.current = inputValue;
      setInputValue("");
      setError("");
      setMode("confirm");
    } else if (mode === "confirm") {
      if (inputValue.length < 4) {
        setError("PIN minimal 4 digit.");
        triggerShake();
        return;
      }
      if (inputValue !== firstPinRef.current) {
        setError("PIN tidak cocok. Mulai ulang.");
        triggerShake();
        firstPinRef.current = "";
        setInputValue("");
        setMode("setup");
        return;
      }
      await savePin(inputValue);
      onUnlock();
    }
  }, [mode, inputValue, attempts, lockedUntil, onUnlock, triggerShake]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.length >= 4) handleSubmit();
  };

  const filledDots = Math.min(inputValue.length, DOT_COUNT);

  const titles: Record<Mode, string> = {
    enter: "Masukkan PIN",
    setup: "Buat PIN Baru",
    confirm: "Konfirmasi PIN",
  };

  const subtitles: Record<Mode, string> = {
    enter: "Masukkan PIN untuk membuka Refleksi",
    setup: "Pilih PIN minimal 4 digit untuk mengamankan ruang pribadimu",
    confirm: "Ketik ulang PIN yang sama untuk konfirmasi",
  };

  const buttonLabel =
    mode === "enter"
      ? lockedUntil
        ? `Tunggu ${timeLeft} detik...`
        : "Buka"
      : mode === "setup"
      ? "Lanjut"
      : "Simpan PIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0d12] overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-sm mx-4"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
              {mode === "enter" ? (
                <Lock className="w-7 h-7 text-primary" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-wide">{titles[mode]}</h1>
              <p className="text-sm text-white/40 mt-1 leading-relaxed">{subtitles[mode]}</p>
            </div>
          </div>

          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-4"
          >
            {Array.from({ length: DOT_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i < filledDots ? 1.15 : 1,
                  backgroundColor:
                    shake && error
                      ? "rgb(239, 68, 68)"
                      : i < filledDots
                      ? "hsl(var(--primary))"
                      : "rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.15 }}
                className="w-4 h-4 rounded-full border border-white/10"
              />
            ))}
          </motion.div>

          <div className="w-full relative">
            <input
              ref={inputRef}
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={!!lockedUntil}
              placeholder="••••"
              className="w-full h-14 text-center text-lg tracking-[0.4em] font-mono rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 disabled:opacity-40 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPin((v) => !v)}
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={error}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400/80 text-center -mt-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={inputValue.length < 4 || !!lockedUntil}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>

            {mode === "confirm" && (
              <button
                onClick={() => {
                  firstPinRef.current = "";
                  setInputValue("");
                  setError("");
                  setMode("setup");
                }}
                className="flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali
              </button>
            )}

            {mode === "enter" && (
              <button
                onClick={() => {
                  if (confirm("Hapus PIN? Kamu perlu membuat PIN baru.")) {
                    removePin();
                    firstPinRef.current = "";
                    setInputValue("");
                    setError("");
                    setMode("setup");
                  }
                }}
                className="flex items-center justify-center gap-2 text-xs text-white/20 hover:text-white/40 transition-colors mx-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Lupa PIN? Reset
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
