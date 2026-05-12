# Animate Mbuchacher

Website portofolio dengan animasi berbasis Next.js, Supabase, dan Resend.

## Prasyarat

- Node.js 18+
- Akun [Supabase](https://supabase.com)
- Akun [Resend](https://resend.com)
- Akun [Vercel](https://vercel.com) (untuk deployment)

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd animate-mbuchacher2
npm install
```

---

## 2. Setup Supabase

1. Buat project baru di [supabase.com/dashboard](https://supabase.com/dashboard)
2. Setelah project dibuat, buka **Project Settings → API**
3. Salin nilai berikut:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

> `service_role` key bersifat rahasia — jangan pernah diekspos ke sisi client.

### Setup Database

Buka **SQL Editor** di Supabase dashboard dan jalankan query berikut:

```sql
-- Tabel untuk data project/properti
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

-- Tabel untuk slide di hero section halaman utama
create table public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  src         text,
  title       text,
  bg          text,
  created_at  timestamptz default now()
);
```

### Setup Storage Bucket

Masih di Supabase dashboard, buka **Storage** dan buat dua bucket berikut:

| Nama bucket | Public |
|---|---|
| `project-images` | ✅ Ya |
| `hero-images` | ✅ Ya |

Untuk setiap bucket, tambahkan policy agar file bisa diupload dari admin:

1. Klik bucket → **Policies → New Policy**
2. Pilih template **"Give users access to a folder only to authenticated users"** atau buat manual:

```sql
-- Contoh policy untuk project-images (ulangi untuk hero-images)
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images');

create policy "Public can read"
on storage.objects for select
to public
using (bucket_id = 'project-images');

create policy "Authenticated users can delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images');
```

---

## 3. Setup Resend

1. Daftar atau login di [resend.com](https://resend.com)
2. Buka **API Keys → Create API Key**
3. Salin key yang dihasilkan → `RESEND_API_KEY`

---

## 4. Environment Variables

Salin file contoh lalu isi dengan nilai dari langkah di atas:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
```

---

## 5. Jalankan Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 6. Deploy ke Vercel

1. Push repository ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) dan import repository
3. Di bagian **Environment Variables**, tambahkan keempat variabel yang sama seperti `.env.local`
4. Klik **Deploy**

Vercel akan otomatis melakukan deploy ulang setiap kali ada push ke branch utama.

---

## 7. Setup Custom Domain (Hostinger → Vercel)

### Di Vercel

1. Buka project di Vercel dashboard
2. Pergi ke **Settings → Domains**
3. Masukkan domain kamu (contoh: `namadomain.com`) → klik **Add**
4. Vercel akan menampilkan dua record DNS yang perlu ditambahkan:
   - Sebuah **A record** yang mengarah ke IP Vercel (`76.76.21.21`)
   - Sebuah **CNAME record** untuk subdomain `www` yang mengarah ke `cname.vercel-dns.com`

### Di Hostinger

1. Login ke [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Pilih domain kamu → **Kelola** → **DNS / Nameservers**
3. Tambahkan dua record berikut di bagian **DNS Records**:

| Tipe | Nama | Konten | TTL |
|------|------|--------|-----|
| `A` | `@` | `76.76.21.21` | Otomatis |
| `CNAME` | `www` | `cname.vercel-dns.com` | Otomatis |

4. Simpan perubahan

> Propagasi DNS biasanya memakan waktu **5–30 menit**, namun bisa sampai 24 jam. Setelah aktif, Vercel akan otomatis menerbitkan SSL certificate untuk domain kamu.
