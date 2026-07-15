# Cara Kerja Sistem AI projekAI

Dokumen ini menjelaskan secara rinci bagaimana sistem AI pada proyek berfungsi. Penjelasan akan fokus pada alur dan proses internal sistem, bukan pada kode atau file tertentu.

## 1. Tujuan Sistem

Sistem AI ini dibuat untuk membantu mendiagnosis masalah teknis pada aplikasi Laravel. Pengguna memilih gejala yang mereka alami, lalu sistem memetakan kombinasi gejala tersebut ke kemungkinan masalah dan solusi.

## 2. Struktur Sistem Secara Konseptual

Sistem ini dapat dibagi menjadi empat bagian utama:

1. Pengumpulan gejala.
2. Representasi pengetahuan.
3. Inferensi aturan.
4. Penyajian hasil.

### 2.1. Pengumpulan Gejala

Pengguna diminta memilih gejala error yang terjadi. Setiap gejala diwakili oleh kode unik.

Contoh gejala:

- `G01`: Error 500 Internal Server Error
- `G20`: File .env Tidak Terbaca
- `G08`: View Not Found

Pilihan ini menjadi input awal bagi sistem.

### 2.2. Representasi Pengetahuan

Sistem menyimpan tiga informasi penting:

- **Gejala**: daftar kondisi yang dapat dipilih oleh pengguna.
- **Masalah**: daftar diagnosis yang mungkin terjadi.
- **Aturan**: hubungan antara gejala dan diagnosis.

Aturan adalah dasar logika sistem. Setiap aturan menyatakan bahwa kombinasi gejala tertentu mengarah ke diagnosis tertentu.

## 3. Alur Kerja Sistem

### 3.1. Langkah 1: Input dari Pengguna

Pengguna memilih sejumlah gejala yang dialami dari daftar. Pemilihan ini merepresentasikan kondisi sistem yang sedang berlangsung.

Contoh input:

- `G01` dipilih
- `G20` dipilih

### 3.2. Langkah 2: Menyusun Kondisi

Semua gejala yang dipilih dikumpulkan menjadi satu kumpulan kondisi. Kumpulan ini menjadi data yang akan dianalisis.

Dalam contoh di atas, kondisi yang disusun adalah:

- Error 500 Internal Server Error
- File .env Tidak Terbaca

### 3.3. Langkah 3: Mencocokkan Kondisi dengan Aturan

Sistem membaca semua aturan yang tersedia. Setiap aturan memiliki daftar gejala yang harus dipenuhi.

Aturan kemudian dievaluasi terhadap kondisi pengguna:

- apakah semua gejala aturan muncul dalam input?
- berapa banyak gejala aturan yang cocok?

### 3.4. Langkah 4: Menghitung Kecocokan

Sistem menghitung seberapa cocok setiap aturan dengan kondisi input.

Rumusnya:

```
Kecocokan = (jumlah gejala aturan yang dipilih pengguna) / (jumlah gejala total dalam aturan)
```

Jika semua gejala dalam aturan cocok, maka kecocokan adalah 100%.

### 3.5. Langkah 5: Memilih Hasil Terbaik

Satu masalah bisa dipicu oleh lebih dari satu aturan. Sistem memilih aturan terbaik untuk setiap masalah berdasarkan:

- persentase kecocokan tertinggi,
- jika tie, jumlah gejala cocok terbanyak.

Hasil ini menunjukkan diagnosis terbaik untuk setiap masalah yang mungkin.

### 3.6. Langkah 6: Mengurutkan dan Menyajikan Hasil

Setelah semua aturan dievaluasi:

- sistem mengurutkan diagnosis berdasarkan tingkat kecocokan,
- diagnosis dengan persentase tertinggi ditampilkan di atas,
- hasil disertai dengan solusi dan daftar gejala yang cocok.

## 4. Contoh Alur Sistem Nyata

Berikut ini contoh nyata sesuai dengan aturan yang ada dalam sistem.

### 4.1. Contoh 1: `G01` + `G20`

- Gejala yang dipilih:
  - `G01`: Error 500 Internal Server Error
  - `G20`: File .env Tidak Terbaca
