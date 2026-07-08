import { useApp } from "../../store/AppStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RiwayatAdmin() {
  const { konsultasi, clearKonsultasi, gejala, users } = useApp();
  const namaGejala = (k: string) => gejala.find((g) => g.kode === k)?.nama ?? k;
  const namaUser = (id?: string) =>
    users.find((u) => u.id === id)?.nama ?? "Tamu";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight">Riwayat Konsultasi</h1>
          <p className="mt-1 text-muted-foreground">
            Total {konsultasi.length} konsultasi.
          </p>
        </div>
        {konsultasi.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              clearKonsultasi();
              toast.success("Riwayat dibersihkan.");
            }}
          >
            <Trash2 className="size-4" /> Bersihkan
          </Button>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detail Konsultasi</CardTitle>
        </CardHeader>
        <CardContent>
          {konsultasi.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Belum ada konsultasi.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Gejala Dipilih</TableHead>
                  <TableHead>Diagnosa</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {konsultasi.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="align-top">{fmt(k.tanggal)}</TableCell>
                    <TableCell className="align-top">{namaUser(k.userId)}</TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {k.selectedGejala.map((g) => (
                          <Badge key={g} variant="secondary" title={namaGejala(g)}>
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      {k.results[0]?.masalahNama}{" "}
                      <Badge variant="outline">{k.results[0]?.masalahKode}</Badge>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      {k.results[0]?.persentase}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
