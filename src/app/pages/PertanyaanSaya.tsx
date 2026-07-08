import { useApp } from "../store/AppStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MessageCircleQuestion, CornerDownRight } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PertanyaanSaya() {
  const { pertanyaan, currentUser } = useApp();
  const mine = pertanyaan.filter((p) => p.userId === currentUser?.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="tracking-tight">Pertanyaan Saya</h1>
      <p className="mt-2 text-muted-foreground">
        Pertanyaan yang Anda kirim ke admin beserta balasannya.
      </p>

      {mine.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageCircleQuestion className="mx-auto mb-3 size-8" />
            <p>Belum ada pertanyaan. Kirim dari halaman Konsultasi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {mine.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle style={{ fontSize: 15 }}>{fmt(p.tanggal)}</CardTitle>
                <Badge variant={p.status === "dibalas" ? "default" : "secondary"}>
                  {p.status === "dibalas" ? "Dibalas" : "Menunggu"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{p.pesan}</p>
                {p.balasan ? (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-sm text-primary">
                      <CornerDownRight className="size-4" /> Balasan Admin
                    </div>
                    <p className="text-sm text-muted-foreground">{p.balasan}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Menunggu balasan dari admin…
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
