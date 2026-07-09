import { Link } from "react-router";
import { motion } from "motion/react";
import { useApp } from "../store/AppStore";
import { CountUp } from "../components/CountUp";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Stethoscope,
  ListChecks,
  GitBranch,
  Percent,
  ArrowRight,
  Zap,
  ShieldCheck,
  Gauge,
  Sparkles,
  Server,
  Database,
  FileWarning,
  Lock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Landing() {
  const { gejala, masalah, rules, konsultasi, currentUser } = useApp();

  const stats = [
    { label: "Gejala", value: gejala.length, icon: ListChecks },
    { label: "Masalah", value: masalah.length, icon: Stethoscope },
    { label: "Rule", value: rules.length, icon: GitBranch },
    { label: "Konsultasi", value: konsultasi.length, icon: Percent },
  ];

  const commonErrors = [
    { icon: Server, label: "Error 500", desc: "Internal Server Error" },
    { icon: Database, label: "Database Failed", desc: "Koneksi database gagal" },
    { icon: FileWarning, label: "Route Not Found", desc: "Route belum terdaftar" },
    { icon: Lock, label: "Page Expired 419", desc: "CSRF token mismatch" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Diagnosa Instan",
      desc: "Pilih gejala, langsung dapat hasil dalam hitungan detik.",
    },
    {
      icon: Gauge,
      title: "Tingkat Keyakinan",
      desc: "Setiap diagnosa dilengkapi persentase kecocokan yang transparan.",
    },
    {
      icon: ShieldCheck,
      title: "Solusi Terarah",
      desc: "Langkah perbaikan konkret untuk tiap masalah yang terdeteksi.",
    },
    {
      icon: Sparkles,
      title: "Riwayat Pribadi",
      desc: "Semua konsultasi tersimpan rapi di akun Anda.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/15 via-background to-brand-2/10" />
        <motion.div
          className="absolute -left-24 top-10 -z-10 size-72 rounded-full bg-brand/20 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-40 -z-10 size-80 rounded-full bg-brand-2/20 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <motion.span
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Sistem Pakar Berbasis Forward Chaining
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl tracking-tight"
          >
            Pecahkan Error Laravel dengan{" "}
            <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
              LarCare
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Asisten cerdas untuk mahasiswa pemula. Pilih gejala error yang Anda
            alami, dan ErrorWise akan menemukan penyebab, tingkat keyakinan,
            serta solusinya secara otomatis.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to={currentUser ? "/konsultasi" : "/masuk"}>
              <Button size="lg" className="group">
                Mulai Diagnosa
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/tentang">
              <Button size="lg" variant="outline">
                Cara Kerja Sistem
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <div style={{ fontSize: 30 }}>
                    <CountUp to={s.value} />
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMMON ERRORS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="tracking-tight">Error yang Sering Terjadi</h2>
          <p className="mt-2 text-muted-foreground">
            Beberapa masalah umum yang bisa langsung didiagnosa.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commonErrors.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Card className="h-full">
                <CardContent className="space-y-3 py-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <e.icon className="size-5" />
                  </span>
                  <div>{e.label}</div>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-gradient-to-br from-secondary to-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="tracking-tight">Tiga Langkah Sederhana</h2>
            <p className="mt-2 text-muted-foreground">
              Dari kebingungan ke solusi, secepat itu.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Pilih Gejala",
                desc: "Tandai semua error yang muncul di proyek Laravel Anda.",
              },
              {
                title: "Forward Chaining",
                desc: "Sistem mencocokkan gejala dengan basis aturan secara otomatis.",
              },
              {
                title: "Hasil & Solusi",
                desc: "Dapatkan ranking diagnosa lengkap dengan langkah perbaikan.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full">
                  <CardContent className="space-y-3 py-8">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>{f.title}</div>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="tracking-tight">Kenapa ErrorWise?</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="space-y-3 py-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <div>{f.title}</div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-2 px-8 py-14 text-center text-brand-foreground"
        >
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <h2 className="tracking-tight text-brand-foreground">
            Siap mengatasi error Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Mulai konsultasi sekarang dan temukan solusi dari setiap kendala
            pengembangan Laravel Anda.
          </p>
          <div className="mt-7">
            <Link to={currentUser ? "/konsultasi" : "/masuk"}>
              <Button size="lg" variant="secondary" className="group">
                {currentUser ? "Mulai Konsultasi" : "Daftar / Masuk"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
