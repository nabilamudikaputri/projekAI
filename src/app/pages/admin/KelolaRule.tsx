import { useState } from "react";
import { useApp } from "../../store/AppStore";
import { Rule } from "../../lib/data";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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

export function KelolaRule() {
  const { rules, setRules, gejala, masalah } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [kode, setKode] = useState("");
  const [ifList, setIfList] = useState<string[]>([]);
  const [then, setThen] = useState("");

  const openNew = () => {
    setEditing(null);
    setKode(`R${String(rules.length + 1).padStart(2, "0")}`);
    setIfList([]);
    setThen("");
    setOpen(true);
  };

  const openEdit = (r: Rule) => {
    setEditing(r);
    setKode(r.kode);
    setIfList(r.if);
    setThen(r.then);
    setOpen(true);
  };

  const toggleIf = (g: string) =>
    setIfList((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const save = () => {
    if (!kode.trim() || ifList.length === 0 || !then) {
      toast.error("Lengkapi kode, minimal satu gejala, dan masalah.");
      return;
    }
    if (editing) {
      setRules(
        rules.map((r) =>
          r.kode === editing.kode ? { kode, if: ifList, then } : r,
        ),
      );
      toast.success("Rule diperbarui.");
    } else {
      if (rules.some((r) => r.kode === kode)) {
        toast.error("Kode rule sudah ada.");
        return;
      }
      setRules([...rules, { kode, if: ifList, then }]);
      toast.success("Rule ditambahkan.");
    }
    setOpen(false);
  };

  const remove = (k: string) => {
    setRules(rules.filter((r) => r.kode !== k));
    toast.success("Rule dihapus.");
  };

  const namaMasalah = (k: string) => masalah.find((m) => m.kode === k)?.nama ?? k;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight">Kelola Rule</h1>
          <p className="mt-1 text-muted-foreground">Total {rules.length} rule.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Tambah
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Tambah"} Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kode Rule</Label>
                <Input
                  value={kode}
                  onChange={(e) => setKode(e.target.value.toUpperCase())}
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>IF — Pilih Gejala</Label>
                <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-border p-3">
                  {gejala.map((g) => (
                    <label
                      key={g.kode}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={ifList.includes(g.kode)}
                        onCheckedChange={() => toggleIf(g.kode)}
                      />
                      <span className="text-muted-foreground">{g.kode}</span>
                      {g.nama}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>THEN — Masalah</Label>
                <Select value={then} onValueChange={setThen}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih masalah" />
                  </SelectTrigger>
                  <SelectContent>
                    {masalah.map((m) => (
                      <SelectItem key={m.kode} value={m.kode}>
                        {m.kode} — {m.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <CardTitle>Basis Aturan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Kode</TableHead>
                <TableHead>IF (Gejala)</TableHead>
                <TableHead>THEN (Masalah)</TableHead>
                <TableHead className="w-28 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.kode}>
                  <TableCell>{r.kode}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.if.map((g) => (
                        <Badge key={g} variant="secondary">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.then}</Badge> {namaMasalah(r.then)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(r.kode)}>
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
