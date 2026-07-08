import { Link, useLocation } from "react-router";
import { useApp } from "../store/AppStore";
import { Konsultasi } from "../lib/data";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { CheckCircle2, Trophy, ArrowLeft, Lightbulb } from "lucide-react";

export function Hasil() {
  const location = useLocation();
  const { konsultasi: history, gejala } = useApp();
  const konsultasi: Konsultasi | undefined =
    (location.state as { konsultasi?: Konsultasi })?.konsultasi ?? history[0];

  const namaGejala = (kode: string) =>
    gejala.find((g) => g.kode === kode)?.nama ?? kode;

  if (!konsultasi) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1>Belum ada hasil diagnosa</h1>
        <p className="mt-2 text-muted-foreground">
          Silakan lakukan konsultasi terlebih dahulu.
        </p>
        <Link to="/konsultasi">
          <Button className="mt-6">Mulai Konsultasi</Button>
        </Link>
      </div>
    );
  }

  const top = konsultasi.results[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/konsultasi">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="size-4" /> Konsultasi ulang
        </Button>
      </Link>

      <h1 className="tracking-tight">Hasil Diagnosa</h1>
      <p className="mt-2 text-muted-foreground">
        Diagnosa diurutkan berdasarkan tingkat keyakinan tertinggi.
      </p>

      <Card className="mt-6 border-primary/40 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" /> Diagnosa Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div style={{ fontSize: 22 }}>{top.masalahNama}</div>
            <div className="text-right">
              <div style={{ fontSize: 32 }} className="text-primary">
                {top.persentase}%
              </div>
              <div className="text-sm text-muted-foreground">Tingkat keyakinan</div>
            </div>
          </div>
          <Progress value={top.persentase} />

          <div>
            <div className="mb-2 text-sm text-muted-foreground">Gejala cocok</div>
            <div className="flex flex-wrap gap-2">
              {top.matchedGejala.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1 rounded-md bg-card px-2.5 py-1 text-sm"
                >
                  <CheckCircle2 className="size-4 text-primary" />
                  {namaGejala(g)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-card p-4">
            <div className="mb-1 flex items-center gap-2 text-sm">
              <Lightbulb className="size-4 text-primary" /> Solusi
            </div>
            <p className="text-sm text-muted-foreground">{top.solusi}</p>
          </div>
        </CardContent>
      </Card>

      {konsultasi.results.length > 1 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Kemungkinan Lain (Ranking)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {konsultasi.results.map((r, i) => (
              <div key={r.masalahKode} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {i + 1}
                    </span>
                    {r.masalahNama}
                  </span>
                  <span className="text-sm">{r.persentase}%</span>
                </div>
                <Progress value={r.persentase} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
