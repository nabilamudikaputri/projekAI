import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store/AppStore";
import { forwardChaining } from "../lib/engine";
import { Konsultasi as KonsultasiType } from "../lib/data";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
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
import { Stethoscope, RotateCcw, Search, MessageCircleQuestion, Send } from "lucide-react";
import { toast } from "sonner";

export function Konsultasi() {
  const { gejala, rules, masalah, addKonsultasi, currentUser, addPertanyaan } =
    useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
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

  const filtered = gejala.filter((g) =>
    g.nama.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (kode: string) =>
    setSelected((prev) =>
      prev.includes(kode) ? prev.filter((g) => g !== kode) : [...prev, kode],
    );

  const diagnosa = () => {
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="tracking-tight">Konsultasi Diagnosa</h1>
      <p className="mt-2 text-muted-foreground">
        Pilih gejala/error yang Anda alami pada proyek Laravel, lalu klik tombol
        Diagnosa.
      </p>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Gejala</CardTitle>
          <span className="text-sm text-muted-foreground">
            {selected.length} dipilih
          </span>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari gejala..."
              className="pl-9"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((g) => (
              <label
                key={g.kode}
                htmlFor={g.kode}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
              >
                <Checkbox
                  id={g.kode}
                  checked={selected.includes(g.kode)}
                  onCheckedChange={() => toggle(g.kode)}
                />
                <div className="text-sm">{g.nama}</div>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                Tidak ada gejala yang cocok.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={diagnosa}>
              <Stethoscope className="size-4" /> Diagnosa
            </Button>
            <Button variant="outline" onClick={() => setSelected([])}>
              <RotateCcw className="size-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

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