- Aturan `R01` cocok dengan kedua gejala tersebut.
- Karena semua gejala aturan terpenuhi, kecocokan menjadi 100%.
- Hasil yang diperoleh:
  - Masalah: `P01` — Konfigurasi .env salah
  - Solusi: periksa konfigurasi di file .env dan jalankan `php artisan config:clear`
  - Persentase kecocokan: 100%

### 4.2. Contoh 2: `G08` + `G01`

- Gejala yang dipilih:
  - `G08`: View Not Found
  - `G01`: Error 500 Internal Server Error
- Aturan `R09` mengatakan jika `G08` dan `G01`, maka masalah `P05`.
- Hasil yang diperoleh:
  - Masalah: `P05` — View tidak ditemukan
  - Solusi: pastikan file view tersedia dan nama file benar
  - Persentase kecocokan: 100%

### 4.3. Contoh 3: `G02` + `G07`

- Gejala yang dipilih:
  - `G02`: Route Not Found
  - `G07`: Controller Not Found
- Aturan `R05` mengarah ke `P03` (Route belum didaftarkan)
- Aturan `R07` mengarah ke `P04` (Controller tidak ditemukan)
- Sistem dapat menampilkan kedua kemungkinan tersebut saat kedua aturan cocok.

## 5. Detail Logika Penalaran Sistem

### 5.1. Rule-based, Bukan Statistik

Sistem ini bukan model machine learning. Ia menggunakan logika aturan eksplisit:

- aturan ditulis secara langsung oleh pembuat sistem,
- keputusan dibuat berdasarkan kecocokan kondisi terhadap aturan,
- tidak ada proses pelatihan data otomatis.

### 5.2. Forward Chaining dalam Konteks Ini

Forward chaining artinya sistem bergerak dari kondisi input ke hasil output:

- mulai dengan data gejala pengguna,
- cek aturan satu per satu,
- ambil hasil dari aturan yang cocok.

### 5.3. Pemilihan Aturan Terbaik

Untuk setiap masalah, hanya aturan terbaik yang digunakan sebagai representasi hasil.

- aturan terbaik adalah aturan dengan kecocokan tertinggi,
- jika ada nilai kecocokan yang sama, sistem memilih aturan dengan jumlah gejala cocok terbanyak.

## 6. Sistem Menangani Ketidaklengkapan Data

Jika pengguna hanya memilih sebagian gejala dari sebuah aturan, sistem masih dapat menghitung kecocokan.

- aturan tetap dievaluasi,
- hasil muncul dengan persentase yang lebih rendah,
- ini berguna untuk menunjukkan diagnosis kemungkinan meskipun tidak semua syarat terpenuhi.

## 7. Kekuatan dan Kelemahan Sistem

### 7.1. Kekuatan

- Hasil mudah dijelaskan.
- Sistem cocok untuk diagnosis teknis spesifik.
- Solusi langsung berorientasi perbaikan.

### 7.2. Kelemahan

- Hasil sangat bergantung pada kualitas aturan.
- Sistem tidak belajar dari data baru secara otomatis.
- Jika aturan belum lengkap, beberapa kasus tidak terdiagnosis dengan baik.

## 8. Mengapa Ini Masuk Kategori AI

Sistem ini dikategorikan AI karena ia:

- mengambil keputusan dari input pengguna,
- melakukan inferensi berdasarkan aturan,
- menghasilkan output diagnosis secara otomatis.

Ini lebih mirip sistem pakar (expert system) daripada model machine learning, tetapi tetap berada dalam ranah kecerdasan buatan.

## 9. Alur Ringkas Sistem

1. Pengguna memilih gejala.
2. Sistem mengumpulkan gejala menjadi kondisi.
3. Sistem mencocokkan kondisi dengan aturan.
4. Sistem menghitung kecocokan aturan.
5. Sistem memilih hasil terbaik.
6. Sistem menampilkan diagnosis dan solusi.

---

Penjelasan ini menguraikan proses sistem secara detail, dengan contoh konkret yang sesuai dengan aturan dan tujuan proyek.
