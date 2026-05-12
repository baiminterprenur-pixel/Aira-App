import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCreateOpenrouterConversation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, History, FlaskConical, BookHeart, ChevronLeft, ArrowRight, Pencil, Sprout } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_GOALS = [
  { emoji: "🌿", label: "Lebih tenang" },
  { emoji: "😴", label: "Tidur lebih baik" },
  { emoji: "🧠", label: "Berhenti mikir terus-terusan" },
  { emoji: "⚡", label: "Lebih disiplin" },
  { emoji: "💪", label: "Lebih percaya diri" },
  { emoji: "🚀", label: "Berani mulai usaha" },
  { emoji: "☀️", label: "Lebih optimis" },
  { emoji: "❤️", label: "Lebih bahagia" },
  { emoji: "🎯", label: "Fokus & tidak mudah terganggu" },
  { emoji: "🤝", label: "Hubungan yang lebih baik" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const createConversation = useCreateOpenrouterConversation();
  const [isStarting, setIsStarting] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const activeGoal = showCustomInput ? customGoal.trim() : selectedGoal;

  const handleOpenGoalPicker = () => {
    setSelectedGoal("");
    setCustomGoal("");
    setShowCustomInput(false);
    setShowGoalPicker(true);
  };

  const startSession = async (goal: string) => {
    try {
      setIsStarting(true);
      const title = goal
        ? `Sesi: ${goal}`
        : `Sesi ${format(new Date(), "dd MMM yyyy")}`;
      const conv = await createConversation.mutateAsync({ data: { title } });
      if (goal) {
        sessionStorage.setItem(`refleksi_goal_${conv.id}`, goal);
      }
      setLocation(`/chat/${conv.id}`);
    } catch (e) {
      console.error(e);
      setIsStarting(false);
    }
  };

  const handleConfirm = () => {
    startSession(activeGoal);
  };

  const handleSkip = () => {
    startSession("");
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "10s" }} />

      <div className="max-w-md w-full space-y-10 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-secondary/50 border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-3xl text-primary font-serif italic">R</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide">Refleksi</h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Ruang tenang untuk pikiranmu. Reva hadir untuk mendengar, menemani, dan membantumu tumbuh dari dalam.
          </p>
        </div>

        <div className="space-y-4 flex flex-col items-center pt-8">
          <Button
            onClick={handleOpenGoalPicker}
            disabled={isStarting}
            size="lg"
            className="w-full max-w-[280px] h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-medium tracking-wide shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            {isStarting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
            Mulai Sesi Baru
          </Button>

          <div className="w-full max-w-[280px] grid grid-cols-4 gap-2">
            <Link href="/sessions" className="flex-1">
              <Button variant="outline" size="lg" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm tracking-wide transition-all duration-300 flex-col gap-1 h-auto py-3 rounded-2xl">
                <History className="w-4 h-4 opacity-70" />
                <span className="text-[10px]">Riwayat</span>
              </Button>
            </Link>
            <Link href="/harian" className="flex-1">
              <Button variant="outline" size="lg" className="w-full border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-sm tracking-wide transition-all duration-300 flex-col gap-1 h-auto py-3 rounded-2xl">
                <BookHeart className="w-4 h-4 opacity-80" />
                <span className="text-[10px]">Jurnal</span>
              </Button>
            </Link>
            <Link href="/latihan" className="flex-1">
              <Button variant="outline" size="lg" className="w-full border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-300 font-medium text-sm tracking-wide transition-all duration-300 flex-col gap-1 h-auto py-3 rounded-2xl">
                <Sprout className="w-4 h-4 opacity-80" />
                <span className="text-[10px]">Latihan</span>
              </Button>
            </Link>
            <Link href="/tes" className="flex-1">
              <Button variant="outline" size="lg" className="w-full border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm tracking-wide transition-all duration-300 flex-col gap-1 h-auto py-3 rounded-2xl">
                <FlaskConical className="w-4 h-4 opacity-80" />
                <span className="text-[10px]">Tes Diri</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Goal Picker Overlay */}
      <AnimatePresence>
        {showGoalPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
          >
            <div className="pointer-events-none absolute top-0 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-[80px]" />

            {/* Header */}
            <div className="flex items-center px-5 pt-6 pb-2 flex-shrink-0">
              <button
                onClick={() => setShowGoalPicker(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors mr-3"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              <div>
                <h2 className="text-white font-serif text-lg leading-tight">Apa tujuan utamamu?</h2>
                <p className="text-white/40 text-xs mt-0.5">Reva akan menyesuaikan percakapan ke arah ini</p>
              </div>
            </div>

            {/* Goals Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 overflow-y-auto px-5 py-4"
            >
              <div className="max-w-md mx-auto space-y-3">
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_GOALS.map((g) => {
                    const isSelected = !showCustomInput && selectedGoal === g.label;
                    return (
                      <button
                        key={g.label}
                        onClick={() => {
                          setSelectedGoal(g.label);
                          setShowCustomInput(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <span>{g.emoji}</span>
                        <span>{g.label}</span>
                      </button>
                    );
                  })}

                  {/* Custom goal button */}
                  <button
                    onClick={() => {
                      setShowCustomInput(true);
                      setSelectedGoal("");
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                      showCustomInput
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Tulis sendiri...</span>
                  </button>
                </div>

                {/* Custom input */}
                <AnimatePresence>
                  {showCustomInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && customGoal.trim()) handleConfirm(); }}
                        placeholder="Contoh: lebih sabar dengan diri sendiri..."
                        className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
                        maxLength={80}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected goal preview */}
                {activeGoal && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mt-2"
                  >
                    <p className="text-xs text-primary/70 mb-1">Tujuan sesi ini:</p>
                    <p className="text-white text-sm font-medium">"{activeGoal}"</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Bottom Actions */}
            <div className="flex-shrink-0 px-5 pb-8 pt-4 max-w-md mx-auto w-full space-y-2.5">
              <Button
                onClick={handleConfirm}
                disabled={!activeGoal || isStarting}
                className="w-full h-13 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Mulai dengan tujuan ini
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <button
                onClick={handleSkip}
                disabled={isStarting}
                className="w-full py-2.5 text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                Lewati, langsung mulai
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
