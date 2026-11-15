# TRIPIN — Explore Surabaya

TRIPIN adalah platform discovery pariwisata untuk membantu masyarakat lokal dan wisatawan menemukan destinasi, kuliner, tempat nongkrong, penginapan, sejarah, coworking space, dan hidden gems di Surabaya.

## Technology Stack
- Frontend: React + Vite + JavaScript + Tailwind CSS
- Routing & HTTP: React Router DOM + Axios
- UI utilities: Lucide React + React Hot Toast
- Backend: Node.js + Express REST API
- Authentication: JWT + bcrypt
- Database: MySQL + mysql2

## Struktur
```
Tripin/
├── frontend/            # React client
└── backend/
    ├── src/             # REST API, controllers, models, middleware
    └── database/        # MySQL schema, seeds, migrations
```

## Setup
Ikuti panduan `frontend/README.md` dan `backend/README.md`.

## Data destinasi
Data awal disimpan sebagai draft hingga alamat, harga, jam operasional, koordinat, dan foto diverifikasi. Hanya destinasi yang dipublikasikan admin muncul di API publik.
