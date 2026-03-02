# 🎓 Mémoire entre Amis

> *Our university memories, together.*

A private, invite-only photo and video sharing platform for university friends. The admin controls all accounts — friends simply log in, upload memories, and relive them together.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Routes](#-api-routes)
- [Environment Variables](#-environment-variables)
- [Cloudinary Setup](#-cloudinary-setup)
- [Authentication & Roles](#-authentication--roles)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Security Checklist](#-security-checklist)
- [Resources](#-resources)

---

## 📖 Overview

### What this app does
- **Admin (you)** creates and manages all user accounts, albums, and has full control
- **Friends** log in, browse albums, upload photos & videos, and change their own password
- **Photos** are auto-compressed client-side before upload (max 2400px, JPEG 85%)
- **Videos** must be under 10MB (Cloudinary free plan limit — cannot be compressed client-side)
- **Media** is uploaded to Cloudinary and metadata saved in Supabase
- Everything is **free to host** with no expiry

### User Roles
| Role | Permissions |
|---|---|
| `admin` | Create/delete accounts, create/edit/delete albums, upload media, delete any media, manage everything |
| `member` | View albums, upload photos & videos, change own password |

---

## 🧱 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Full-stack React, API routes built-in, great DX |
| Language | TypeScript | Type safety, better IDE support, catch errors early |
| Styling | Tailwind CSS v4 | Fast, utility-first, responsive out of the box |
| Auth & Database | Supabase | Free, Postgres, built-in auth, Row Level Security |
| Media Storage | Cloudinary | 25GB free, auto image/video optimization |
| UI Components | Radix UI | Accessible dialogs, dropdowns, alert dialogs |
| Hosting | Vercel | Free, auto-deploy from GitHub, edge network |
| Version Control | GitHub | Industry standard |

---

## 🏗️ Architecture

```
Browser (Client)
      │
      ▼
Next.js on Vercel
  ├── /app/(auth)/*         → Public pages (login)
  ├── /app/(main)/*         → Protected pages (dashboard, albums, upload, settings, admin)
  └── /app/api/*            → Server-side API routes
            │
            ├──────────────────────────┐
            ▼                          ▼
       Supabase                   Cloudinary
  (Auth + PostgreSQL DB)      (Photo & Video Storage)
  - User accounts             - Original media files
  - Profiles                  - Auto-generated thumbnails
  - Albums metadata           - Video streaming
  - Media metadata            - Image optimization
```

---

## 🗂️ Project Structure

```
memoire-entre-amis/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                  # Login page
│   │
│   ├── (main)/
│   │   ├── layout.tsx                    # Main layout (navbar + sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Recent memories feed + stats
│   │   ├── albums/
│   │   │   ├── page.tsx                  # All albums grid with previews
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Single album media grid
│   │   ├── upload/
│   │   │   └── page.tsx                  # Upload media (all users)
│   │   ├── admin/
│   │   │   └── page.tsx                  # User & album management (admin only)
│   │   └── settings/
│   │       └── page.tsx                  # Profile & password settings
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts              # Supabase OAuth callback handler
│   │   ├── admin/
│   │   │   ├── create-user/
│   │   │   │   └── route.ts              # POST: create new user account
│   │   │   └── delete-user/
│   │   │       └── route.ts              # DELETE: remove user account
│   │   ├── albums/
│   │   │   ├── route.ts                  # POST: create album
│   │   │   └── [id]/
│   │   │       └── route.ts              # PATCH: edit album, DELETE: delete album
│   │   ├── media/
│   │   │   └── [id]/
│   │   │       └── route.ts              # DELETE: delete media (admin only)
│   │   └── upload/
│   │       ├── sign/
│   │       │   └── route.ts              # POST: Cloudinary upload signature
│   │       └── save/
│   │           └── route.ts              # POST: save media metadata
│   │
│   ├── layout.tsx                        # Root layout (fonts, providers)
│   ├── page.tsx                          # Landing page
│   └── globals.css                       # Design system + Tailwind directives
│
├── components/
│   ├── ui/
│   │   └── BackButton.tsx                # Reusable back navigation
│   ├── layout/
│   │   ├── Navbar.tsx                    # Top navigation bar
│   │   └── Sidebar.tsx                   # Side nav + mobile bottom tabs
│   ├── albums/
│   │   ├── AlbumCard.tsx                 # Album card with photo preview collage
│   │   ├── AlbumGrid.tsx                 # Grid of album cards
│   │   ├── CreateAlbumModal.tsx          # Create album dialog
│   │   └── EditAlbumModal.tsx            # Edit album dialog
│   ├── media/
│   │   ├── MediaGrid.tsx                 # Masonry grid of photos + videos
│   │   ├── PhotoCard.tsx                 # Photo card with admin delete
│   │   ├── VideoCard.tsx                 # Video card with admin delete
│   │   └── Lightbox.tsx                  # Full-screen photo viewer
│   ├── upload/
│   │   └── UploadForm.tsx                # File upload with compression
│   └── admin/
│       ├── UserTable.tsx                 # User management table
│       ├── CreateUserModal.tsx           # Create user dialog
│       └── AlbumTable.tsx                # Album management table
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Supabase browser client
│   │   ├── server.ts                     # Supabase server client (SSR)
│   │   └── admin.ts                      # Supabase admin client (service_role)
│   ├── cloudinary.ts                     # Cloudinary SDK config
│   └── auth.ts                           # Auth helper functions
│
├── middleware.ts                         # Route protection (auth + role check)
├── .env.local                            # Environment variables (never commit)
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 🗄️ Database Schema

Run the following SQL in your **Supabase SQL Editor** (`supabase.com → your project → SQL Editor`):

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null,
  username    text unique not null,
  avatar_url  text,
  role        text not null default 'member'
                check (role in ('admin', 'member')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Albums
create table public.albums (
  id          uuid default uuid_generate_v4() primary key,
  title       text not null,
  description text,
  cover_url   text,
  event_date  date,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Media (photos and videos)
create table public.media (
  id                   uuid default uuid_generate_v4() primary key,
  album_id             uuid references public.albums(id) on delete cascade not null,
  uploader_id          uuid references public.profiles(id) on delete set null,
  cloudinary_url       text not null,
  cloudinary_public_id text not null unique,
  thumbnail_url        text,
  media_type           text not null check (media_type in ('photo', 'video')),
  caption              text,
  width                integer,
  height               integer,
  duration_seconds     integer,       -- for videos
  file_size_bytes      bigint,
  created_at           timestamptz default now()
);

-- ============================================
-- INDEXES (for query performance)
-- ============================================
create index idx_media_album_id    on public.media(album_id);
create index idx_media_media_type  on public.media(media_type);
create index idx_albums_created_by on public.albums(created_by);

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function handle_updated_at();

create trigger albums_updated_at
  before update on public.albums
  for each row execute function handle_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.albums   enable row level security;
alter table public.media    enable row level security;

-- PROFILES policies
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ALBUMS policies
create policy "Authenticated users can view albums"
  on public.albums for select
  using (auth.role() = 'authenticated');

create policy "Admin can insert albums"
  on public.albums for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admin can update albums"
  on public.albums for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admin can delete albums"
  on public.albums for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- MEDIA policies
create policy "Authenticated users can view media"
  on public.media for select
  using (auth.role() = 'authenticated');

create policy "Admin can insert media"
  on public.media for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admin can delete media"
  on public.media for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );
```

> **Note:** Media inserts from non-admin users are handled via the service-role admin client in the API route (auth is verified server-side before inserting).

---

## 🔌 API Routes

All API routes live in `app/api/` and run **server-side only**.

### Auth

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/callback` | Supabase login redirect handler | No |

### Admin (admin role only)

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/api/admin/create-user` | `{ full_name, username, email, password, role }` | Create a new user account |
| `DELETE` | `/api/admin/delete-user` | `{ user_id }` | Delete a user and their profile |

### Albums

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/api/albums` | `{ title, description?, event_date? }` | Create album (admin only) |
| `PATCH` | `/api/albums/[id]` | `{ title?, description?, event_date?, cover_url? }` | Update album (admin only) |
| `DELETE` | `/api/albums/[id]` | — | Delete album + all media (admin only) |

### Media

| Method | Route | Description |
|---|---|---|
| `DELETE` | `/api/media/[id]` | Delete media from Cloudinary + DB (admin only) |

### Upload (all authenticated users)

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/api/upload/sign` | `{ folder, media_type }` | Get signed Cloudinary upload URL |
| `POST` | `/api/upload/save` | `{ album_id, cloudinary_url, ... }` | Save media metadata to Supabase |

---

## 🔑 Environment Variables

### `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Where to find each value

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key ⚠️ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary → Dashboard → Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary → Dashboard → API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary → Dashboard → API Secret ⚠️ |

> ⚠️ Variables marked are **secret** — only use them in `app/api/` routes, never in client components.

---

## ☁️ Cloudinary Setup

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. From your dashboard, copy **Cloud Name**, **API Key**, **API Secret**
3. Go to **Settings → Upload → Upload Presets → Add upload preset**
4. Create preset named `memories_photos`:
   - Signing Mode: **Signed**
   - Folder: `memoire/photos`
   - Allowed formats: `jpg, jpeg, png, webp, gif`
5. Create preset named `memories_videos`:
   - Signing Mode: **Signed**
   - Folder: `memoire/videos`
   - Allowed formats: `mp4, mov, avi, webm`

### Free Plan Limits
- **10MB max file size** per upload
- Photos are auto-compressed client-side (Canvas API, max 2400px, JPEG 85%)
- Videos cannot be compressed client-side — must be under 10MB before upload

---

## 🔐 Authentication & Roles

### Login Flow
```
User visits /login → Enters email + password → Supabase validates →
Session cookie set → Redirect to /dashboard
```

### Admin Creates a User
```
Admin visits /admin → Fills form → POST /api/admin/create-user →
Service role creates auth user → Trigger auto-creates profile →
Friend receives credentials → Logs in → Changes password at /settings
```

### Middleware Route Protection

| Route | Access |
|---|---|
| `/login` | Public (redirects to dashboard if logged in) |
| `/dashboard`, `/albums/*`, `/upload`, `/settings` | Authenticated users |
| `/admin` | Admin only |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/memoire-entre-amis.git
cd memoire-entre-amis

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Cloudinary values

# 4. Run the database schema
# Copy the SQL from the Database Schema section above
# Paste into Supabase SQL Editor and run

# 5. Create your admin account
# In Supabase → Authentication → Users → Add user
# Then update the profile's role to 'admin' in the profiles table

# 6. Start the dev server
npm run dev
# Open http://localhost:3000
```

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
3. Add all environment variables from `.env.local`
4. Click **Deploy**
5. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
6. Every `git push` to `main` will auto-deploy

---

## 🛡️ Security Checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` only used in `app/api/` routes
- [x] `CLOUDINARY_API_SECRET` only used in `app/api/upload/sign`
- [x] All Supabase tables have RLS enabled
- [x] Middleware protects admin routes by auth + role
- [x] Admin role verified server-side in every admin API route
- [x] Cloudinary upload presets are **Signed**
- [x] `.env.local` is in `.gitignore`
- [x] No secrets hardcoded in source code

---

## 📚 Resources

| Resource | Link |
|---|---|
| Next.js App Router | https://nextjs.org/docs/app |
| Supabase + Next.js Guide | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Supabase RLS Guide | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Cloudinary Next.js SDK | https://next.cloudinary.dev |
| Cloudinary Signed Uploads | https://cloudinary.com/documentation/upload_images#signed_upload |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Radix UI | https://www.radix-ui.com/primitives |

---

## 📄 License

Private project — not open source. All memories belong to their respective owners. 🎓

---

*Built with ❤️ to preserve university memories forever — Mémoire entre Amis*
