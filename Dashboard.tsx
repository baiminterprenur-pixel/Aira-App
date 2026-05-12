import { useEffect, useState } from "react";
import { useGetLangkahkuProfile, useGetLangkahkuStats, useListLangkahkuTasks, useListLangkahkuGoals, useUpdateLangkahkuTask, getGetLangkahkuProfileQueryKey, getGetLangkahkuStatsQueryKey, getListLangkahkuTasksQueryKey, getListLangkahkuGoalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, CheckSquare, Check, Calendar, ChevronRight, PlusCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { scheduleTaskReminders, getNotifPermission } from "@/lib/notifications";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetLangkahkuProfile({ query: { queryKey: getGetLangkahkuProfileQueryKey() } });
  const { data: stats } = useGetLangkahkuStats({ query: { queryKey: getGetLangkahkuStatsQueryKey() } });
  const { data: tasks } = useListLangkahkuTasks({ query: { queryKey: getListLangkahkuTasksQueryKey() } });
  const { data: goals } = useListLangkahkuGoals({ query: { queryKey: getListLangkahkuGoalsQueryKey() } });
  const updateTask = useUpdateLangkahkuTask();
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    if (tasks && getNotifPermission() === "granted") {
      scheduleTaskReminders(tasks);
    }
  }, [tasks]);

  const toggleComplete = (taskId: number, current: boolean) => {
    updateTask.mutate(
      { id: taskId, data: { completed: !current } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLangkahkuTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLangkahkuStatsQueryKey() });
        },
      }
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayTasks = tasks?.filter(t => t.date === todayStr) || [];
  const activeGoals = goals?.filter(g => g.status === "active").slice(0, 3) || [];

  const upcomingTasksList = (tasks || [])
    .filter(t => t.date > todayStr)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });

  const upcomingByDate: Record<string, typeof upcomingTasksList> = {};
  for (const t of upcomingTasksList) {
    if (!upcomingByDate[t.date]) upcomingByDate[t.date] = [];
    upcomingByDate[t.date].push(t);
  }

  const taskProgress = stats?.totalTasksToday
    ? Math.round((stats.completedTasksToday / stats.totalTasksToday) * 100)
    : 0;

  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, <span className="text-primary">{profile?.name || "Kawan"}</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-foreground/80 font-medium">Tugas Hari Ini</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-4xl font-bold">{stats?.completedTasksToday || 0}</h3>
                  <span className="text-primary-foreground/80">/ {stats?.totalTasksToday || 0} selesai</span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={taskProgress} className="h-2 bg-black/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-secondary text-secondary-foreground rounded-2xl">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Goals Berjalan</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.inProgressGoals || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
          onClick={() => setShowUpcoming(true)}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-secondary text-secondary-foreground rounded-2xl">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">Tugas Mendatang</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.upcomingTasks || 0}</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-lg">Jadwal Hari Ini</CardTitle>
              <CardDescription>Apa yang perlu diselesaikan?</CardDescription>
            </div>
            <Link href="/jadwal" className="text-sm text-primary font-medium flex items-center hover:underline">
              Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CheckSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-4">Belum ada tugas hari ini.</p>
                <Link href="/bara">
                  <Button variant="outline" className="rounded-full">
                    💬 Susun dengan Bara
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {todayTasks.slice(0, 5).map(task => (
                  <div
                    key={task.id}
                    className={`p-4 flex items-center gap-3 transition-all ${task.completed ? "opacity-60" : "hover:bg-muted/50"}`}
                  >
                    <button
                      onClick={() => toggleComplete(task.id, task.completed)}
                      disabled={updateTask.isPending}
                      className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        task.completed
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                      title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate transition-all ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.title}
                      </p>
                      {task.time && <p className="text-xs text-muted-foreground">⏰ {task.time}</p>}
                    </div>
                    {task.completed && (
                      <span className="text-xs text-green-600 font-medium flex-shrink-0">✓ Selesai</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-lg">Progress Goals</CardTitle>
              <CardDescription>Tetap fokus pada tujuanmu.</CardDescription>
            </div>
            <Link href="/goals" className="text-sm text-primary font-medium flex items-center hover:underline">
              Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {activeGoals.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-4">Belum ada target aktif.</p>
                <Link href="/goals">
                  <Button variant="outline" className="rounded-full">
                    <PlusCircle className="w-4 h-4 mr-2" /> Buat Goal Baru
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {activeGoals.map(goal => (
                  <div key={goal.id} className="p-5 flex flex-col gap-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-foreground">{goal.title}</div>
                      <span className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jelajahi Semua Fitur */}
      <div>
        <h2 className="text-xl font-bold mb-1">Jelajahi Semua Fitur</h2>
        <p className="text-sm text-muted-foreground mb-4">Langkahku punya banyak alat untuk membantumu tumbuh setiap hari.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { path: "/goals", emoji: "🎯", label: "Goals & Target", desc: "Catat dan pantau target besarmu" },
            { path: "/jadwal", emoji: "📅", label: "Jadwal Harian", desc: "Atur kegiatan per hari" },
            { path: "/habits", emoji: "🔥", label: "Kebiasaan", desc: "Bangun rutinitas positif" },
            { path: "/journal", emoji: "📓", label: "Jurnal", desc: "Catatan & refleksi harian" },
            { path: "/pomodoro", emoji: "⏱️", label: "Pomodoro", desc: "Timer fokus 25 menit" },
            { path: "/visi", emoji: "🧭", label: "Visi & Misi", desc: "Arah dan tujuan hidupmu" },
            { path: "/bara", emoji: "💬", label: "Chat Bara", desc: "AI coach pribadimu" },
          ].map(item => (
            <Link key={item.path} href={item.path}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full group">
                <CardContent className="p-4">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="font-semibold text-sm mt-2 group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Dialog Tugas Mendatang */}
    <Dialog open={showUpcoming} onOpenChange={setShowUpcoming}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Tugas Mendatang
            <span className="text-sm font-normal text-muted-foreground ml-1">({upcomingTasksList.length} tugas)</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {upcomingTasksList.length === 0 ? (
            <div className="py-10 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">Tidak ada tugas mendatang.</p>
              <Link href="/jadwal" onClick={() => setShowUpcoming(false)}>
                <Button variant="outline" size="sm" className="mt-3 rounded-full">
                  <PlusCircle className="w-4 h-4 mr-2" /> Tambah Jadwal
                </Button>
              </Link>
            </div>
          ) : (
            Object.entries(upcomingByDate).map(([date, dateTasks]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  {format(parseISO(date), "EEEE, d MMMM yyyy", { locale: id })}
                </p>
                <div className="space-y-2">
                  {dateTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border bg-card ${task.completed ? "opacity-50" : ""}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.completed ? "bg-green-500" : "bg-primary/40"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        {task.time && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {task.time}
                          </p>
                        )}
                      </div>
                      {task.category && (
                        <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full flex-shrink-0">
                          {task.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        {upcomingTasksList.length > 0 && (
          <div className="pt-3 border-t">
            <Link href="/jadwal" onClick={() => setShowUpcoming(false)}>
              <Button variant="outline" className="w-full rounded-full">
                Buka Halaman Jadwal <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
