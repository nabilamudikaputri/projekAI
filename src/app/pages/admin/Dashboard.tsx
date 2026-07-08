import { Link } from "react-router";
import { useApp } from "../../store/AppStore";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ListChecks,
  Stethoscope,
  GitBranch,
  History,
  MessageCircleQuestion,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function Dashboard() {
  const { gejala, masalah, rules, konsultasi, pertanyaan } = useApp();
  const baru = pertanyaan.filter((p) => p.status === "baru").length;

  const cards = [
    { label: "Total Gejala", value: gejala.length, icon: ListChecks },
    { label: "Total Masalah", value: masalah.length, icon: Stethoscope },
    { label: "Total Rule", value: rules.length, icon: GitBranch },
    { label: "Total Konsultasi", value: konsultasi.length, icon: History },
  ];

  // Frekuensi diagnosa utama per masalah
  const freq = masalah.map((m) => ({
    name: m.kode,
    jumlah: konsultasi.filter((k) => k.results[0]?.masalahKode === m.kode).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="tracking-tight">Dashboard Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Ringkasan basis pengetahuan dan aktivitas konsultasi.
      </p>

      {baru > 0 && (
        <Card className="mt-6 border-primary/40 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MessageCircleQuestion className="size-5" />
              </span>
              <div>
                <div>{baru} pertanyaan baru dari pengguna</div>
                <div className="text-sm text-muted-foreground">
                  Segera balas pertanyaan yang masuk.
                </div>
              </div>
            </div>
            <Link to="/admin/pertanyaan">
              <Button size="sm">
                Lihat <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 py-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="size-6" />
              </span>
              <div>
                <div style={{ fontSize: 26 }}>{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="py-6">
          <div className="mb-4">Frekuensi Diagnosa per Masalah</div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={freq}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="jumlah"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
