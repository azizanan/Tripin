# TRIPIN Backend

REST API TRIPIN menggunakan **Node.js + Express** dan **MySQL** melalui package `mysql2`.

## Persyaratan
- Node.js versi LTS
- npm
- MySQL Server

## Instalasi
```bash
cd backend
npm install
```

Buat file konfigurasi lokal dengan menyalin `.env.example` menjadi `.env`, lalu sesuaikan kredensial MySQL.

## Siapkan database
Jalankan schema SQL dari root repository:

```bash
mysql -u root -p < backend/database/schema.sql
```

Atau buka `backend/database/schema.sql` melalui MySQL Workbench dan jalankan script tersebut.

## Menjalankan API
```bash
npm run dev
```

Server berjalan di http://localhost:5000.

## Endpoint awal
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Informasi API |
| GET | `/api/health` | Memeriksa API dan koneksi MySQL |
| GET | `/api/places` | Daftar tempat yang sudah dipublikasikan |
| GET | `/api/places/:id` | Detail tempat berdasarkan ID |

### Filter daftar tempat
- `GET /api/places?search=tugu`
- `GET /api/places?category=wisata`
- `GET /api/places?page=1&limit=12`

Data tempat hanya ditampilkan apabila `is_published = TRUE`.

## Struktur backend
```
backend/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env.example
├── package.json
└── server.js
```

## Keamanan
- Jangan commit file `.env`.
- Gunakan `.env.example` untuk berbagi nama variabel konfigurasi tanpa nilai rahasia.
- Endpoint publik hanya menampilkan tempat yang telah dipublikasikan.
