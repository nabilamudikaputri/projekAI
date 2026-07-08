import { useState } from "react";
import { useApp } from "../../store/AppStore";
import { Gejala } from "../../lib/data";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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

export function KelolaGejala() {
  const { gejala, setGejala } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gejala | null>(null);
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");

  const openNew = () => {
    setEditing(null);
    const next = `G${String(gejala.length + 1).padStart(2, "0")}`;
    setKode(next);
    setNama("");
    setOpen(true);
  };

  const openEdit = (g: Gejala) => {
    setEditing(g);
    setKode(g.kode);
    setNama(g.nama);
    setOpen(true);
  };

  const save = () => {
    if (!kode.trim() || !nama.trim()) {
      toast.error("Kode dan nama gejala wajib diisi.");
      return;
    }
    if (editing) {
      setGejala(gejala.map((g) => (g.kode === editing.kode ? { kode, nama } : g)));
      toast.success("Gejala diperbarui.");
    } else {
      if (gejala.some((g) => g.kode === kode)) {
        toast.error("Kode gejala sudah ada.");
        return;
      }
      setGejala([...gejala, { kode, nama }]);
      toast.success("Gejala ditambahkan.");
    }
    setOpen(false);
  };

  const remove = (k: string) => {
    setGejala(gejala.filter((g) => g.kode !== k));
    toast.success("Gejala dihapus.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight">Kelola Gejala</h1>
          <p className="mt-1 text-muted-foreground">Total {gejala.length} gejala.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Tambah
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Tambah"} Gejala</DialogTitle>
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
                <Label>Nama Gejala</Label>
                <Input value={nama} onChange={(e) => setNama(e.target.value)} />
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
          <CardTitle>Daftar Gejala</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Kode</TableHead>
                <TableHead>Nama Gejala</TableHead>
                <TableHead className="w-28 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gejala.map((g) => (
                <TableRow key={g.kode}>
                  <TableCell>{g.kode}</TableCell>
                  <TableCell>{g.nama}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(g.kode)}>
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
