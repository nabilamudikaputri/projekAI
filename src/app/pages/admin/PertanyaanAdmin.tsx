import { useState } from "react";
import { useApp } from "../../store/AppStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { MessageCircleQuestion, CornerDownRight, Send, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PertanyaanAdmin() {
  const { pertanyaan, replyPertanyaan, deletePertanyaan } = useApp();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const baru = pertanyaan.filter((p) => p.status === "baru").length;

  const kirim = (id: string) => {
    const teks = drafts[id]?.trim();
    if (!teks) {
      toast.error("Tulis balasan terlebih dahulu.");
      return;
    }
    replyPertanyaan(id, teks);
    setDrafts((d) => ({ ...d, [id]: "" }));
    toast.success("Balasan terkirim ke pengguna.");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight">Pertanyaan Pengguna</h1>
          <p className="mt-1 text-muted-foreground">
            {baru} pertanyaan belum dibalas dari total {pertanyaan.length}.
          </p>
        </div>
      </div>

      {pertanyaan.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageCircleQuestion className="mx-auto mb-3 size-8" />
            <p>Belum ada pertanyaan dari pengguna.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {pertanyaan.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-1.5" style={{ fontSize: 15 }}>
                    <UserRound className="size-4" /> {p.nama}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {fmt(p.tanggal)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.status === "dibalas" ? "default" : "secondary"}>
                    {p.status === "dibalas" ? "Dibalas" : "Baru"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deletePertanyaan(p.id);
                      toast.success("Pertanyaan dihapus.");
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{p.pesan}</p>

                {p.balasan && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-sm text-primary">
                      <CornerDownRight className="size-4" /> Balasan Anda
                    </div>
                    <p className="text-sm text-muted-foreground">{p.balasan}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Textarea
                    rows={2}
                    value={drafts[p.id] ?? ""}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [p.id]: e.target.value }))
                    }
                    placeholder={
                      p.balasan ? "Perbarui balasan…" : "Tulis balasan…"
                    }
                  />
                  <Button size="sm" onClick={() => kirim(p.id)}>
                    <Send className="size-4" />{" "}
                    {p.balasan ? "Perbarui Balasan" : "Kirim Balasan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
