Judul : Sistem Pakar Diagnosa Kesalahan Umum Pengembangan Website Laravel pada Mahasiswa Pemula Menggunakan Forward Chaining
Gejala
Kode	Gejala
G01	Error 500 Internal Server Error
G02	Route Not Found
G03	Migration Gagal
G04	Database Connection Failed
G05	SQLSTATE Error
G06	Class Not Found
G07	Controller Not Found
G08	View Not Found
G09	Page Expired 419
G10	CSRF Token Mismatch
G11	Composer Autoload Error
G12	Vendor Folder Tidak Ditemukan
G13	php artisan tidak berjalan
G14	Permission Denied
G15	Storage Link Error
G16	Session Error
G17	Cache Error
G18	Package Gagal Install
G19	Login Gagal
G20	File .env Tidak Terbaca

Masalah
Kode	Masalah
P01	Konfigurasi .env salah
P02	Database belum terhubung
P03	Route belum didaftarkan
P04	Controller tidak ditemukan
P05	View tidak ditemukan
P06	Composer bermasalah
P07	Dependency hilang
P08	CSRF tidak valid
P09	Permission folder salah
P10	Cache atau Session rusak

Kode Rule	Gejala (IF)	Diagnosa/Masalah (THEN)
R01	G01 + G20	P01 (Konfigurasi .env salah)
R02	G04 + G05	P02 (Database belum terhubung)
R03	G03 + G04 + G05	P02 (Database belum terhubung)
R04	G02	P03 (Route belum didaftarkan)
R05	G02 + G07	P03 (Route belum didaftarkan)
R06	G07	P04 (Controller tidak ditemukan)
R07	G07 + G06	P04 (Controller tidak ditemukan)
R08	G08	P05 (View tidak ditemukan)
R09	G08 + G01	P05 (View tidak ditemukan)
R10	G11	P06 (Composer bermasalah)
R11	G11 + G12	P06 (Composer bermasalah)
R12	G18 + G12	P07 (Dependency hilang)
R13	G18 + G11	P07 (Dependency hilang)
R14	G09	P08 (CSRF tidak valid)
R15	G09 + G10	P08 (CSRF tidak valid)
R16	G14	P09 (Permission folder salah)
R17	G15 + G14	P09 (Permission folder salah)
R18	G16	P10 (Cache atau Session rusak)
R19	G17	P10 (Cache atau Session rusak)
R20	G16 + G17	P10 (Cache atau Session rusak)

User
1.	Membuka website. 
2.	Memilih gejala yang dialami. 
3.	Klik tombol Diagnosa. 
4.	Sistem menjalankan Forward Chaining. 
5.	Sistem menampilkan: 
o	Diagnosa masalah 
o	Tingkat kecocokan (%) 
o	Solusi 
Admin
1.	Login. 
2.	Mengelola gejala. 
3.	Mengelola masalah. 
4.	Mengelola rule. 
5.	Melihat riwayat konsultasi. 

Buat Database
Tabel:
users
gejala
masalah
rule
rule_detail
konsultasi


Tahap 2
Buat Halaman
Admin
•	Login 
•	Kelola Gejala 
•	Kelola Masalah 
•	Kelola Rule 
•	Riwayat 
User
•	Konsultasi 
•	Hasil Diagnosa

