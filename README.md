# Errorwise

Sistem pakar diagnosa kesalahan umum pengembangan website Laravel pada mahasiswa pemula menggunakan forward chaining.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Data Sistem Pakar

Berikut adalah data utama yang digunakan oleh sistem pakar dalam aplikasi ini.

### Tabel Ringkasan Data

| Jenis Data | Fungsi | Hasil yang Dihasilkan |
| --- | --- | --- |
| Gejala | Menyimpan gejala yang dipilih pengguna sebagai input sistem | Daftar gejala yang relevan dengan permasalahan yang dialami |
| Masalah | Menyimpan masalah utama beserta solusi yang sesuai | Identifikasi masalah yang paling mungkin terjadi |
| Rule | Menghubungkan gejala dengan masalah berdasarkan aturan sistem | Penentuan masalah dari gejala yang telah dipilih |
| Logika Sistem | Menjelaskan alur inferensi yang digunakan untuk mendiagnosis | Hasil diagnosa yang terurut berdasarkan tingkat kecocokan |

### Tabel Gejala

| Kode | Gejala |
| --- | --- |
| G01 | Error 500 Internal Server Error |
| G02 | Route Not Found |
| G03 | Migration Gagal |
| G04 | Database Connection Failed |
| G05 | SQLSTATE Error |
| G06 | Class Not Found |
| G07 | Controller Not Found |
| G08 | View Not Found |
| G09 | Page Expired 419 |
| G10 | CSRF Token Mismatch |
| G11 | Composer Autoload Error |
| G12 | Vendor Folder Tidak Ditemukan |
| G13 | php artisan tidak berjalan |
| G14 | Permission Denied |
| G15 | Storage Link Error |
| G16 | Session Error |
| G17 | Cache Error |
| G18 | Package Gagal Install |
| G19 | Login Gagal |
| G20 | File .env Tidak Terbaca |

### Tabel Masalah

| Kode | Masalah | Solusi |
| --- | --- | --- |
| P01 | Konfigurasi .env salah | Periksa file .env, pastikan nilai APP_KEY, DB_HOST, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD sudah benar. Jalankan php artisan config:clear. |
| P02 | Database belum terhubung | Pastikan server MySQL aktif, periksa konfigurasi database pada file .env, lalu jalankan php artisan migrate. |
| P03 | Route belum didaftarkan | Periksa file routes/web.php atau routes/api.php, pastikan route sudah terdaftar dan URL yang diakses sesuai. |
| P04 | Controller tidak ditemukan | Pastikan file controller tersedia pada folder app/Http/Controllers, namespace benar, dan route mengarah ke controller yang tepat. |
| P05 | View tidak ditemukan | Pastikan file view tersedia pada folder resources/views dan nama file sesuai dengan yang dipanggil pada controller. |
| P06 | Composer bermasalah | Jalankan composer install, composer update, atau composer dump-autoload untuk memperbarui dependency dan autoload. |
| P07 | Dependency hilang | Hapus folder vendor, kemudian jalankan composer install untuk mengunduh ulang seluruh dependency yang dibutuhkan proyek. |
| P08 | CSRF tidak valid | Pastikan form menggunakan @csrf, session berjalan dengan baik, dan token CSRF dikirim saat mengirim data. |
| P09 | Permission folder salah | Berikan izin akses yang sesuai pada folder storage dan bootstrap/cache, serta pastikan web server memiliki hak akses yang diperlukan. |
| P10 | Cache atau Session rusak | Jalankan php artisan cache:clear, php artisan config:clear, php artisan route:clear, dan php artisan session:table jika diperlukan. |

### Tabel Rule

| Kode Rule | Jika (Gejala) | Maka (Masalah) |
| --- | --- | --- |
| R01 | G01, G20 | P01 |
| R02 | G04, G05 | P02 |
| R03 | G03, G04, G05 | P02 |
| R04 | G02 | P03 |
| R05 | G02, G07 | P03 |
| R06 | G07 | P04 |
| R07 | G07, G06 | P04 |
| R08 | G08 | P05 |
| R09 | G08, G01 | P05 |
| R10 | G11 | P06 |
| R11 | G11, G12 | P06 |
| R12 | G18, G12 | P07 |
| R13 | G18, G11 | P07 |
| R14 | G09 | P08 |
| R15 | G09, G10 | P08 |
| R16 | G14 | P09 |
| R17 | G15, G14 | P09 |
| R18 | G16 | P10 |
| R19 | G17 | P10 |
| R20 | G16, G17 | P10 |

### Logika Sistem

| Tahap | Penjelasan |
| --- | --- |
| Input pengguna | Pengguna memilih gejala yang sedang dialami pada antarmuka sistem. |
| Pencocokan rule | Sistem mencocokkan gejala yang dipilih dengan rule yang tersedia dalam basis pengetahuan. |
| Perhitungan persentase | Untuk setiap rule yang sesuai, sistem menghitung tingkat kecocokan berdasarkan jumlah gejala yang terpenuhi. |
| Penentuan masalah | Sistem menilai rule yang paling relevan lalu mengaitkannya dengan masalah yang bersesuaian. |
| Pengurutan hasil | Semua masalah yang terdeteksi diurutkan berdasarkan tingkat kesesuaiannya dari yang tertinggi. |
| Output akhir | Sistem menampilkan hasil diagnosa berupa masalah yang paling mungkin terjadi beserta solusi yang disarankan. |

Sistem ini menggunakan metode forward chaining untuk melakukan inferensi berdasarkan gejala yang dipilih oleh pengguna. Proses ini menghasilkan daftar masalah yang paling sesuai dengan kondisi yang dialami, sehingga pengguna dapat melihat penyebab utama dan langkah penanganan yang direkomendasikan.