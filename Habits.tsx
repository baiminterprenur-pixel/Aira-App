import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Flame } from "lucide-react";
import { PageInfo } from "@/components/PageInfo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Habit {
  id: number;
  name: string;
  icon: string;
  frequency: string;
  streak: number;
  todayCompleted: boolean;
}

const HABIT_ICONS = ["🏃", "📚", "💧", "🧘", "💪", "🎯", "🍎", "✏️", "🎵", "💤", "🙏", "🌅", "🤸", "🚶", "🧠", "🌿"];

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🏃");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);
  const { toast } = useToast();

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch(`/api/langkahku/habits?date=${today}`);
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Gagal memuat kebiasaan", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const toggleHabit = async (habitId: number) => {
    setToggling(habitId);
    try {
      const res = await fetch(`/api/langkahku/habits/${habitId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      const data = await res.json();
      setHabits(prev => prev.map(h =>
        h.id === habitId ? { ...h, todayCompleted: data.completed, streak: data.streak } : h
      ));
    } catch {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  const addHabit = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/langkahku/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), icon: newIcon }),
      });
      const newHabit = await res.json();
      setHabits(prev => [...prev, { ...newHabit, streak: 0, todayCompleted: false }]);
      setIsAdding(false);
      setNewName("");
      setNewIcon("🏃");
      toast({ title: "Kebiasaan berhasil ditambahkan!" });
    } catch {
      toast({ title: "Gagal menambahkan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteHabit = async (habitId: number) => {
    try {
      await fetch(`/api/langkahku/habits/${habitId}`, { method: "DELETE" });
      setHabits(prev => prev.filter(h => h.id !== habitId));
      toast({ title: "Kebiasaan dihapus" });
    } catch {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const doneCount = habits.filter(h => h.todayCompleted).length;
  const allDone = habits.length > 0 && doneCount === habits.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Kebiasaan</h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}</p>
        </div>
        <Button className="rounded-full shadow-md" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>

      <PageInfo
        pageKey="habits"
        description="Bangun kebiasaan positif hari demi hari. Centang setiap kebiasaan yang sudah kamu lakukan, dan lihat streak (hari beruntun) terus bertambah. Konsistensi kecil = perubahan besar!"
        tips={[
          "Klik '+ Tambah' untuk membuat kebiasaan baru",
          "Centang kebiasaan setiap hari agar streak tidak putus",
          "Streak 🔥 dihitung dari hari berturut-turut tanpa jeda",
        ]}
      />

      {habits.length > 0 && (
        <div className={cn(
          "rounded-2xl p-4 border text-center transition-all",
          allDone ? "bg-primary/10 border-primary/20" : "bg-muted/40 border-border"
        )}>
          {allDone ? (
            <p className="text-primary font-semibold">🎉 Semua kebiasaan hari ini selesai! Luar biasa!</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-foreground">{doneCount}/{habits.length}</span> kebiasaan selesai hari ini
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Card key={i} className="h-40 animate-pulse bg-muted" />)}
        </div>
      ) : habits.length === 0 ? (
        <Card className="border-dashed bg-transparent">
          <CardContent className="p-12 flex flex-col items-center text-center">
            <span className="text-6xl mb-4">🌱</span>
            <p className="font-semibold text-lg">Belum ada kebiasaan</p>
            <p className="text-muted-foreground text-sm mt-1 mb-4">Mulai bangun rutinitas positifmu hari ini</p>
            <Button onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-2" /> Tambah Kebiasaan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {habits.map(habit => (
            <Card
              key={habit.id}
              className={cn(
                "transition-all duration-300",
                habit.todayCompleted
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : "hover:shadow-md hover:border-primary/30"
              )}
            >
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="text-4xl leading-none">{habit.icon}</span>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1">
                  <p className={cn("font-semibold leading-tight text-sm", habit.todayCompleted && "text-primary")}>
                    {habit.name}
                  </p>
                  {habit.streak > 0 ? (
                    <span className="text-xs flex items-center gap-1 text-orange-500 mt-1 font-medium">
                      <Flame className="w-3 h-3" /> {habit.streak} hari beruntun
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-1 block">Mulai streak-mu!</span>
                  )}
                </div>

                <button
                  onClick={() => toggleHabit(habit.id)}
                  disabled={toggling === habit.id}
                  className={cn(
                    "w-full py-2 rounded-xl text-xs font-semibold transition-all border",
                    habit.todayCompleted
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary hover:text-primary bg-background"
                  )}
                >
                  {toggling === habit.id ? "..." : habit.todayCompleted ? "✓ Selesai" : "Tandai Selesai"}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Kebiasaan Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Kebiasaan</label>
              <Input
                className="mt-1"
                placeholder="Contoh: Olahraga 30 menit"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addHabit()}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pilih Ikon</label>
              <div className="grid grid-cols-8 gap-1.5 mt-2">
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={cn(
                      "text-2xl p-1.5 rounded-lg transition-all",
                      newIcon === icon ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={addHabit} disabled={saving || !newName.trim()}>
              {saving ? "Menyimpan..." : "Simpan Kebiasaan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
