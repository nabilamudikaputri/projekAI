export type Gejala = { kode: string; nama: string };
export type Masalah = { kode: string; nama: string; solusi: string };
export type Rule = { kode: string; if: string[]; then: string }; // then = kode masalah

export const seedGejala: Gejala[] = [
  { kode: "G01", nama: "Error 500 Internal Server Error" },
  { kode: "G02", nama: "Route Not Found" },
  { kode: "G03", nama: "Migration Gagal" },
  { kode: "G04", nama: "Database Connection Failed" },
  { kode: "G05", nama: "SQLSTATE Error" },
  { kode: "G06", nama: "Class Not Found" },
  { kode: "G07", nama: "Controller Not Found" },
  { kode: "G08", nama: "View Not Found" },
  { kode: "G09", nama: "Page Expired 419" },
  { kode: "G10", nama: "CSRF Token Mismatch" },
  { kode: "G11", nama: "Composer Autoload Error" },
  { kode: "G12", nama: "Vendor Folder Tidak Ditemukan" },
  { kode: "G13", nama: "php artisan tidak berjalan" },
  { kode: "G14", nama: "Permission Denied" },
  { kode: "G15", nama: "Storage Link Error" },
  { kode: "G16", nama: "Session Error" },
  { kode: "G17", nama: "Cache Error" },
  { kode: "G18", nama: "Package Gagal Install" },
  { kode: "G19", nama: "Login Gagal" },
  { kode: "G20", nama: "File .env Tidak Terbaca" },
];

export const seedMasalah: Masalah[] = [
  {
    kode: "P01",
    nama: "Konfigurasi .env salah",
    solusi:
      "Periksa file .env, pastikan nilai APP_KEY, DB_HOST, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD sudah benar. Jalankan php artisan config:clear.",
  },
  {
    kode: "P02",
    nama: "Database belum terhubung",
    solusi:
      "Pastikan server MySQL aktif, periksa konfigurasi database pada file .env, lalu jalankan php artisan migrate.",
  },
  {
    kode: "P03",
    nama: "Route belum didaftarkan",
    solusi:
      "Periksa file routes/web.php atau routes/api.php, pastikan route sudah terdaftar dan URL yang diakses sesuai.",
  },
  {
    kode: "P04",
    nama: "Controller tidak ditemukan",
    solusi:
      "Pastikan file controller tersedia pada folder app/Http/Controllers, namespace benar, dan route mengarah ke controller yang tepat.",
  },
  {
    kode: "P05",
    nama: "View tidak ditemukan",
    solusi:
      "Pastikan file view tersedia pada folder resources/views dan nama file sesuai dengan yang dipanggil pada controller.",
  },
  {
    kode: "P06",
    nama: "Composer bermasalah",
    solusi:
      "Jalankan composer install, composer update, atau composer dump-autoload untuk memperbarui dependency dan autoload.",
  },
  {
    kode: "P07",
    nama: "Dependency hilang",
    solusi:
      "Hapus folder vendor, kemudian jalankan composer install untuk mengunduh ulang seluruh dependency yang dibutuhkan proyek.",
  },
  {
    kode: "P08",
    nama: "CSRF tidak valid",
    solusi:
      "Pastikan form menggunakan @csrf, session berjalan dengan baik, dan token CSRF dikirim saat mengirim data.",
  },
  {
    kode: "P09",
    nama: "Permission folder salah",
    solusi:
      "Berikan izin akses yang sesuai pada folder storage dan bootstrap/cache, serta pastikan web server memiliki hak akses yang diperlukan.",
  },
  {
    kode: "P10",
    nama: "Cache atau Session rusak",
    solusi:
      "Jalankan php artisan cache:clear, php artisan config:clear, php artisan route:clear, dan php artisan session:table jika diperlukan.",
  },
];

export const seedRule: Rule[] = [
  { kode: "R01", if: ["G01", "G20"], then: "P01" },
  { kode: "R02", if: ["G04", "G05"], then: "P02" },
  { kode: "R03", if: ["G03", "G04", "G05"], then: "P02" },
  { kode: "R04", if: ["G02"], then: "P03" },
  { kode: "R05", if: ["G02", "G07"], then: "P03" },
  { kode: "R06", if: ["G07"], then: "P04" },
  { kode: "R07", if: ["G07", "G06"], then: "P04" },
  { kode: "R08", if: ["G08"], then: "P05" },
  { kode: "R09", if: ["G08", "G01"], then: "P05" },
  { kode: "R10", if: ["G11"], then: "P06" },
  { kode: "R11", if: ["G11", "G12"], then: "P06" },
  { kode: "R12", if: ["G18", "G12"], then: "P07" },
  { kode: "R13", if: ["G18", "G11"], then: "P07" },
  { kode: "R14", if: ["G09"], then: "P08" },
  { kode: "R15", if: ["G09", "G10"], then: "P08" },
  { kode: "R16", if: ["G14"], then: "P09" },
  { kode: "R17", if: ["G15", "G14"], then: "P09" },
  { kode: "R18", if: ["G16"], then: "P10" },
  { kode: "R19", if: ["G17"], then: "P10" },
  { kode: "R20", if: ["G16", "G17"], then: "P10" },
];

export type User = {
  id: string;
  nama: string;
  email: string;
  password: string;
};

export type Pertanyaan = {
  id: string;
  userId?: string;
  nama: string;
  pesan: string;
  tanggal: string; // ISO
  balasan?: string;
  tanggalBalasan?: string;
  status: "baru" | "dibalas";
};

export type Konsultasi = {
  id: string;
  userId?: string;
  tanggal: string; // ISO
  selectedGejala: string[];
  results: DiagnosaResult[];
};

export type DiagnosaResult = {
  masalahKode: string;
  masalahNama: string;
  solusi: string;
  matchedGejala: string[]; // kode gejala yang cocok & dipilih
  ruleGejala: string[]; // semua gejala unik pada rule yang berkontribusi
  ruleKode: string[]; // rule yang terpenuhi
  persentase: number;
};
