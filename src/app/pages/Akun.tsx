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
import { Camera, UserRound, X } from "lucide-react";
import { toast } from "sonner";

export function Akun() {
  const { currentUser, updateUser } = useApp();
  const navigate = useNavigate();
  const [nama, setNama] = useState(currentUser?.nama ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? "");

  if (!currentUser) return null;

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }
    const err = updateUser({ nama, email, password, avatar });
    if (err) {
      toast.error(err);
    } else {
      toast.success("Profil berhasil diperbarui.");
      setPassword("");
      navigate("/");
    }
  };

  const pilihFoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pilih file gambar.");
      return;
    }
    if (file.size > 1_500_000) {
      toast.error("Ukuran foto maksimal 1,5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="relative mx-auto size-20">
            <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground ring-4 ring-red-100">
              {avatar ? <img src={avatar} alt="Foto profil" className="size-full object-cover" /> : <UserRound className="size-9" />}
            </span>
            <label htmlFor="foto-profil" className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-105" title="Ganti foto profil">
              <Camera className="size-4" />
            </label>
            <input id="foto-profil" type="file" accept="image/*" className="hidden" onChange={(e) => pilihFoto(e.target.files?.[0])} />
          </div>
          <CardTitle>Edit Akun</CardTitle>
          <CardDescription>Perbarui data akun dan foto profil Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={simpan} className="space-y-4">
            {avatar && <button type="button" onClick={() => setAvatar("")} className="mx-auto flex items-center gap-1 text-sm text-primary hover:underline"><X className="size-3.5" /> Hapus foto</button>}
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
