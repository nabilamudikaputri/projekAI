import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Gejala,
  Konsultasi,
  Masalah,
  Pertanyaan,
  Rule,
  User,
  seedGejala,
  seedMasalah,
  seedRule,
} from "../lib/data";

type AppState = {
  gejala: Gejala[];
  masalah: Masalah[];
  rules: Rule[];
  konsultasi: Konsultasi[];
  isAdmin: boolean;
  users: User[];
  currentUser: User | null;
  pertanyaan: Pertanyaan[];
  setGejala: (g: Gejala[]) => void;
  setMasalah: (m: Masalah[]) => void;
  setRules: (r: Rule[]) => void;
  addKonsultasi: (k: Konsultasi) => void;
  clearKonsultasi: () => void;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  registerUser: (nama: string, email: string, password: string) => string | null;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  updateUser: (data: {
    nama: string;
    email: string;
    password?: string;
  }) => string | null;
  addPertanyaan: (pesan: string) => void;
  replyPertanyaan: (id: string, balasan: string) => void;
  deletePertanyaan: (id: string) => void;
};

const AppContext = createContext<AppState | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [gejala, setGejalaState] = useState<Gejala[]>(() =>
    load("sp_gejala", seedGejala),
  );
  const [masalah, setMasalahState] = useState<Masalah[]>(() =>
    load("sp_masalah", seedMasalah),
  );
  const [rules, setRulesState] = useState<Rule[]>(() =>
    load("sp_rules", seedRule),
  );
  const [konsultasi, setKonsultasi] = useState<Konsultasi[]>(() =>
    load("sp_konsultasi", []),
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    load("sp_isAdmin", false),
  );
  const [users, setUsers] = useState<User[]>(() => load("sp_users", []));
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    load("sp_currentUser", null),
  );
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>(() =>
    load("sp_pertanyaan", []),
  );

  useEffect(() => {
    localStorage.setItem("sp_gejala", JSON.stringify(gejala));
  }, [gejala]);
  useEffect(() => {
    localStorage.setItem("sp_masalah", JSON.stringify(masalah));
  }, [masalah]);
  useEffect(() => {
    localStorage.setItem("sp_rules", JSON.stringify(rules));
  }, [rules]);
  useEffect(() => {
    localStorage.setItem("sp_konsultasi", JSON.stringify(konsultasi));
  }, [konsultasi]);
  useEffect(() => {
    localStorage.setItem("sp_isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);
  useEffect(() => {
    localStorage.setItem("sp_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("sp_currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem("sp_pertanyaan", JSON.stringify(pertanyaan));
  }, [pertanyaan]);

  const value: AppState = {
    gejala,
    masalah,
    rules,
    konsultasi,
    isAdmin,
    users,
    currentUser,
    pertanyaan,
    setGejala: setGejalaState,
    setMasalah: setMasalahState,
    setRules: setRulesState,
    addKonsultasi: (k) => setKonsultasi((prev) => [k, ...prev]),
    clearKonsultasi: () => setKonsultasi([]),
    login: (email, p) => {
      // Kredensial admin demo. Ganti dengan autentikasi nyata bila diperlukan.
      const ok =
        email.trim().toLowerCase() === "admin@larcare.com" && p === "admin123";
      if (ok) setIsAdmin(true);
      return ok;
    },
    logout: () => setIsAdmin(false),
    registerUser: (nama, email, password) => {
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email === normalized)) {
        return "Email sudah terdaftar.";
      }
      const user: User = {
        id: `U${Date.now()}`,
        nama: nama.trim(),
        email: normalized,
        password,
      };
      setUsers((prev) => [...prev, user]);
      setCurrentUser(user);
      return null;
    },
    loginUser: (email, password) => {
      const normalized = email.trim().toLowerCase();
      const user = users.find(
        (u) => u.email === normalized && u.password === password,
      );
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    },
    logoutUser: () => setCurrentUser(null),
    updateUser: ({ nama, email, password }) => {
      if (!currentUser) return "Tidak ada pengguna yang masuk.";
      const normalized = email.trim().toLowerCase();
      if (
        users.some((u) => u.email === normalized && u.id !== currentUser.id)
      ) {
        return "Email sudah dipakai akun lain.";
      }
      const updated: User = {
        ...currentUser,
        nama: nama.trim(),
        email: normalized,
        password: password && password.trim() ? password : currentUser.password,
      };
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updated : u)),
      );
      setCurrentUser(updated);
      return null;
    },
    addPertanyaan: (pesan) => {
      const p: Pertanyaan = {
        id: `Q${Date.now()}`,
        userId: currentUser?.id,
        nama: currentUser?.nama ?? "Tamu",
        pesan: pesan.trim(),
        tanggal: new Date().toISOString(),
        status: "baru",
      };
      setPertanyaan((prev) => [p, ...prev]);
    },
    replyPertanyaan: (id, balasan) => {
      setPertanyaan((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                balasan: balasan.trim(),
                tanggalBalasan: new Date().toISOString(),
                status: "dibalas",
              }
            : p,
        ),
      );
    },
    deletePertanyaan: (id) =>
      setPertanyaan((prev) => prev.filter((p) => p.id !== id)),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
