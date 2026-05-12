import { useState, useEffect } from "react";
import { ExternalLink, RefreshCw, Newspaper, TrendingUp, Globe2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageInfo } from "@/components/PageInfo";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

const SOURCE_COLORS: Record<string, string> = {
  "BBC Business": "bg-red-100 text-red-700",
  "Forbes Entrepreneur": "bg-purple-100 text-purple-700",
  "MarketWatch": "bg-green-100 text-green-700",
};

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: id });
  } catch {
    return dateStr;
  }
}

export default function Berita() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/langkahku/berita");
      if (!res.ok) throw new Error();
      const data: NewsItem[] = await res.json();
      setNews(data);
      setLastFetched(new Date());
    } catch {
      setError("Gagal memuat berita. Periksa koneksi internet kamu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const sources = Array.from(new Set(news.map(n => n.source))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-primary" />
            Berita Bisnis
          </h1>
          <p className="text-muted-foreground mt-1">
            Kisah sukses dan tren bisnis terkini dari seluruh dunia.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastFetched && (
            <span className="text-xs text-muted-foreground hidden md:block">
              Diperbarui {timeAgo(lastFetched.toISOString())}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNews}
            disabled={isLoading}
            className="gap-2 rounded-full"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Memuat..." : "Perbarui"}
          </Button>
        </div>
      </div>

      <PageInfo
        pageKey="berita"
        description="Pantau berita bisnis dan kisah inspiratif pengusaha sukses dunia. Baca langsung dari sumber terpercaya seperti BBC Business dan Forbes."
        tips={[
          "Klik judul berita untuk membuka artikel lengkap",
          "Tekan 'Perbarui' untuk mendapatkan berita terbaru",
          "Ceritakan ke Bara tentang artikel menarik yang kamu baca!",
        ]}
      />

      {/* Source chips */}
      {sources.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Globe2 className="w-4 h-4 text-muted-foreground" />
          {sources.map(src => (
            <Badge
              key={src}
              variant="secondary"
              className={`text-xs ${SOURCE_COLORS[src] ?? "bg-secondary text-secondary-foreground"}`}
            >
              {src}
            </Badge>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-destructive">{error}</p>
              <Button variant="link" onClick={fetchNews} className="p-0 h-auto text-xs mt-1">
                Coba lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skeleton loading */}
      {isLoading && news.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* News list */}
      {!isLoading || news.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/40 cursor-pointer group-hover:-translate-y-0.5">
                <CardContent className="p-5 flex flex-col gap-3 h-full">
                  <div className="flex items-start justify-between gap-2">
                    {item.source && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] py-0 px-2 flex-shrink-0 ${SOURCE_COLORS[item.source] ?? ""}`}
                      >
                        {item.source}
                      </Badge>
                    )}
                    {item.pubDate && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {timeAgo(item.pubDate)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-primary font-medium mt-auto pt-1 border-t border-border/50">
                    <TrendingUp className="w-3 h-3" />
                    Baca selengkapnya
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && news.length === 0 && (
        <Card className="border-dashed bg-transparent">
          <CardContent className="p-10 flex flex-col items-center text-center gap-3">
            <Newspaper className="w-10 h-10 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-sm">Belum ada berita yang dimuat.</p>
            <Button variant="outline" size="sm" onClick={fetchNews} className="rounded-full gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Muat Sekarang
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
