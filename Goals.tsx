import { useState } from "react";
import { useListLangkahkuGoals, useCreateLangkahkuGoal, useUpdateLangkahkuGoal, useDeleteLangkahkuGoal, getListLangkahkuGoalsQueryKey, getGetLangkahkuStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Target, Plus, Search, Trash2, Edit2 } from "lucide-react";
import { PageInfo } from "@/components/PageInfo";
import { format } from "date-fns";

const goalSchema = z.object({
  title: z.string().min(2, "Judul diperlukan"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori diperlukan"),
  deadline: z.string().optional(),
});

type GoalValues = z.infer<typeof goalSchema>;

export default function Goals() {
  const queryClient = useQueryClient();
  const { data: goals, isLoading } = useListLangkahkuGoals({ query: { queryKey: getListLangkahkuGoalsQueryKey() } });
  const createGoal = useCreateLangkahkuGoal();
  const updateGoal = useUpdateLangkahkuGoal();
  const deleteGoal = useDeleteLangkahkuGoal();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"

  const form = useForm<GoalValues>({
    resolver: zodResolver(goalSchema as any),
    defaultValues: { title: "", description: "", category: "Pribadi", deadline: "" },
  });

  const handleOpenDialog = (goal?: any) => {
    if (goal) {
      setEditingId(goal.id);
      form.reset({
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        deadline: goal.deadline || "",
      });
    } else {
      setEditingId(null);
      form.reset({ title: "", description: "", category: "Pribadi", deadline: "" });
    }
    setIsOpen(true);
  };

  const onSubmit = (data: GoalValues) => {
    if (editingId) {
      updateGoal.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListLangkahkuGoalsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetLangkahkuStatsQueryKey() });
            setIsOpen(false);
          },
        }
      );
    } else {
      createGoal.mutate(
        { data: { ...data, progress: 0, status: "active" } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListLangkahkuGoalsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetLangkahkuStatsQueryKey() });
            setIsOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus goal ini?")) {
      deleteGoal.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListLangkahkuGoalsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetLangkahkuStatsQueryKey() });
          },
        }
      );
    }
  };

  const handleProgressUpdate = (id: number, currentProgress: number, change: number) => {
    const newProgress = Math.max(0, Math.min(100, currentProgress + change));
    const status = newProgress === 100 ? "completed" : "active";
    
    updateGoal.mutate(
      { id, data: { progress: newProgress, status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLangkahkuGoalsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLangkahkuStatsQueryKey() });
        },
      }
    );
  };

  const filteredGoals = goals?.filter((g) => {
    if (filter !== "all" && g.status !== filter) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goals & Target</h1>
          <p className="text-muted-foreground mt-1">Lacak pencapaian dan impianmu di sini.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Buat Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Goal" : "Goal Baru"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Judul</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Pribadi">Pribadi</SelectItem>
                        <SelectItem value="Karier">Karier</SelectItem>
                        <SelectItem value="Keuangan">Keuangan</SelectItem>
                        <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                        <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="deadline" render={({ field }) => (
                  <FormItem><FormLabel>Tenggat Waktu (Opsional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createGoal.isPending || updateGoal.isPending}>Simpan</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <PageInfo
        pageKey="goals"
        description="Catat semua target besar hidupmu — karier, tabungan, kesehatan, dan lainnya. Pantau progressnya, beri deadline, lalu Bara akan bantu memecahnya jadi langkah harian yang bisa dijalani."
        tips={[
          "Klik '+ Buat Goal' untuk menambahkan target baru",
          "Update persentase progress setiap kali ada kemajuan",
          "Goal yang selesai bisa ditandai 'Completed' agar rapi",
        ]}
      />

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari goal..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full bg-card shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="rounded-full flex-shrink-0">Semua</Button>
          <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")} className="rounded-full flex-shrink-0">Berjalan</Button>
          <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")} className="rounded-full flex-shrink-0">Selesai</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Card key={i} className="h-40 animate-pulse bg-muted" />)}
        </div>
      ) : filteredGoals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Belum ada Goal</h3>
            <p className="text-muted-foreground max-w-sm mt-2">Mulai dengan menetapkan satu target kecil untuk hari ini atau minggu ini.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className={`overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${goal.status === 'completed' ? 'border-l-green-500 opacity-80' : 'border-l-primary'}`}>
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-8">
                    <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded mb-2 font-medium">
                      {goal.category}
                    </span>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2" title={goal.title}>{goal.title}</h3>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        Batas waktu: {format(new Date(goal.deadline), "dd MMM yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenDialog(goal)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">{goal.progress}%</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleProgressUpdate(goal.id, goal.progress, -10)} disabled={goal.progress <= 0 || updateGoal.isPending}>-</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => handleProgressUpdate(goal.id, goal.progress, 10)} disabled={goal.progress >= 100 || updateGoal.isPending}>+</Button>
                    </div>
                  </div>
                  <Progress value={goal.progress} className={`h-2 ${goal.status === 'completed' ? 'bg-green-100 [&>div]:bg-green-500' : ''}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
