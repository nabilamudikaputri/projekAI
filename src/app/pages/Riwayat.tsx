import { Link } from "react-router";
import { useApp } from "../store/AppStore";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function Riwayat() {
  const { konsultasi: all, currentUser } = useApp();
  const konsultasi = all.filter((k) => k.userId === currentUser?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="tracking-tight">Riwayat Diagnosa</h1>
      <p className="mt-2 text-muted-foreground">
        Daftar konsultasi yang pernah dilakukan.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Konsultasi ({konsultasi.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {konsultasi.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <p>Belum ada riwayat.</p>
              <Link to="/konsultasi">
                <Button className="mt-4">Mulai Konsultasi</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Diagnosa Utama</TableHead>
                  <TableHead className="text-right">Keyakinan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {konsultasi.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>{fmt(k.tanggal)}</TableCell>
                    <TableCell>{k.results[0]?.masalahNama}</TableCell>
                    <TableCell className="text-right">
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
