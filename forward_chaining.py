"""
ErrorWise - Sistem Pakar Diagnosa Kesalahan Umum Pengembangan Website Laravel
Metode: Forward Chaining + Tingkat Keyakinan (Confidence)

Cara menjalankan di VSCode / terminal:
    python forward_chaining.py

Pastikan Python 3 sudah terpasang (cek dengan: python --version).
"""

# ----------------------------------------------------------------------------
# BASIS PENGETAHUAN
# ----------------------------------------------------------------------------

GEJALA = {
    "G01": "Error 500 Internal Server Error",
    "G02": "Route Not Found",
    "G03": "Migration Gagal",
    "G04": "Database Connection Failed",
    "G05": "SQLSTATE Error",
    "G06": "Class Not Found",
    "G07": "Controller Not Found",
    "G08": "View Not Found",
    "G09": "Page Expired 419",
    "G10": "CSRF Token Mismatch",
    "G11": "Composer Autoload Error",
    "G12": "Vendor Folder Tidak Ditemukan",
    "G13": "php artisan tidak berjalan",
    "G14": "Permission Denied",
    "G15": "Storage Link Error",
    "G16": "Session Error",
    "G17": "Cache Error",
    "G18": "Package Gagal Install",
    "G19": "Login Gagal",
    "G20": "File .env Tidak Terbaca",
}

MASALAH = {
    "P01": "Konfigurasi .env salah",
    "P02": "Database belum terhubung",
    "P03": "Route belum didaftarkan",
    "P04": "Controller tidak ditemukan",
    "P05": "View tidak ditemukan",
    "P06": "Composer bermasalah",
    "P07": "Dependency hilang",
    "P08": "CSRF tidak valid",
    "P09": "Permission folder salah",
    "P10": "Cache atau Session rusak",
}

SOLUSI = {
    "P01": "Periksa file .env, pastikan nilai APP_KEY, DB_HOST, DB_DATABASE, "
           "DB_USERNAME, dan DB_PASSWORD sudah benar. Jalankan php artisan config:clear.",
    "P02": "Pastikan server MySQL aktif, periksa konfigurasi database pada file .env, "
           "lalu jalankan php artisan migrate.",
    "P03": "Periksa file routes/web.php atau routes/api.php, pastikan route sudah "
           "terdaftar dan URL yang diakses sesuai.",
    "P04": "Pastikan file controller tersedia pada folder app/Http/Controllers, "
           "namespace benar, dan route mengarah ke controller yang tepat.",
    "P05": "Pastikan file view tersedia pada folder resources/views dan nama file "
           "sesuai dengan yang dipanggil pada controller.",
    "P06": "Jalankan composer install, composer update, atau composer dump-autoload "
           "untuk memperbarui dependency dan autoload.",
    "P07": "Hapus folder vendor, kemudian jalankan composer install untuk mengunduh "
           "ulang seluruh dependency yang dibutuhkan proyek.",
    "P08": "Pastikan form menggunakan @csrf, session berjalan dengan baik, dan token "
           "CSRF dikirim saat mengirim data.",
    "P09": "Berikan izin akses yang sesuai pada folder storage dan bootstrap/cache, "
           "serta pastikan web server memiliki hak akses yang diperlukan.",
    "P10": "Jalankan php artisan cache:clear, php artisan config:clear, "
           "php artisan route:clear, dan php artisan session:table jika diperlukan.",
}

# Setiap rule: (kode_rule, [gejala IF ...], masalah THEN)
RULES = [
    ("R01", ["G01", "G20"], "P01"),
    ("R02", ["G04", "G05"], "P02"),
    ("R03", ["G03", "G04", "G05"], "P02"),
    ("R04", ["G02"], "P03"),
    ("R05", ["G02", "G07"], "P03"),
    ("R06", ["G07"], "P04"),
    ("R07", ["G07", "G06"], "P04"),
    ("R08", ["G08"], "P05"),
    ("R09", ["G08", "G01"], "P05"),
    ("R10", ["G11"], "P06"),
    ("R11", ["G11", "G12"], "P06"),
    ("R12", ["G18", "G12"], "P07"),
    ("R13", ["G18", "G11"], "P07"),
    ("R14", ["G09"], "P08"),
    ("R15", ["G09", "G10"], "P08"),
    ("R16", ["G14"], "P09"),
    ("R17", ["G15", "G14"], "P09"),
    ("R18", ["G16"], "P10"),
    ("R19", ["G17"], "P10"),
    ("R20", ["G16", "G17"], "P10"),
]


