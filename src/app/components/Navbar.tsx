import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../store/AppStore";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Bug, LogOut, UserRound } from "lucide-react";

const userLinks = [
  { to: "/", label: "Beranda" },
  { to: "/tentang", label: "Tentang Sistem" },
  { to: "/konsultasi", label: "Konsultasi" },
  { to: "/riwayat", label: "Riwayat" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/gejala", label: "Gejala" },
  { to: "/admin/masalah", label: "Masalah" },
  { to: "/admin/rule", label: "Rule" },
  { to: "/admin/pertanyaan", label: "Pertanyaan" },
  { to: "/admin/riwayat", label: "Riwayat" },
];

export function Navbar() {
  const { isAdmin, logout, currentUser, logoutUser, pertanyaan } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminArea = location.pathname.startsWith("/admin");
  const baruCount = pertanyaan.filter((p) => p.status === "baru").length;

  // Tampilkan menu "Pertanyaan" untuk pengguna hanya jika ia sudah pernah
  // mengirim pertanyaan.
  const punyaPertanyaan = pertanyaan.some((p) => p.userId === currentUser?.id);
  const userMenu = punyaPertanyaan
    ? [
        ...userLinks.slice(0, 3),
        { to: "/pertanyaan", label: "Pertanyaan" },
        ...userLinks.slice(3),
      ]
    : userLinks;

  const links = isAdminArea && isAdmin ? adminLinks : userMenu;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground text-primary">
            <Bug className="size-5" />
          </span>
          <div className="leading-tight">
            <div>ErrorWise</div>
            <div className="text-primary-foreground/70" style={{ fontSize: 11 }}>
              Diagnosa Error Laravel
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to}>
              <span
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10",
                  location.pathname === l.to &&
                    "bg-primary-foreground/15 text-primary-foreground",
                )}
              >
                {l.label}
                {l.to === "/admin/pertanyaan" && baruCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {baruCount}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut className="size-4" /> Keluar Admin
            </Button>
          ) : currentUser ? (
            <>
              <Link
                to="/akun"
                className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 sm:flex"
                title="Edit akun"
              >
                <UserRound className="size-4" /> {currentUser.nama}
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logoutUser();
                  navigate("/");
                }}
              >
                <LogOut className="size-4" /> Keluar
              </Button>
            </>
          ) : (
            <Link to="/masuk">
              <Button variant="secondary" size="sm">
                <UserRound className="size-4" /> Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
