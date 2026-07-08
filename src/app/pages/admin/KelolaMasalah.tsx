import { useState } from "react";
import { useApp } from "../../store/AppStore";
import { Masalah } from "../../lib/data";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function KelolaMasalah() {
  const { masalah, setMasalah } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Masalah | null>(null);
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [solusi, setSolusi] = useState("");

  const openNew = () => {
    setEditing(null);
    setKode(`P${String(masalah.length + 1).padStart(2, "0")}`);
    setNama("");
    setSolusi("");
    setOpen(true);
  };

  const openEdit = (m: Masalah) => {
    setEditing(m);
    setKode(m.kode);
    setNama(m.nama);
    setSolusi(m.solusi);
    setOpen(true);
  };

  const save = () => {
    if (!kode.trim() || !nama.trim()) {
      toast.error("Kode dan nama masalah wajib diisi.");
      return;
    }
    if (editing) {
      setMasalah(
        masalah.map((m) =>
          m.kode === editing.kode ? { kode, nama, solusi } : m,
        ),
      );
      toast.success("Masalah diperbarui.");
    } else {
      if (masalah.some((m) => m.kode === kode)) {
        toast.error("Kode masalah sudah ada.");
        return;
      }
      setMasalah([...masalah, { kode, nama, solusi }]);
      toast.success("Masalah ditambahkan.");
    }
    setOpen(false);
  };

  const remove = (k: string) => {
    setMasalah(masalah.filter((m) => m.kode !== k));
    toast.success("Masalah dihapus.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight">Kelola Masalah</h1>
          <p className="mt-1 text-muted-foreground">Total {masalah.length} masalah.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Tambah
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Tambah"} Masalah</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kode</Label>
                <Input
                  value={kode}
                  onChange={(e) => setKode(e.target.value.toUpperCase())}
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Masalah</Label>
                <Input value={nama} onChange={(e) => setNama(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Solusi</Label>
                <Textarea
                  value={solusi}
                  rows={4}
                  onChange={(e) => setSolusi(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={save}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daftar Masalah</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Solusi</TableHead>
                <TableHead className="w-28 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masalah.map((m) => (
                <TableRow key={m.kode}>
                  <TableCell>{m.kode}</TableCell>
                  <TableCell>{m.nama}</TableCell>
                  <TableCell className="text-muted-foreground" style={{ fontSize: 13 }}>
                    {m.solusi}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(m.kode)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
