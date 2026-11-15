# TRIPIN Backend

Backend TRIPIN menggunakan **Node.js + Express** dengan driver **MySQL2** untuk koneksi database.

## Persyaratan
- Node.js versi LTS
- npm
- MySQL Server

## Instalasi
```bash
cd backend
npm install
```

Salin `.env.example` menjadi `.env`, lalu sesuaikan konfigurasi lokal.

## Menjalankan Server
```bash
npm run dev
```

API berjalan di http://localhost:5000. Endpoint pemeriksaan: `GET /api/health`.