# ----------------------------------------------------------------------------
# MESIN INFERENSI (FORWARD CHAINING)
# ----------------------------------------------------------------------------

def forward_chaining(selected_gejala):
    """
    Penalaran maju: cocokkan gejala yang dipilih dengan setiap rule, hitung
    persentase keyakinan (gejala cocok / total gejala rule). Tiap masalah diwakili
    rule dengan kecocokan terbaik, lalu hasil diurutkan (ranking) menurun.
    """
    selected = set(selected_gejala)
    best = {}  # kode_masalah -> dict hasil terbaik

    for kode_rule, kondisi, kode_masalah in RULES:
        cocok = [g for g in kondisi if g in selected]
        if not cocok:
            continue

        persentase = round(len(cocok) / len(kondisi) * 100)
        kandidat = {
            "masalah": kode_masalah,
            "nama": MASALAH[kode_masalah],
            "rule": kode_rule,
            "gejala_cocok": cocok,
            "persentase": persentase,
        }

        sebelumnya = best.get(kode_masalah)
        if (
            sebelumnya is None
            or persentase > sebelumnya["persentase"]
            or (
                persentase == sebelumnya["persentase"]
                and len(cocok) > len(sebelumnya["gejala_cocok"])
            )
        ):
            best[kode_masalah] = kandidat

    hasil = list(best.values())
    hasil.sort(key=lambda x: x["persentase"], reverse=True)
    return hasil


# ----------------------------------------------------------------------------
# ANTARMUKA TERMINAL
# ----------------------------------------------------------------------------

def tampilkan_gejala():
    print("\n=== DAFTAR GEJALA ===")
    for kode, nama in GEJALA.items():
        print(f"  {kode} - {nama}")


def minta_input_gejala():
    print("\nMasukkan kode gejala yang Anda alami, pisahkan dengan koma.")
    print("Contoh: G03, G04, G05")
    raw = input("Gejala Anda: ").strip().upper()
    dipilih = [g.strip() for g in raw.replace(";", ",").split(",") if g.strip()]
    valid = [g for g in dipilih if g in GEJALA]
    tidak_valid = [g for g in dipilih if g not in GEJALA]
    if tidak_valid:
        print(f"  (diabaikan, kode tidak dikenal: {', '.join(tidak_valid)})")
    return valid


def tampilkan_hasil(hasil, dipilih):
    print("\n" + "=" * 60)
    print("HASIL DIAGNOSA")
    print("=" * 60)

    if not hasil:
        print("Tidak ada masalah yang cocok dengan gejala yang dipilih.")
        return

    utama = hasil[0]
    print(f"\nDiagnosa Utama : {utama['nama']}")
    print(f"Tingkat Keyakinan : {utama['persentase']}%")
    print("Gejala Cocok :")
    for g in utama["gejala_cocok"]:
        print(f"  - {GEJALA[g]}")
    print(f"\nSolusi :\n  {SOLUSI[utama['masalah']]}")

    if len(hasil) > 1:
        print("\n--- Kemungkinan Lain (Ranking) ---")
        for i, r in enumerate(hasil, start=1):
            print(f"  {i}. {r['nama']:<28} {r['persentase']}%")
    print("=" * 60)


def main():
    print("=" * 60)
    print(" ErrorWise - Sistem Pakar Diagnosa Error Laravel")
    print(" Metode: Forward Chaining")
    print("=" * 60)

    while True:
        tampilkan_gejala()
        dipilih = minta_input_gejala()

        if not dipilih:
            print("\nTidak ada gejala valid yang dipilih.")
        else:
            hasil = forward_chaining(dipilih)
            tampilkan_hasil(hasil, dipilih)

        lagi = input("\nKonsultasi lagi? (y/n): ").strip().lower()
        if lagi != "y":
            print("Terima kasih telah menggunakan ErrorWise!")
            break


if __name__ == "__main__":
    main()
