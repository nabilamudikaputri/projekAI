import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { AppProvider, useApp } from "./store/AppStore";
import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import { Landing } from "./pages/Landing";
import { Tentang } from "./pages/Tentang";
import { Konsultasi } from "./pages/Konsultasi";
import { Hasil } from "./pages/Hasil";
import { Riwayat } from "./pages/Riwayat";
import { Masuk } from "./pages/Masuk";
import { Akun } from "./pages/Akun";
import { PertanyaanSaya } from "./pages/PertanyaanSaya";
import { PertanyaanAdmin } from "./pages/admin/PertanyaanAdmin";
import { Dashboard } from "./pages/admin/Dashboard";
import { KelolaGejala } from "./pages/admin/KelolaGejala";
import { KelolaMasalah } from "./pages/admin/KelolaMasalah";
import { KelolaRule } from "./pages/admin/KelolaRule";
import { RiwayatAdmin } from "./pages/admin/RiwayatAdmin";

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function RequireAdmin() {
  const { isAdmin } = useApp();
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function RequireUser() {
  const { currentUser } = useApp();
  const location = useLocation();
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/masuk" state={{ from: location.pathname }} replace />
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/masuk" element={<Masuk />} />
            <Route element={<RequireUser />}>
              <Route path="/konsultasi" element={<Konsultasi />} />
              <Route path="/hasil" element={<Hasil />} />
              <Route path="/riwayat" element={<Riwayat />} />
              <Route path="/akun" element={<Akun />} />
              <Route path="/pertanyaan" element={<PertanyaanSaya />} />
            </Route>
            <Route path="/admin/login" element={<Navigate to="/masuk" replace />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/gejala" element={<KelolaGejala />} />
              <Route path="/admin/masalah" element={<KelolaMasalah />} />
              <Route path="/admin/rule" element={<KelolaRule />} />
              <Route path="/admin/pertanyaan" element={<PertanyaanAdmin />} />
              <Route path="/admin/riwayat" element={<RiwayatAdmin />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AppProvider>
  );
}
