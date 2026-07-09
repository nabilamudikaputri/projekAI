import { motion } from "motion/react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  MousePointerClick,
  BookOpen,
  GitCompare,
  CheckCircle2,
  Percent,
  ListOrdered,
  Calculator,
  Workflow,
  Brain,
} from "lucide-react";

const langkah = [
  {
    icon: MousePointerClick,
    title: "Pilih Gejala",
    desc: "User menandai gejala/error yang sedang dialami.",
  },
  {
    icon: BookOpen,
    title: "Baca Rule",
    desc: "Sistem membaca seluruh aturan pada basis pengetahuan.",
  },
  {
    icon: GitCompare,
    title: "Cocokkan",
    desc: "Gejala dicocokkan dengan kondisi (IF) tiap rule.",
  },
  {
    icon: CheckCircle2,
    title: "Rule Terpenuhi",
    desc: "Rule yang cocok sebagian/penuh dihitung kecocokannya.",
  },
  {
    icon: Percent,
    title: "Hitung Keyakinan",
    desc: "Persentase keyakinan tiap masalah dihitung.",
  },
  {
    icon: ListOrdered,
    title: "Ranking Diagnosa",
    desc: "Hasil terbaik ditampilkan beserta solusinya.",
  },
];

const flow = [
  "Mulai",
  "Pilih Gejala",
  "Simpan Gejala",
  "Cocokkan Rule",
  "Rule Terpenuhi?",
  "Hitung Persentase",
  "Tampilkan Diagnosa & Solusi",
  "Selesai",
];

export function Tentang() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-background to-brand-2/10" />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
          >
            <Brain className="size-4 text-primary" /> Metode Forward Chaining
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 tracking-tight"
          >
            Bagaimana LarCare Bekerja?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-muted-foreground"
          >
            Sistem ini memakai <strong>Forward Chaining</strong> penalaran maju
            yang berangkat dari fakta (gejala) menuju kesimpulan (masalah), lalu
            menghitung tingkat keyakinannya.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* LANGKAH PENALARAN */}
        <h2 className="tracking-tight">Langkah Penalaran</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {langkah.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="h-full">
                <CardContent className="space-y-3 py-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <l.icon className="size-5" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div>{l.title}</div>
                  <p className="text-sm text-muted-foreground">{l.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* PERHITUNGAN KEYAKINAN */}
        <Card className="mt-10 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-5 text-primary" />
              Perhitungan Tingkat Keyakinan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Keyakinan dihitung dari rasio gejala yang dipilih terhadap seluruh
              gejala pada sebuah aturan.
            </p>

            <div className="rounded-xl border border-border bg-secondary p-5">
              <div className="text-sm text-muted-foreground">
                Contoh aturan → <strong>Database belum terhubung</strong>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm text-primary">
                  ✓ Migration Gagal
                </span>
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm text-primary">
                  ✓ Database Connection Failed
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1 text-sm text-muted-foreground">
                  ✗ SQLSTATE Error
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="font-mono text-sm">2 / 3 × 100</div>
                <ArrowRight className="size-4 text-muted-foreground" />
                <div className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground">
                  66%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FLOWCHART */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="size-5 text-primary" />
              Flowchart Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              {flow.map((step, i) => {
                const isDecision = step.endsWith("?");
                const isTerminal = step === "Mulai" || step === "Selesai";
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={
                        isTerminal
                          ? "rounded-full bg-primary px-6 py-2 text-center text-sm text-primary-foreground"
                          : isDecision
                            ? "rotate-0 rounded-lg border-2 border-primary bg-primary/5 px-6 py-2 text-center text-sm text-primary"
                            : "rounded-lg border border-border bg-card px-6 py-2 text-center text-sm shadow-sm"
                      }
                    >
                      {step}
                    </div>
                    {i < flow.length - 1 && (
                      <ArrowDown className="size-4 text-primary/60" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/konsultasi">
            <Button size="lg" className="group">
              Coba Konsultasi Sekarang
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
