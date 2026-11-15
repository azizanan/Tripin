# TRIPIN Database

Seluruh file MySQL dikelola di dalam folder backend.

## File
- `schema.sql`: membuat database `tripin_db` dan tabel users, categories, destinations, reviews, favorites.
- `seeds/initial_data.sql`: kategori awal dan contoh destinasi.
- `migrations/`: perubahan struktur database bertahap.

## Instalasi database baru

Jalankan perintah berikut dari root repository:

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p tripin_db < backend/database/seeds/initial_data.sql
```

Contoh tempat pada seed disimpan sebagai draft. Admin harus memeriksa alamat, harga, jam operasional, koordinat, dan gambar dari sumber tepercaya sebelum memublikasikannya.

Jangan pernah mengunggah file `.env` berisi password database atau JWT secret ke GitHub.
