import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Sessions from "@/pages/Sessions";
import Tests from "@/pages/Tests";
import TestRunner from "@/pages/TestRunner";
import Laporan from "@/pages/Laporan";
import Harian from "@/pages/Harian";
import Latihan from "@/pages/Latihan";
import GrafikMood from "@/pages/GrafikMood";
import PinLock from "@/components/PinLock";
import { useState, useEffect, useCallback } from "react";
import { hasPin } from "@/lib/pin";

const queryClient = new QueryClient();

const AUTO_LOCK_MS = 5 * 60 * 1000;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/sessions" component={Sessions} />
      <Route path="/tes" component={Tests} />
      <Route path="/tes/:id" component={TestRunner} />
      <Route path="/laporan/:id" component={Laporan} />
      <Route path="/harian" component={Harian} />
      <Route path="/latihan" component={Latihan} />
      <Route path="/grafik" component={GrafikMood} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithPin() {
  // Jika sudah diverifikasi melalui Aira di sesi yang sama (sessionStorage),
  // langsung buka tanpa PIN. SessionStorage dibagikan dalam tab yang sama.
  const airaVerified = sessionStorage.getItem("baim_private_ok") === "1";
  const [unlocked, setUnlocked] = useState(airaVerified);
  const [lastActive, setLastActive] = useState(Date.now());

  const lock = useCallback(() => {
    // Jangan kunci jika Aira sudah verifikasi di sesi ini
    if (sessionStorage.getItem("baim_private_ok") === "1") return;
    setUnlocked(false);
  }, []);

  const resetTimer = useCallback(() => setLastActive(Date.now()), []);

  useEffect(() => {
    if (!unlocked) return;

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, [unlocked, resetTimer]);

  useEffect(() => {
    if (!unlocked) return;
    const id = setInterval(() => {
      if (Date.now() - lastActive > AUTO_LOCK_MS) lock();
    }, 30_000);
    return () => clearInterval(id);
  }, [unlocked, lastActive, lock]);

  useEffect(() => {
    if (!unlocked) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setLastActive((prev) => prev - AUTO_LOCK_MS);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [unlocked]);

  if (!unlocked) {
    return <PinLock onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppWithPin />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
