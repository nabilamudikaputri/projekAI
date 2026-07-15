import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../store/AppStore";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { LogOut, UserRound, LayoutDashboard, MessageSquareText, History, Stethoscope, Wrench, Settings2, ShieldCheck, Mail } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const userLinks = [
  { to: "/", label: "Beranda", icon: LayoutDashboard },
  { to: "/tentang", label: "Tentang Sistem", icon: MessageSquareText },
  { to: "/konsultasi", label: "Konsultasi", icon: Stethoscope },
  { to: "/riwayat", label: "Riwayat", icon: History },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/gejala", label: "Gejala", icon: Stethoscope },
  { to: "/admin/masalah", label: "Masalah", icon: Settings2 },
  { to: "/admin/rule", label: "Rule", icon: MessageSquareText },
  { to: "/admin/pertanyaan", label: "Pertanyaan", icon: MessageSquareText },
  { to: "/admin/riwayat", label: "Riwayat", icon: History },
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
        { to: "/pertanyaan", label: "Pertanyaan", icon: MessageSquareText },
        ...userLinks.slice(3),
      ]
    : userLinks;

  const links = isAdminArea && isAdmin ? adminLinks : userMenu;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/25 bg-[#761c25] text-primary-foreground shadow-lg shadow-red-950/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#fff3f1] text-primary shadow-inner">
            <Wrench className="size-5" />
          </span>
          <div className="leading-tight">
            <div>LarCare</div>
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
                <l.icon className="mr-1.5 inline-block size-3.5 -translate-y-px" />
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
            <HoverCard openDelay={180}>
              <HoverCardTrigger asChild>
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
              </HoverCardTrigger>
              <HoverCardContent align="end" className="border-red-100 bg-white p-0 text-foreground shadow-xl">
                <div className="bg-gradient-to-r from-primary to-brand-2 p-4 text-white">
                  <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4" /> Sesi administrator aktif</div>
                  <p className="mt-1 text-sm text-white/80">admin@larcare.com</p>
                </div>
                <div className="p-4 text-sm text-muted-foreground">Arahkan kursor di sini untuk melihat status login admin.</div>
              </HoverCardContent>
            </HoverCard>
          ) : currentUser ? (
            <>
              <HoverCard openDelay={180}>
                <HoverCardTrigger asChild>
                  <Link
                    to="/akun"
                    className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 sm:flex"
                  >
                {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="size-5 rounded-full object-cover" /> : <UserRound className="size-4" />} {currentUser.nama}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="border-red-100 bg-white p-0 text-foreground shadow-xl">
                  <div className="bg-gradient-to-r from-primary to-brand-2 p-4 text-white">
                    <div className="flex items-center gap-2 font-semibold">{currentUser.avatar ? <img src={currentUser.avatar} alt="" className="size-6 rounded-full object-cover ring-1 ring-white/50" /> : <UserRound className="size-4" />} Profil Pengguna</div>
                    <p className="mt-1 text-sm text-white/80">{currentUser.nama}</p>
                  </div>
                  <div className="space-y-2 p-4 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4 text-primary" /> {currentUser.email}</p>
                    <Link to="/akun" className="flex items-center gap-2 font-medium text-primary hover:underline"><Settings2 className="size-4" /> Kelola profil</Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
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
