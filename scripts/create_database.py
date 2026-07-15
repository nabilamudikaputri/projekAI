"""Membuat basis data SQLite LarCare dari basis pengetahuan aplikasi."""
from pathlib import Path
import re
import sqlite3

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "src" / "app" / "lib" / "data.ts").read_text(encoding="utf-8")
DATABASE = ROOT / "database" / "larcare.db"
DATABASE.parent.mkdir(exist_ok=True)

def section(name: str) -> str:
    return re.search(rf"export const {name}.*?= \[(.*?)\n\];", SOURCE, re.S).group(1)

gejala = re.findall(r'\{\s*kode:\s*"([^"]+)",\s*nama:\s*"([^"]+)"\s*\}', section("seedGejala"))
rules = re.findall(r'\{\s*kode:\s*"([^"]+)",\s*if:\s*\[([^\]]*)\],\s*then:\s*"([^"]+)"\s*\}', section("seedRule"))
masalah = re.findall(
    r'\{\s*kode:\s*"([^"]+)",\s*nama:\s*"([^"]+)",\s*solusi:\s*\n\s*"([^"]+)"\s*,?\s*\}',
    section("seedMasalah"),
    re.S,
)

with sqlite3.connect(DATABASE) as db:
    db.executescript("""
    PRAGMA foreign_keys = ON;
    DROP TABLE IF EXISTS konsultasi_gejala;
    DROP TABLE IF EXISTS hasil_diagnosa;
    DROP TABLE IF EXISTS konsultasi;
    DROP TABLE IF EXISTS pertanyaan;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS rule_gejala;
    DROP TABLE IF EXISTS rules;
    DROP TABLE IF EXISTS masalah;
    DROP TABLE IF EXISTS gejala;

    CREATE TABLE gejala (kode TEXT PRIMARY KEY, nama TEXT NOT NULL);
    CREATE TABLE masalah (kode TEXT PRIMARY KEY, nama TEXT NOT NULL, solusi TEXT NOT NULL);
    CREATE TABLE rules (kode TEXT PRIMARY KEY, masalah_kode TEXT NOT NULL REFERENCES masalah(kode));
    CREATE TABLE rule_gejala (
      rule_kode TEXT NOT NULL REFERENCES rules(kode) ON DELETE CASCADE,
      gejala_kode TEXT NOT NULL REFERENCES gejala(kode),
      PRIMARY KEY (rule_kode, gejala_kode)
    );
    CREATE TABLE users (
      id TEXT PRIMARY KEY, nama TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, dibuat_pada TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE konsultasi (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), tanggal TEXT NOT NULL
    );
    CREATE TABLE konsultasi_gejala (
      konsultasi_id TEXT NOT NULL REFERENCES konsultasi(id) ON DELETE CASCADE,
      gejala_kode TEXT NOT NULL REFERENCES gejala(kode),
      PRIMARY KEY (konsultasi_id, gejala_kode)
    );
    CREATE TABLE hasil_diagnosa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      konsultasi_id TEXT NOT NULL REFERENCES konsultasi(id) ON DELETE CASCADE,
      masalah_kode TEXT NOT NULL REFERENCES masalah(kode),
      persentase INTEGER NOT NULL CHECK (persentase BETWEEN 0 AND 100),
      peringkat INTEGER NOT NULL
    );
    CREATE TABLE pertanyaan (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), nama TEXT NOT NULL,
      pesan TEXT NOT NULL, balasan TEXT, status TEXT NOT NULL DEFAULT 'baru'
        CHECK (status IN ('baru', 'dibalas')),
      tanggal TEXT NOT NULL, tanggal_balasan TEXT
    );
    """)
    db.executemany("INSERT INTO gejala VALUES (?, ?)", gejala)
    db.executemany("INSERT INTO masalah VALUES (?, ?, ?)", masalah)
    for rule_kode, raw_gejala, masalah_kode in rules:
        db.execute("INSERT INTO rules VALUES (?, ?)", (rule_kode, masalah_kode))
        db.executemany(
            "INSERT INTO rule_gejala VALUES (?, ?)",
            [(rule_kode, code) for code in re.findall(r'"([^"]+)"', raw_gejala)],
        )

print(f"Database dibuat: {DATABASE}")
