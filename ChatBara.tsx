import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useGetLangkahkuProfile, useListLangkahkuTasks, useCreateLangkahkuTask, getGetLangkahkuProfileQueryKey, getListLangkahkuTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import baraAvatar from "@/assets/bara-avatar.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, Sparkles, CalendarPlus, Trash2, Bell, BellOff, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { scheduleTaskReminders, requestNotifPermission, getNotifPermission } from "@/lib/notifications";
import { format } from "date-fns";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ExtractedTask {
  title: string;
  time: string;
  category: string;
}

// Deteksi apakah pesan Bara mengandung jadwal terformat
// Format yang dikenali: "07.00 – Kegiatan" atau "07:00 – Kegiatan"
function hasScheduleContent(text: string): boolean {
  const scheduleLinePattern = /\b\d{1,2}[.:]\d{2}\s*[–—\-]\s*.{3,}/g;
  const matches = text.match(scheduleLinePattern);
  return (matches?.length ?? 0) >= 2;
}

export default function ChatBara() {
  const [, setLocation] = useLocation();
  const { data: profile } = useGetLangkahkuProfile({ query: { queryKey: getGetLangkahkuProfileQueryKey() } });
  const { data: allTasks } = useListLangkahkuTasks({ query: { queryKey: getListLangkahkuTasksQueryKey() } });
  const queryClient = useQueryClient();
  const createTask = useCreateLangkahkuTask();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractingMsgIdx, setExtractingMsgIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [notifPerm, setNotifPerm] = useState(getNotifPermission());
  const overdueCheckedRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef(profile);
  useEffect(() => { profileRef.current = profile; }, [profile]);

  useEffect(() => {
    const isFirstRun = localStorage.getItem("lk_bara_firstrun") === "1";
    if (isFirstRun) {
      localStorage.removeItem("lk_bara_firstrun");
      localStorage.removeItem("lk_bara_messages");
      setMessages([]);
      setTimeout(() => triggerFirstRunWelcome(), 600);
    } else {
      const saved = localStorage.getItem("lk_bara_messages");
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch { /* skip */ }
      } else {
        setMessages([{
          role: "assistant",
          content: "Halo! Aku Bara, sahabat perjalananmu. Ceritakan rencanamu hari ini — mau ngapain aja? Aku bantu susunkan jadwalnya!"
        }]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cek overdue tasks sekali per hari saat tasks dimuat
  useEffect(() => {
    if (!allTasks || overdueCheckedRef.current) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const todayKey = `lk_bara_overdue_${today}`;
    if (sessionStorage.getItem(todayKey) === "1") return;

    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const overdue = allTasks.filter(t => {
      if (t.date !== today || t.completed || !t.time) return false;
      const [h, m] = t.time.split(":").map(Number);
      const taskMinutes = h * 60 + m;
      return taskMinutes < nowMinutes - 30; // lebih dari 30 menit lewat
    });

    if (overdue.length === 0) return;
    overdueCheckedRef.current = true;
    sessionStorage.setItem(todayKey, "1");

    const overdueTasks = overdue.map(t => `${t.time} – ${t.title}`);
    setTimeout(() => {
      streamBara([], { overdueCheck: true, overdueTasks });
    }, 800);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lk_bara_messages", JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamBara = async (msgHistory: Message[], extraBody?: Record<string, unknown>) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const p = profileRef.current;
    const userContext = p
      ? { name: p.name, vision: p.vision, mission: p.mission, occupation: p.occupation }
      : undefined;

    try {
      const response = await fetch("/api/langkahku/bara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgHistory, userContext, ...extraBody }),
      });

      if (!response.body) throw new Error("Tidak ada respons");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamed = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n").filter(l => l.trim())) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              streamed += parsed.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: streamed };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => prev.slice(0, -1));
      toast({ title: "Bara tidak bisa dihubungi", description: "Coba lagi ya!", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFirstRunWelcome = () => streamBara([], { firstRun: true });

  const handleAnalyzeTargets = async () => {
    if (isAnalyzing || isLoading) return;
    setIsAnalyzing(true);

    const introMsg: Message = { role: "user", content: "Bara, tolong analisis target harianku, mingguan, bulanan, dan tahunanku sekarang!" };
    const baraPlaceholder: Message = { role: "assistant", content: "" };
    const newMessages = [...messages, introMsg, baraPlaceholder];
    setMessages(newMessages);

    try {
      const p = profileRef.current;
      const res = await fetch("/api/langkahku/bara/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContext: {
            name: p?.name,
            occupation: p?.occupation,
            vision: p?.vision,
            mission: p?.mission,
          },
        }),
      });

      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamed = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.content) {
              streamed += parsed.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: streamed };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => prev.slice(0, -2));
      toast({ title: "Gagal menganalisis target", description: "Coba lagi ya!", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await streamBara(newMessages);
  };

  // Ekstrak jadwal dari percakapan dan tampilkan dialog konfirmasi
  const handleExtractSchedule = async (triggerMsgIdx?: number) => {
    if (messages.length < 2) {
      toast({ title: "Obrolan masih sedikit", description: "Ceritakan dulu jadwalmu ke Bara, baru simpan!" });
      return;
    }
    if (triggerMsgIdx !== undefined) setExtractingMsgIdx(triggerMsgIdx);
    else setIsExtracting(true);

    try {
      const res = await fetch("/api/langkahku/bara/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data: { tasks: ExtractedTask[] } = await res.json();
      if (!data.tasks?.length) {
        toast({ title: "Tidak ada jadwal ditemukan", description: "Coba ceritakan kegiatanmu lebih detail ke Bara." });
        return;
      }
      setExtractedTasks(data.tasks);
      setShowDialog(true);
    } catch {
      toast({ title: "Gagal membaca jadwal", description: "Coba lagi ya!", variant: "destructive" });
    } finally {
      setExtractingMsgIdx(null);
      setIsExtracting(false);
    }
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    const today = format(new Date(), "yyyy-MM-dd");
    try {
      const existingTasks = (queryClient.getQueryData(getListLangkahkuTasksQueryKey()) as any[]) || [];
      const todayExisting = existingTasks.filter((t: any) => t.date === today);

      const uniqueTasks = extractedTasks.filter(
        task => !todayExisting.some(
          (e: any) => e.title.trim().toLowerCase() === task.title.trim().toLowerCase()
        )
      );
      const skippedCount = extractedTasks.length - uniqueTasks.length;

      for (const task of uniqueTasks) {
        await createTask.mutateAsync({
          data: {
            title: task.title,
            date: today,
            time: task.time || undefined,
            category: task.category || "Pribadi",
          }
        });
      }
      await queryClient.invalidateQueries({ queryKey: getListLangkahkuTasksQueryKey() });

      const skippedNote = skippedCount > 0 ? ` (${skippedCount} sudah ada, dilewati)` : "";

      if (getNotifPermission() === "granted") {
        const saved = await queryClient.fetchQuery({ queryKey: getListLangkahkuTasksQueryKey() });
        scheduleTaskReminders(saved as any);
        toast({
          title: `${uniqueTasks.length} tugas tersimpan!`,
          description: `Pengingat otomatis aktif.${skippedNote}`,
        });
      } else {
        toast({
          title: `${uniqueTasks.length} tugas tersimpan!`,
          description: `Aktifkan notifikasi untuk pengingat otomatis.${skippedNote}`,
        });
      }

      setShowDialog(false);
      setLocation("/jadwal");
    } catch {
      toast({ title: "Gagal menyimpan", description: "Coba lagi ya!", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotifPermission();
    setNotifPerm(getNotifPermission());
    if (granted) {
      toast({ title: "Notifikasi aktif!", description: "Kamu akan dapat pengingat sesuai jadwal." });
    } else {
      toast({ title: "Notifikasi tidak diizinkan", description: "Aktifkan di pengaturan browser kamu.", variant: "destructive" });
    }
  };

  const hasEnoughConversation = messages.filter(m => m.role === "user").length >= 1;

  return (
    <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-64px)] flex flex-col max-w-3xl mx-auto bg-card rounded-2xl md:rounded-3xl shadow-sm border overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b bg-primary/5 flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarImage src={baraAvatar} alt="Bara" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-6 h-6" /></AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-1">
            Bara <Sparkles className="w-4 h-4 text-primary" />
          </h2>
          <p className="text-xs text-muted-foreground">Ceritakan rencanamu, minta jadwal otomatis, atau analisis target hidupmu.</p>
        </div>

        <div className="flex items-center gap-2">
          {notifPerm !== "granted" && notifPerm !== "denied" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 rounded-full border-primary/30 text-primary hover:bg-primary/10"
              onClick={handleRequestNotif}
            >
              <Bell className="w-3.5 h-3.5" /> Aktifkan Notif
            </Button>
          )}
          {notifPerm === "granted" && (
            <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
              <Bell className="w-3.5 h-3.5" /> Notif aktif
            </span>
          )}
          {notifPerm === "denied" && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BellOff className="w-3.5 h-3.5" /> Notif nonaktif
            </span>
          )}

          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/10 shadow-sm"
            onClick={handleAnalyzeTargets}
            disabled={isAnalyzing || isLoading}
          >
            {isAnalyzing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <BarChart2 className="w-3.5 h-3.5" />}
            {isAnalyzing ? "Menganalisis..." : "Analisis Target"}
          </Button>

          {hasEnoughConversation && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs gap-1.5 rounded-full text-muted-foreground hover:text-primary"
              onClick={() => handleExtractSchedule()}
              disabled={isExtracting || isLoading}
            >
              {isExtracting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <CalendarPlus className="w-3.5 h-3.5" />}
              {isExtracting ? "Membaca..." : "Simpan Jadwal"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Hapus semua riwayat obrolan?")) {
                localStorage.removeItem("lk_bara_messages");
                setMessages([{ role: "assistant", content: "Riwayat dibersihkan. Mau mulai obrolan baru?" }]);
              }
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Bersihkan
          </Button>
        </div>
      </div>

      {/* Area Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isLastMsg = idx === messages.length - 1;
          const isStreamingThisMsg = isLoading && isLastMsg && msg.role === "assistant";
          const showScheduleBtn =
            msg.role === "assistant" &&
            !isStreamingThisMsg &&
            msg.content.length > 0 &&
            hasScheduleContent(msg.content);

          return (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarImage src={baraAvatar} alt="Bara" className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm whitespace-pre-wrap"
                )}>
                  {msg.content || (isStreamingThisMsg
                    ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Bara sedang mengetik...</span>
                    : "")}
                </div>

                {/* Tombol inline Masukan Jadwal */}
                {showScheduleBtn && (
                  <Button
                    size="sm"
                    className="self-start rounded-full gap-2 shadow-sm text-xs h-8 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-all"
                    onClick={() => handleExtractSchedule(idx)}
                    disabled={extractingMsgIdx === idx || isExtracting || isLoading}
                  >
                    {extractingMsgIdx === idx
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <CalendarPlus className="w-3 h-3" />}
                    {extractingMsgIdx === idx ? "Membaca jadwal..." : "Masukan Jadwal"}
                  </Button>
                )}
              </div>

              {msg.role === "user" && (
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ceritakan rencanamu atau tanyakan sesuatu..."
            className="pr-12 py-6 rounded-full bg-card shadow-sm border-primary/20 focus-visible:ring-primary/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 rounded-full w-10 h-10"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Dialog Konfirmasi Jadwal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-primary" />
              Masukan ke Jadwal Hari Ini
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Bara menemukan <strong>{extractedTasks.length} kegiatan</strong> dari obrolan kita. Periksa dulu sebelum disimpan.
          </p>

          <div className="flex-1 overflow-y-auto space-y-2 py-2">
            {extractedTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/40 group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.time && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        ⏰ {task.time}
                      </span>
                    )}
                    <Badge variant="secondary" className="text-xs py-0">
                      {task.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  onClick={() => setExtractedTasks(prev => prev.filter((_, j) => j !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {notifPerm !== "granted" && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
              <Bell className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Aktifkan notifikasi agar mendapat pengingat otomatis sesuai jam jadwal kamu.</span>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
              Batal
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={isSaving || extractedTasks.length === 0}
              className="flex-1 gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : `Simpan ${extractedTasks.length} Tugas`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
