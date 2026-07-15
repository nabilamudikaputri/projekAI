import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store/AppStore";
import { forwardChaining } from "../lib/engine";
import { Konsultasi as KonsultasiType } from "../lib/data";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Link } from "react-router";
import { Stethoscope, RotateCcw, MessageCircleQuestion, Send, CheckCircle2, CircleHelp, ClipboardList, CircleDotDashed, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function Konsultasi() {
  const { gejala, rules, masalah, addKonsultasi, currentUser, addPertanyaan } =
    useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [jawaban, setJawaban] = useState<Record<string, "ya" | "tidak" | "ragu">>({});
  const [pesan, setPesan] = useState("");
  const [tanyaOpen, setTanyaOpen] = useState(false);
  const navigate = useNavigate();

  const kirimPertanyaan = () => {
    if (!pesan.trim()) {
      toast.error("Tuliskan pertanyaan Anda terlebih dahulu.");
      return;
    }
    addPertanyaan(pesan);
    setPesan("");
    setTanyaOpen(false);
    toast.success("Pertanyaan terkirim ke admin. Balasan dapat dilihat di menu Pertanyaan Saya.");
  };

  const jawab = (kode: string, nilai: "ya" | "tidak" | "ragu") => {
    setJawaban((prev) => ({ ...prev, [kode]: nilai }));
    setSelected((prev) => {
      const tanpaGejala = prev.filter((item) => item !== kode);
      return nilai === "ya" ? [...tanpaGejala, kode] : tanpaGejala;
    });
  };

  const ulangi = () => {
    setSelected([]);
    setJawaban({});
  };

  const diagnosa = () => {
    if (Object.keys(jawaban).length !== gejala.length) {
      toast.error("Jawab semua pertanyaan terlebih dahulu sebelum melihat hasil diagnosa.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Pilih minimal satu gejala terlebih dahulu.");
      return;
    }
    const results = forwardChaining(selected, rules, masalah);
    if (results.length === 0) {
      toast.error("Tidak ada masalah yang cocok dengan gejala tersebut.");
      return;
    }
    const konsultasi: KonsultasiType = {
      id: `K${Date.now()}`,
      userId: currentUser?.id,
      tanggal: new Date().toISOString(),
      selectedGejala: selected,
      results,
    };
    addKonsultasi(konsultasi);
    navigate("/hasil", { state: { konsultasi } });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <section className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-[#8f202a] to-[#cf4d3e] px-6 py-8 text-white shadow-xl shadow-red-950/15 md:px-9">
        <div className="absolute -right-8 -top-10 size-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-14 right-32 size-40 rounded-full bg-black/10 blur-2xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm"><ClipboardList className="size-4" /> Form konsultasi</span>
            <h1 className="mt-4 text-white">Konsultasi Diagnosa</h1>
            <p className="mt-3 max-w-2xl text-white/85">Jawab semua pertanyaan berdasarkan error yang muncul pada proyek Laravel Anda. Sistem kemudian mencocokkan jawaban dengan basis aturan LarCare.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur"><div className="text-xl font-bold">{gejala.length}</div><div className="text-xs text-white/75">Pertanyaan</div></div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur"><div className="text-xl font-bold">{selected.length}</div><div className="text-xs text-white/75">Gejala ya</div></div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_270px] lg:items-start">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><CircleHelp className="size-5 text-primary" /> Pertanyaan Diagnosa</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Semua pertanyaan ditampilkan agar jawaban dapat diperiksa sekaligus.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{Object.keys(jawaban).length} / {gejala.length} dijawab</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(Object.keys(jawaban).length / gejala.length) * 100}%` }} />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {gejala.map((gejalaItem, index) => (
              <div key={gejalaItem.kode} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/35 hover:bg-red-50/40">
                <div className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
                  <div>
                    <p className="text-xs font-semibold text-primary">PERTANYAAN DIAGNOSA</p>
                    <p className="mt-1 font-medium">Apakah Anda mengalami {gejalaItem.nama}?</p>
                  </div>
                </div>
                <div className="ml-11 mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant={jawaban[gejalaItem.kode] === "ya" ? "default" : "outline"} onClick={() => jawab(gejalaItem.kode, "ya")}><CheckCircle2 className="size-4" /> Ya</Button>
                  <Button size="sm" variant={jawaban[gejalaItem.kode] === "tidak" ? "default" : "outline"} onClick={() => jawab(gejalaItem.kode, "tidak")}>Tidak</Button>
                  <Button size="sm" variant={jawaban[gejalaItem.kode] === "ragu" ? "default" : "outline"} onClick={() => jawab(gejalaItem.kode, "ragu")}>Belum yakin</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">{selected.length}</span> gejala ditandai “Ya”.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={ulangi}><RotateCcw className="size-4" /> Ulangi</Button>
              <Button onClick={diagnosa} disabled={Object.keys(jawaban).length !== gejala.length}><Stethoscope className="size-4" /> Lihat Hasil Diagnosa</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <aside className="space-y-4 lg:sticky lg:top-20">
        <Card className="border-red-100">
          <CardContent className="p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><CircleDotDashed className="size-5" /></span>
            <h3 className="mt-4">Progres jawaban</h3>
            <div className="mt-3 flex items-end justify-between"><span className="text-3xl font-bold text-primary">{Object.keys(jawaban).length}</span><span className="mb-1 text-sm text-muted-foreground">dari {gejala.length} pertanyaan</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(Object.keys(jawaban).length / gejala.length) * 100}%` }} /></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Jawab semua pertanyaan untuk membuka hasil diagnosa.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2b1718] text-white">
          <CardContent className="p-5">
            <ShieldCheck className="size-6 text-red-200" />
            <h3 className="mt-3 text-white">Tips menjawab</h3>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-white/75">
              <li>• Pilih Ya jika error pernah muncul.</li>
              <li>• Pilih Tidak jika tidak pernah muncul.</li>
              <li>• Pilih Belum yakin bila ragu.</li>
            </ul>
          </CardContent>
        </Card>
      </aside>
      </div>

      {/* Tombol mengambang untuk mengajukan pertanyaan */}
      <Button
        onClick={() => setTanyaOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg"
      >
        <MessageCircleQuestion className="size-5" />
        <span className="hidden sm:inline">Ajukan Pertanyaan</span>
      </Button>

      <Dialog open={tanyaOpen} onOpenChange={setTanyaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircleQuestion className="size-5 text-brand" />
              Tidak menemukan error Anda?
            </DialogTitle>
            <DialogDescription>
              Jika gejala/error yang Anda alami belum tersedia, kirimkan
              pertanyaan ke admin. Admin akan membalas dan dapat menambahkannya
              ke sistem.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={pesan}
            rows={4}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Contoh: Saya mendapat error 'Target class [HomeController] does not exist', apa penyebabnya?"
          />
          <DialogFooter className="sm:justify-between">
            <Link
              to="/pertanyaan"
              className="self-center text-sm text-brand underline"
            >
              Lihat Pertanyaan Saya
            </Link>
            <Button onClick={kirimPertanyaan}>
              <Send className="size-4" /> Kirim Pertanyaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
