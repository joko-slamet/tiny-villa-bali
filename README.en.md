# Tiny Villa Bali — Setup Guide

This guide walks you through everything from start to finish — from getting the source code to having your website live with a custom domain. Follow each step in order.

Services used:
- **GitHub** — source code storage
- **Supabase** — database and photo storage
- **Resend** — contact form email delivery
- **Vercel** — website hosting
- **Hostinger** — domain

---

## Step 1 — Get the Source Code into Your GitHub Account

First, you need to copy the website's source code into your own GitHub account so you can manage it independently.

1. Sign up or log in at [github.com](https://github.com)
2. Go to [github.com/new/import](https://github.com/new/import)
3. In the **"Your old repository's clone URL"** field, enter the following URL:
   ```
   https://github.com/joko-slamet/tiny-villa-bali
   ```
4. In the **"Repository name"** field, give it a name such as `tiny-villa-bali`
5. Select **Private** so the code is not visible to the public
6. Click **Begin Import**

GitHub will handle the import automatically. Once done, the entire source code will be under your GitHub account — no developer assistance needed.

---

## Step 2 — Set Up Supabase (Database & Photo Storage)

Supabase stores your property data and all the photos displayed on the website.

### Create an Account and Project

1. Sign up at [supabase.com](https://supabase.com) and create a new project
2. Choose the nearest region (e.g. Singapore) and save your database password
3. Once the project is ready, go to **Project Settings → API**
4. Copy the following three values — you will need them later:
   - **Project URL** → save as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → save as `SUPABASE_SERVICE_ROLE_KEY`

> Keep the `service_role` key confidential. It grants full access to your database and must never be shared.

### Create the Database Tables

Open the **SQL Editor** in the Supabase sidebar, then copy and run the following query:

```sql
-- Property data table
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

-- Hero section slides table
create table public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  src         text,
  title       text,
  bg          text,
  created_at  timestamptz default now()
);
```

### Create Photo Storage Buckets

1. Open the **Storage** menu in the Supabase sidebar
2. Click **New bucket** and create the following two buckets:

| Bucket name | Access |
|---|---|
| `project-images` | Public |
| `hero-images` | Public |

3. For each bucket, go to **Policies → New Policy** and add the three policies below (replace the bucket name accordingly):

```sql
-- Allow admin to upload photos
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images');

-- Allow public to view photos
create policy "Public can read"
on storage.objects for select
to public
using (bucket_id = 'project-images');

-- Allow admin to delete photos
create policy "Authenticated users can delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images');
```

Repeat all three policies for the `hero-images` bucket.

---

## Step 3 — Set Up Resend (Email)

Resend ensures that messages submitted through the contact form on your website are delivered to your email.

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys → Create API Key**
3. Copy the generated key → save as `RESEND_API_KEY`

---

## Step 4 — Configure Environment Variables *(optional — only if running locally)*

All the keys collected from the previous steps are placed into a single configuration file.

Create a file named `.env.local` in the project folder and fill it in with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
```

> The `.env.local` file is private and will not be uploaded to GitHub automatically.

---

## Step 5 — Run the Website Locally *(optional — only if running locally)*

To verify everything works before going live, you can run the website on your own computer first.

Make sure [Node.js](https://nodejs.org) version 18 or higher is installed, then run:

```bash
git clone https://github.com/your-username/tiny-villa-bali.git
cd tiny-villa-bali
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If the website loads, your configuration is correct.

---

## Step 6 — Deploy to Vercel (Publish the Website)

Vercel is the hosting service that makes your website accessible online.

1. Sign up or log in at [vercel.com](https://vercel.com)
2. Click **Add New → Project** → select **Import Git Repository**
3. Connect your GitHub account and select the `tiny-villa-bali` repository
4. Before clicking Deploy, scroll down to the **Environment Variables** section. Add each configuration variable one by one:
   - Click the **Name** field → type the variable name (e.g. `NEXT_PUBLIC_SUPABASE_URL`)
   - Click the **Value** field → paste the value you copied from Supabase or Resend
   - Click **Add** to save it, then repeat for the next variable
   - Make sure all four variables are filled in:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `RESEND_API_KEY`
5. Once all variables are in place, click **Deploy**

Your website will be live within minutes. Every time you push changes to GitHub, Vercel will automatically update the website.

---

## Step 7 — Connect Your Domain from Hostinger

Once the website is live, the final step is connecting your domain so it can be accessed through your own web address.

### In Vercel

1. Open your project in the Vercel dashboard
2. Go to **Settings → Domains**
3. Type your domain name (e.g. `tinyvillabali.com`) → click **Add**
4. Vercel will show you two DNS records that need to be added in Hostinger

### In Hostinger

1. Log in at [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Select your domain → click **Manage** → open **DNS / Nameservers**
3. Under **DNS Records**, add the following two entries:

| Type | Name | Content | TTL |
|------|------|---------|-----|
| `A` | `@` | `76.76.21.21` | Automatic |
| `CNAME` | `www` | `cname.vercel-dns.com` | Automatic |

4. Save the changes

> DNS changes typically take effect within **15–30 minutes**, but may take up to 24 hours. Once active, Vercel will automatically install an SSL/HTTPS certificate for your domain — no additional steps required on your end.