Tabel Solusi Sistem Pakar
Kode Masalah	Nama Masalah	Solusi
P01	Konfigurasi .env salah	Periksa file .env, pastikan nilai APP_KEY, DB_HOST, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD sudah benar. Jalankan php artisan config:clear.
P02	Database belum terhubung	Pastikan server MySQL aktif, periksa konfigurasi database pada file .env, lalu jalankan php artisan migrate.
P03	Route belum didaftarkan	Periksa file routes/web.php atau routes/api.php, pastikan route sudah terdaftar dan URL yang diakses sesuai.
P04	Controller tidak ditemukan	Pastikan file controller tersedia pada folder app/Http/Controllers, namespace benar, dan route mengarah ke controller yang tepat.
P05	View tidak ditemukan	Pastikan file view tersedia pada folder resources/views dan nama file sesuai dengan yang dipanggil pada controller.
P06	Composer bermasalah	Jalankan composer install, composer update, atau composer dump-autoload untuk memperbarui dependency dan autoload.
P07	Dependency hilang	Hapus folder vendor, kemudian jalankan composer install untuk mengunduh ulang seluruh dependency yang dibutuhkan proyek.
P08	CSRF tidak valid	Pastikan form menggunakan @csrf, session berjalan dengan baik, dan token CSRF dikirim saat mengirim data.
P09	Permission folder salah	Berikan izin akses yang sesuai pada folder storage dan bootstrap/cache, serta pastikan web server memiliki hak akses yang diperlukan.
P10	Cache atau Session rusak	Jalankan php artisan cache:clear, php artisan config:clear, php artisan route:clear, dan php artisan session:table jika diperlukan.

Tambahkan Tingkat Keyakinan (Confidence)
Ini yang bikin nilai AI naik.
Misalnya:
Rule:
R03

G03
G04
G05

THEN P02
User memilih:
G03
G04
Maka:
2 / 3 × 100

= 66%
Output:
Diagnosa:
Database Belum Terhubung

Tingkat Keyakinan:
66%
Dosen biasanya suka fitur ini.
________________________________________
3. Tambahkan Penjelasan Metode Forward Chaining
Buat satu halaman khusus.
Di Figma:
Bagaimana Sistem Bekerja?

1. User memilih gejala
2. Sistem membaca rule
3. Sistem mencocokkan gejala
4. Rule terpenuhi
5. Menampilkan hasil diagnosa
________________________________________
4. Tambahkan Halaman Detail Hasil
Jangan hanya hasil diagnosa.
Contoh:
HASIL DIAGNOSA

Masalah:
Database Belum Terhubung

Gejala Cocok:
✓ Migration Gagal
✓ Database Connection Failed

Persentase:
85%

Solusi:
1. Periksa file .env
2. Pastikan MySQL aktif
3. Jalankan migration ulang
________________________________________
5. Tambahkan Riwayat Konsultasi
Database sudah ada.
Di Figma tambahkan menu:
Riwayat Diagnosa
Isi:
Tanggal	Diagnosa	Persentase
Ini akan berguna saat demo.
________________________________________
6. Tambahkan Dashboard Admin
Saat ini baru disebutkan.
Desain dashboard:
Total Gejala : 20

Total Masalah : 10

Total Rule : 20

Total Konsultasi : 55
Kelihatan lebih profesional.
________________________________________
7. Tambahkan Flowchart AI
Untuk laporan dan presentasi.
Mulai
↓
Pilih Gejala
↓
Simpan Gejala
↓
Cocokkan Rule
↓
Rule Terpenuhi?
↓
Ya
↓
Hitung Persentase
↓
Tampilkan Diagnosa
↓
Tampilkan Solusi
↓
Selesai
________________________________________
8. Halaman Figma yang Harus Ada
Minimal 9 halaman.
User
1.	Landing Page 
2.	Tentang Sistem 
3.	Konsultasi 
4.	Hasil Diagnosa 
5.	Riwayat Diagnosa 
Admin
6.	Login 
7.	Dashboard 
8.	Kelola Gejala 
9.	Kelola Masalah 
10.	Kelola Rule 
11.	Riwayat Konsultasi 
________________________________________
9. Yang Paling Penting Untuk AI
Sekarang dokumen kalian baru punya:
Gejala
↓
Rule
↓
Masalah
Aku sarankan tambahkan:
Gejala
↓
Rule Matching
↓
Perhitungan Kecocokan
↓
Ranking Diagnosa
↓
Hasil Terbaik
↓
Solusi
Jadi kalau ada 3 kemungkinan masalah, sistem menampilkan:
Rank	Masalah	Persentase
1	Database Belum Terhubung	85%
2	Konfigurasi .env Salah	60%
3	Composer Bermasalah	20%
Ini jauh lebih terlihat sebagai sistem AI dibanding langsung menampilkan satu hasil.

