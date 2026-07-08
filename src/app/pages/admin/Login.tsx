import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../store/AppStore";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Berhasil masuk sebagai admin.");
      navigate("/admin/dashboard");
    } else {
      toast.error("Username atau password salah.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20">
      <Card>
        <CardHeader className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="size-6" />
          </span>
          <CardTitle>Login Admin</CardTitle>
          <CardDescription>
            Masuk untuk mengelola basis pengetahuan sistem pakar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@errorwise.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
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
              Demo: <strong>admin@errorwise.com</strong> / <strong>admin123</strong>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
