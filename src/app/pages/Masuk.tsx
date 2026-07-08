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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { UserRound } from "lucide-react";
import { toast } from "sonner";

export function Masuk() {
  const { loginUser, registerUser, login } = useApp();
  const navigate = useNavigate();
  // Setelah login/daftar, arahkan ke Beranda agar pengguna membaca
  // penjelasan sistem terlebih dahulu.
  const redirectTo = "/";

  const [tab, setTab] = useState("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [rNama, setRNama] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin masuk lewat form yang sama menggunakan email khusus.
    if (login(email, password)) {
      toast.success("Berhasil masuk sebagai admin.");
      navigate("/admin/dashboard");
      return;
    }
    if (loginUser(email, password)) {
      toast.success("Berhasil masuk.");
      navigate(redirectTo);
    } else {
      toast.error("Email atau password salah.");
    }
  };

  const doRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rNama.trim() || !rEmail.trim() || !rPass.trim()) {
      toast.error("Lengkapi semua data.");
      return;
    }
    const err = registerUser(rNama, rEmail, rPass);
    if (err) {
      toast.error(err);
    } else {
      toast.success("Akun berhasil dibuat. Selamat datang!");
      navigate(redirectTo);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UserRound className="size-6" />
          </span>
          <CardTitle>Akun Pengguna</CardTitle>
          <CardDescription>
            Masuk atau daftar untuk menyimpan riwayat konsultasi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={doLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">Password</Label>
                  <Input
                    id="pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Masuk
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-primary underline"
                  >
                    Daftar di sini
                  </button>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={doRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="rnama">Nama Lengkap</Label>
                  <Input
                    id="rnama"
                    value={rNama}
                    onChange={(e) => setRNama(e.target.value)}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remail">Email</Label>
                  <Input
                    id="remail"
                    type="email"
                    value={rEmail}
                    onChange={(e) => setREmail(e.target.value)}
                    placeholder="nama@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpass">Password</Label>
                  <Input
                    id="rpass"
                    type="password"
                    value={rPass}
                    onChange={(e) => setRPass(e.target.value)}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Daftar
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-primary underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
