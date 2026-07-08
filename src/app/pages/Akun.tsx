import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store/AppStore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserRound } from "lucide-react";
import { toast } from "sonner";

export function Akun() {
  const { currentUser, updateUser } = useApp();
  const navigate = useNavigate();
  const [nama, setNama] = useState(currentUser?.nama ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [password, setPassword] = useState("");

  if (!currentUser) return null;

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }
    const err = updateUser({ nama, email, password });
    if (err) {
      toast.error(err);
    } else {
      toast.success("Profil berhasil diperbarui.");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UserRound className="size-6" />
          </span>
          <CardTitle>Edit Akun</CardTitle>
          <CardDescription>Perbarui data akun pengguna Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={simpan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak diubah"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
