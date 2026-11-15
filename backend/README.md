# TRIPIN Backend

Backend TRIPIN menggunakan Node.js, Express, MySQL (mysql2), JWT, dan bcrypt. Role pengguna adalah `user` dan `admin`.

## Persyaratan
- Node.js 20 LTS atau lebih baru
- npm
- MySQL 8.0+

## Instalasi
```bash
cd backend
npm install
```

Salin `.env.example` menjadi `.env`, kemudian isi kredensial MySQL dan JWT secret acak minimal 32 karakter. Jangan commit file `.env`.

## Siapkan database baru
Jalankan dari root repository:

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p tripin_db < backend/database/seeds/initial_data.sql
```

Jika database lokal sebelumnya sudah dibuat dari schema awal TRIPIN yang memakai tabel `places` dan kolom `categories.name`, jalankan setelah schema baru:

```bash
mysql -u root -p tripin_db < backend/database/migrations/001_upgrade_preliminary_schema.sql
mysql -u root -p tripin_db < backend/database/seeds/initial_data.sql
```

Contoh tempat pada seed sengaja disimpan sebagai draft. Lengkapi dan verifikasi alamat, harga, jam operasional, koordinat, dan foto sebelum admin memublikasikannya.

## Buat akun admin pertama
Isi `ADMIN_NAME`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` (minimal 12 karakter) pada `.env`, lalu jalankan:

```bash
npm run create-admin
```

Perintah ini membuat akun admin baru, atau memberikan role admin pada email yang sudah ada.

## Pengujian otomatis

Jalankan unit test validasi dan API integration test:

```bash
npm test
npm run test:integration
```

Integration test memerlukan database MySQL yang sudah dibuat dan diisi seed, serta `JWT_SECRET` minimal 32 karakter. Test membuat akun dan data sementara dengan nama unik, lalu menghapusnya setelah selesai.

## Jalankan API
```bash
npm run dev
```

API tersedia pada `http://localhost:5000`.

## Endpoint
| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/health` | Publik |
| POST | `/api/auth/register` | Publik |
| POST | `/api/auth/login` | Publik |
| GET / PUT | `/api/auth/profile` | Login |
| GET | `/api/destinations` | Publik |
| GET | `/api/destinations/:id` | Publik |
| POST / PUT / DELETE | `/api/destinations/:id` | Admin |
| GET | `/api/categories` | Publik |
| GET | `/api/categories/:id/destinations` | Publik |
| POST / PUT / DELETE | `/api/categories/:id` | Admin |
| GET | `/api/reviews/:destinationId` | Publik |
| GET | `/api/reviews/mine` | Login |
| POST / PUT / DELETE | `/api/reviews` | Login (admin dapat moderasi) |
| GET / POST / DELETE | `/api/favorites` | Login |
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/destinations` | Admin |
| GET / DELETE | `/api/admin/reviews` | Admin |

Daftar destinasi menerima query `search`, `category_id`, `district`, `min_price`, `max_price`, `sort` (`newest`, `rating`, `popular`, `name`), `page`, dan `limit`.

Rating adalah rata-rata dari ulasan pengguna. Setiap pengguna hanya dapat memberi satu ulasan per destinasi. Pendaftaran publik hanya menghasilkan role `user`.

## Keamanan dan batasan MVP
- Endpoint CRUD destinasi/kategori dan dashboard admin dilindungi role admin.
- Password disimpan dengan bcrypt; token diverifikasi melalui JWT.
- API memakai Helmet, CORS allowlist, dan rate limit login/register.
- Gambar menggunakan URL pada MVP; upload file Multer belum diaktifkan.
- Gunakan HTTPS dan secret kuat pada deployment produksi.
