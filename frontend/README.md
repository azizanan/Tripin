# TRIPIN Frontend

Frontend TRIPIN dibangun menggunakan React, Vite, JavaScript, Tailwind CSS, React Router DOM, Axios, Lucide React, dan React Hot Toast.

## Persyaratan
- Node.js 20 LTS atau lebih baru
- npm

## Instalasi
```bash
cd frontend
npm install
```

Salin `.env.example` menjadi `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Menjalankan aplikasi
Pastikan backend dan MySQL sudah aktif, kemudian:

```bash
npm run dev
```

Vite berjalan pada http://localhost:5173.

## Build production
```bash
npm run build
npm run preview
```

## Halaman
- `/`: Homepage dan kategori.
- `/explore`: pencarian, filter, sorting, dan pagination.
- `/destinations/:id`: detail, peta Google Maps, rating, dan ulasan.
- `/categories` dan `/categories/:id`: daftar kategori dan destinasi.
- `/login` dan `/register`: autentikasi.
- `/profile`: edit profil, favorit, dan riwayat ulasan.
- `/admin`: dashboard admin untuk statistik, destinasi, kategori, dan moderasi ulasan.

Semua daftar destinasi diambil dari REST API. Data tidak ditanam sebagai mock data pada frontend.
