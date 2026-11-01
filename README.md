# 🍗 Warung Pak No

Website pemesanan online untuk Warung Pak No — Ayam Kremes & Penyetan.

## Tech Stack
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (free plan)

---

## Setup & Deploy

### 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di Supabase Dashboard
3. Jalankan seluruh isi file `supabase-schema.sql`
4. Catat **Project URL** dan **anon key** dari **Settings → API**

### 2. Konfigurasi Environment Variables

Edit file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890   # Nomor WhatsApp warung (pakai 62, tanpa +)
```

> Untuk `SUPABASE_SERVICE_ROLE_KEY` (opsional, untuk write lebih aman):
> Tambahkan juga `SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...` dari Settings → API → service_role key

### 3. Jalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

### 4. Deploy ke Vercel

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Klik Deploy!

---

## Penggunaan

### Halaman Publik (Pengunjung)
- URL: `https://warungpakno.vercel.app/`
- Melihat menu kremesan dan penyetan
- Tambah ke keranjang → checkout → isi nama & jam kedatangan → kirim otomatis ke WhatsApp warung

### Halaman Admin
- URL: `https://warungpakno.vercel.app/login`
- Login default: **username:** `admin` | **password:** `admin123`
- ⚠️ **Ganti password** setelah login pertama (ubah langsung di tabel `admin_users` di Supabase)
- Fitur admin: edit nama menu, deskripsi, harga, gambar, dan show/hide menu

---

## Struktur Folder

```
warungpakno/
├── app/
│   ├── page.tsx              # Halaman utama (menu publik)
│   ├── checkout/             # Halaman keranjang & checkout
│   ├── login/                # Halaman login admin
│   ├── admin/                # Panel admin (protected)
│   └── api/admin/            # API routes untuk admin
├── components/               # Komponen reusable
├── context/                  # CartContext (state keranjang)
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   └── cart.ts               # Logika keranjang (localStorage)
├── public/menu/              # Gambar-gambar menu
├── proxy.ts                  # Route protection (middleware)
└── supabase-schema.sql       # Schema & seed data database
```
