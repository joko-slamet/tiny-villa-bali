# Tiny Villa Bali — Panduan Setup

Dokumen ini memandu Anda dari nol hingga website Tiny Villa Bali berjalan secara online dengan domain sendiri. Ikuti setiap langkah secara berurutan.

Layanan yang digunakan:
- **GitHub** — penyimpanan source code
- **Supabase** — database dan penyimpanan foto
- **Resend** — pengiriman email dari form kontak
- **Vercel** — hosting website
- **Hostinger** — domain

---

## Langkah 1 — Ambil Source Code ke Akun GitHub Anda

Pertama, Anda perlu menyalin source code website ke akun GitHub pribadi Anda agar bisa dikelola secara mandiri.

1. Daftar atau login di [github.com](https://github.com)
2. Buka halaman [github.com/new/import](https://github.com/new/import)
3. Di kolom **"Your old repository's clone URL"**, masukkan URL repo berikut:
   ```
   https://github.com/joko-slamet/tiny-villa-bali
   ```
4. Di kolom **"Repository name"**, beri nama misalnya `tiny-villa-bali`
5. Pilih **Private** agar kode tidak bisa dilihat publik
6. Klik **Begin Import**

GitHub akan memproses impor secara otomatis. Setelah selesai, seluruh source code sudah berada di bawah kepemilikan akun GitHub Anda — tanpa perlu bantuan developer.

---

## Langkah 2 — Setup Supabase (Database & Penyimpanan Foto)

Supabase digunakan untuk menyimpan data properti dan foto-foto yang ditampilkan di website.

### Buat Akun dan Project

1. Daftar di [supabase.com](https://supabase.com) lalu buat project baru
2. Pilih region terdekat (misalnya Singapore) dan catat password database Anda
3. Setelah project siap, buka **Project Settings → API**
4. Salin tiga nilai berikut — akan digunakan nanti:
   - **Project URL** → simpan sebagai `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** → simpan sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → simpan sebagai `SUPABASE_SERVICE_ROLE_KEY`

> Jaga kerahasiaan `service_role` key. Key ini memberi akses penuh ke database dan tidak boleh dibagikan.

### Buat Tabel Database

Buka **SQL Editor** di sidebar Supabase, lalu salin dan jalankan query berikut:

```sql
-- Tabel data properti
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  slug        text unique,
  location    text,
  region      text,
  status      text,
  units       int,
  available   int,
  featured    boolean default false,
  src         text,
  "order"     int,
  created_at  timestamptz default now()
);

-- Tabel slide untuk tampilan utama website
create table public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  src         text,
  title       text,
  bg          text,
  created_at  timestamptz default now()
);
```

### Buat Tempat Penyimpanan Foto

1. Buka menu **Storage** di sidebar Supabase
2. Buat dua bucket berikut dengan menekan **New bucket**:

| Nama bucket | Akses |
|---|---|
| `project-images` | Public |
| `hero-images` | Public |

3. Untuk setiap bucket, buka **Policies → New Policy** dan tambahkan tiga policy berikut (ganti nama bucket sesuai):

```sql
-- Izinkan admin mengupload foto
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images');

-- Izinkan publik melihat foto
create policy "Public can read"
on storage.objects for select
to public
using (bucket_id = 'project-images');

-- Izinkan admin menghapus foto
create policy "Authenticated users can delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images');
```

Ulangi ketiga policy di atas untuk bucket `hero-images`.

---

## Langkah 3 — Setup Resend (Email)

Resend digunakan agar pesan dari form kontak di website masuk ke email Anda.

### Buat API Key

1. Daftar di [resend.com](https://resend.com)
2. Masuk ke **API Keys → Create API Key**
3. Salin key yang muncul → simpan sebagai `RESEND_API_KEY`

> Untuk saat ini cukup sampai di sini. **Jangan verifikasi domain dulu** — langkah tersebut baru bisa dilakukan setelah domain terhubung ke Vercel, yaitu di **Langkah 8**.

---

## Langkah 4 — Isi Konfigurasi / Environment Variables *(opsional — hanya jika ingin menjalankan di komputer lokal)*

Semua key yang sudah dikumpulkan dari langkah sebelumnya dimasukkan ke dalam satu file konfigurasi.

Buat file bernama `.env.local` di folder project, lalu isi dengan nilai Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
```

> File `.env.local` bersifat rahasia dan tidak akan terupload ke GitHub secara otomatis.

---

## Langkah 5 — Jalankan Website di Komputer Lokal *(opsional — hanya jika ingin menjalankan di komputer lokal)*

Untuk memastikan semuanya berjalan sebelum dipublikasikan, coba jalankan di komputer terlebih dahulu.

Pastikan [Node.js](https://nodejs.org) versi 18 ke atas sudah terinstal, lalu jalankan:

```bash
git clone https://github.com/username-anda/tiny-villa-bali.git
cd tiny-villa-bali
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Jika website tampil, berarti konfigurasi sudah benar.

---

## Langkah 6 — Deploy ke Vercel (Publikasikan Website)

Vercel adalah layanan hosting yang akan membuat website Anda bisa diakses secara online.

1. Daftar atau login di [vercel.com](https://vercel.com)
2. Klik **Add New → Project** → pilih **Import Git Repository**
3. Hubungkan akun GitHub Anda dan pilih repository `tiny-villa-bali`
4. Sebelum menekan Deploy, scroll ke bawah hingga menemukan bagian **Environment Variables**. Di sini Anda perlu menambahkan keempat variabel konfigurasi satu per satu:
   - Klik kolom **Name** → ketik nama variabelnya (contoh: `NEXT_PUBLIC_SUPABASE_URL`)
   - Klik kolom **Value** → tempel nilai yang sudah Anda salin dari Supabase atau Resend
   - Klik **Add** untuk menyimpan, lalu ulangi untuk variabel berikutnya
   - Lakukan hingga keempat variabel berikut terisi semua:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `RESEND_API_KEY`
5. Setelah semua variabel terisi, klik **Deploy**

Website akan online dalam beberapa menit. Setiap kali Anda melakukan perubahan dan push ke GitHub, Vercel akan otomatis memperbarui website.

---

## Langkah 7 — Hubungkan Domain dari Hostinger

Setelah website online, langkah terakhir adalah menghubungkan domain Anda agar bisa diakses melalui alamat yang Anda miliki.

### Di Vercel

1. Buka project Anda di Vercel dashboard
2. Pergi ke **Settings → Domains**
3. Ketik nama domain Anda (contoh: `tinyvillabali.com`) → klik **Add**
4. Vercel akan menampilkan dua record DNS yang perlu ditambahkan di Hostinger

### Di Hostinger

1. Login ke [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Pilih domain Anda → klik **Kelola** → buka **DNS / Nameservers**
3. Di bagian **DNS Records**, tambahkan dua baris berikut:

| Tipe | Nama | Konten | TTL |
|------|------|--------|-----|
| `A` | `@` | `76.76.21.21` | Otomatis |
| `CNAME` | `www` | `cname.vercel-dns.com` | Otomatis |

4. Simpan perubahan

> Setelah disimpan, perubahan DNS biasanya aktif dalam **15–30 menit**, namun bisa memakan waktu hingga 24 jam. Setelah aktif, sertifikat keamanan (SSL/HTTPS) akan dipasang otomatis oleh Vercel — tidak ada langkah tambahan dari Anda.

---

## Langkah 8 — Verifikasi Domain di Resend

Setelah domain terhubung ke Vercel, lakukan verifikasi domain di Resend agar email dari form kontak terkirim dari domain Anda sendiri dan tidak masuk folder spam.

1. Di dashboard Resend, buka **Domains → Add Domain**
2. Masukkan nama domain Anda (contoh: `tinyvillabali.com`) → klik **Add**
3. Resend akan mendeteksi domain terhubung ke Vercel dan menawarkan verifikasi otomatis — ikuti klik yang muncul hingga selesai
4. Status domain akan berubah menjadi **Verified**
