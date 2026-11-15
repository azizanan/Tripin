# TRIPIN Database

Seluruh file database MySQL dikelola di dalam folder backend ini.

## File
- `schema.sql`: membuat database `tripin_db` beserta tabel kategori dan tempat.
- `migrations/`: perubahan struktur database bertahap.
- `seeds/`: data awal untuk kebutuhan pengembangan.

## Import schema

Jalankan melalui MySQL Workbench atau CLI:

```bash
mysql -u root -p < backend/database/schema.sql
```

Sesuaikan kredensial koneksi pada `backend/.env`. Jangan pernah mengunggah file `.env` ke GitHub.
