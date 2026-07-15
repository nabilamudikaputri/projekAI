# LarCare Database

larcare.db adalah basis data SQLite untuk data aplikasi LarCare. Isinya mencakup gejala, masalah, aturan, pengguna, konsultasi, hasil diagnosa, dan pertanyaan.

Untuk membangun ulang database dari data awal aplikasi, jalankan perintah Python create_database.py di folder scripts.

Frontend saat ini tetap memakai localStorage agar dapat berjalan tanpa server. Agar data pengguna baru benar-benar masuk ke SQLite, sambungkan operasi pada AppStore.tsx ke API backend yang menggunakan database/larcare.db.
