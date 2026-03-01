# 🎓 Mémoire entre Amis

> *Our university memories, together.*

A private, invite-only photo and video sharing platform for university friends. The admin controls all accounts — friends simply log in and relive the memories.

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
- [Feature Roadmap](#-feature-roadmap)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Security Checklist](#-security-checklist)
- [Claude Agent Prompts](#-claude-agent-prompts)
- [Resources](#-resources)

---

## 📖 Overview

### What this app does
- **Admin (you)** creates and manages all user accounts
- **Friends** log in, browse albums, and only change their own password
- **Photos & videos** are uploaded to Cloudinary and metadata saved in Supabase
- Everything is **free to host** with no expiry

### User Roles
| Role | Permissions |
|---|---|
| `admin` | Create accounts, delete accounts, upload media, create albums, manage everything |
| `member` | View albums, view media, change own password only |

---

## 🧱 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack React, API routes built-in, great DX |
| Language | JavaScript (ES2022) | No extra TypeScript complexity for this scale |
| Styling | Tailwind CSS | Fast, utility-first, responsive out of the box |
| Auth & Database | Supabase | Free, Postgres, built-in auth, Row Level Security |
| Media Storage | Cloudinary | 25GB free, auto image/video optimization |
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
  ├── /app/(main)/*         → Protected pages (dashboard, albums)
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

> **Why monorepo?** Next.js API routes run server-side on Vercel — they are your backend. A separate Express server would add complexity and require a second deployment. For this project scale, monorepo is the industry-standard choice.

---

## 🗂️ Project Structure

```
memoire-entre-amis/
│
├── app/                                  # Next.js App Router
│   │
│   ├── (auth)/                           # Public route group (no layout)
│   │   ├── login/
│   │   │   └── page.jsx                  # Login page
│   │   └── layout.jsx                    # Auth layout (centered card)
│   │
│   ├── (main)/                           # Protected route group
│   │   ├── layout.jsx                    # Main layout (navbar + sidebar)
│   │   ├── dashboard/
│   │   │   └── page.jsx                  # Recent memories feed
│   │   ├── albums/
│   │   │   ├── page.jsx                  # All albums grid
│   │   │   └── [id]/
│   │   │       └── page.jsx              # Single album media grid
│   │   ├── upload/
│   │   │   └── page.jsx                  # Upload media (admin only)
│   │   ├── admin/
│   │   │   └── page.jsx                  # Manage users (admin only)
│   │   └── settings/
│   │       └── page.jsx                  # Change password (all users)
│   │
│   ├── api/                              # Server-side API routes (backend)
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.js              # Supabase OAuth callback handler
│   │   ├── admin/
│   │   │   ├── create-user/
│   │   │   │   └── route.js              # POST: create new user account
│   │   │   └── delete-user/
│   │   │       └── route.js              # DELETE: remove user account
│   │   └── upload/
│   │       ├── sign/
│   │       │   └── route.js              # POST: generate signed Cloudinary upload URL
│   │       └── save/
│   │           └── route.js              # POST: save media metadata to Supabase
│   │
│   ├── layout.jsx                        # Root layout (fonts, providers)
│   └── globals.css                       # Global styles + Tailwind directives
│
├── components/                           # Reusable UI components
│   ├── ui/                               # Base UI primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   └── Spinner.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── PageHeader.jsx
│   ├── albums/
│   │   ├── AlbumCard.jsx                 # Album thumbnail card
│   │   ├── AlbumGrid.jsx                 # Grid of album cards
│   │   └── CreateAlbumModal.jsx          # Admin: create album form
│   ├── media/
│   │   ├── MediaGrid.jsx                 # Masonry/grid of photos+videos
│   │   ├── PhotoCard.jsx                 # Individual photo card
│   │   ├── VideoCard.jsx                 # Individual video card with thumbnail
│   │   ├── Lightbox.jsx                  # Full-screen photo viewer
│   │   └── VideoPlayer.jsx              # Full-screen video player
│   ├── upload/
│   │   ├── UploadForm.jsx                # Drag & drop upload form
│   │   └── UploadProgress.jsx            # Upload progress bar
│   └── admin/
│       ├── UserTable.jsx                 # List of all users
│       ├── CreateUserModal.jsx           # Create user form
│       └── DeleteUserButton.jsx          # Delete user with confirmation
│
├── lib/                                  # Utilities and config (non-component)
│   ├── supabase/
│   │   ├── client.js                     # Supabase browser client
│   │   ├── server.js                     # Supabase server client (API routes)
│   │   └── admin.js                      # Supabase admin client (service_role)
│   ├── cloudinary.js                     # Cloudinary SDK config
│   ├── auth.js                           # Auth helper functions
│   └── utils.js                          # General utility functions
│
├── hooks/                                # Custom React hooks
│   ├── useAuth.js                        # Current user + role
│   ├── useAlbums.js                      # Fetch albums from Supabase
│   └── useMedia.js                       # Fetch media from Supabase
│
├── middleware.js                         # Route protection (auth + role check)
│
├── public/                               # Static assets
│   ├── logo.svg
│   └── favicon.ico
│
├── .env.local                            # Local environment variables (never commit)
├── .env.example                          # Template env file (safe to commit)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── jsconfig.json                         # Path aliases (@/components, @/lib, etc.)
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

---

## 🔌 API Routes

All API routes live in `app/api/` and run **server-side only**. They are the secure bridge between the frontend and Supabase/Cloudinary using secret keys.

### Auth

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/auth/callback` | Supabase login redirect handler | No |

### Admin (admin role only)

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/api/admin/create-user` | `{ full_name, username, email, password, role }` | Create a new user account |
| `DELETE` | `/api/admin/delete-user` | `{ user_id }` | Delete a user and their profile |

### Upload

| Method | Route | Body | Description |
|---|---|---|---|
| `POST` | `/api/upload/sign` | `{ folder, media_type }` | Returns a signed Cloudinary upload signature |
| `POST` | `/api/upload/save` | `{ album_id, cloudinary_url, cloudinary_public_id, media_type, ... }` | Save media metadata to Supabase after upload |

### Response Format (all routes follow this standard)

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Human readable error message" }
```

---

## 🔑 Environment Variables

### `.env.example` (commit this to GitHub)

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

> ⚠️ Variables marked are **secret** — only ever use them in `app/api/` routes, never in client components or pages.

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

### Media Folder Structure on Cloudinary

```
memoire/
├── photos/
│   ├── {album_id}/
│   │   ├── photo_abc123.jpg
│   │   └── photo_def456.webp
└── videos/
    └── {album_id}/
        └── video_ghi789.mp4
```

---

## 🔐 Authentication & Roles

### Login Flow
```
User visits /login
     ↓
Enters email + password
     ↓
Supabase validates credentials
     ↓
Session cookie set by middleware
     ↓
Redirect to /dashboard
```

### Admin Creates a User
```
Admin visits /admin
     ↓
Fills form: name, username, email, temp password
     ↓
POST /api/admin/create-user
     ↓
Server uses SUPABASE_SERVICE_ROLE_KEY to create auth user
     ↓
Trigger auto-creates profile row with role = 'member'
     ↓
Friend receives credentials and logs in
     ↓
Friend changes password at /settings
```

### Middleware Route Protection (`middleware.js`)

```
/login              → public (redirect to /dashboard if already logged in)
/api/auth/callback  → public
/dashboard          → requires: authenticated
/albums/*           → requires: authenticated
/settings           → requires: authenticated
/upload             → requires: authenticated + role = 'admin'
/admin              → requires: authenticated + role = 'admin'
/api/admin/*        → requires: authenticated + role = 'admin'
/api/upload/*       → requires: authenticated + role = 'admin'
```

---

## ✅ Feature Roadmap

### Phase 1 — Project Setup
- [ ] Initialize Next.js project with Tailwind CSS
- [ ] Configure `jsconfig.json` path aliases (`@/components`, `@/lib`)
- [ ] Set up Supabase clients (`client.js`, `server.js`, `admin.js`)
- [ ] Configure Cloudinary SDK (`lib/cloudinary.js`)
- [ ] Create `.env.local` from `.env.example`
- [ ] Run database SQL schema in Supabase
- [ ] Manually create admin account in Supabase dashboard

### Phase 2 — Auth & Middleware
- [ ] Build login page (`/login`)
- [ ] Build `middleware.js` for route + role protection
- [ ] Build `/api/auth/callback` route
- [ ] Build `useAuth` hook

### Phase 3 — Admin Panel
- [ ] Build `/admin` page with user table
- [ ] Build `CreateUserModal` component
- [ ] Build `/api/admin/create-user` route
- [ ] Build `/api/admin/delete-user` route
- [ ] Build `DeleteUserButton` with confirmation dialog

### Phase 4 — Albums
- [ ] Build `/albums` page with album grid
- [ ] Build `AlbumCard` component
- [ ] Build `CreateAlbumModal` (admin only)
- [ ] Build `/albums/[id]` single album page

### Phase 5 — Media Upload
- [ ] Build `/upload` page (admin only)
- [ ] Build `UploadForm` with drag & drop
- [ ] Build `/api/upload/sign` route (Cloudinary signature)
- [ ] Build `/api/upload/save` route (save metadata)
- [ ] Build `UploadProgress` component

### Phase 6 — Media Browsing
- [ ] Build `MediaGrid` component
- [ ] Build `PhotoCard` component
- [ ] Build `VideoCard` with thumbnail
- [ ] Build `Lightbox` for full-screen photo viewing
- [ ] Build `VideoPlayer` for full-screen playback

### Phase 7 — Settings
- [ ] Build `/settings` page
- [ ] Change password form using `supabase.auth.updateUser()`

### Phase 8 — Polish
- [ ] Mobile responsive design (all pages)
- [ ] Loading skeletons for all data-fetching components
- [ ] Toast notifications for all actions
- [ ] Error boundary components
- [ ] Empty states (no albums yet, no media yet)
- [ ] Album cover photo (first photo in album auto-set as cover)

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/your-username/memoire-entre-amis.git
cd memoire-entre-amis

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# 4. Run the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Required npm Packages

```bash
# Core
npx create-next-app@latest memoire-entre-amis --tailwind --app --src-dir=false --import-alias "@/*"

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Cloudinary
npm install cloudinary next-cloudinary

# UI Utilities
npm install react-hot-toast
npm install date-fns
npm install clsx

# Optional UI Components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-alert-dialog
```

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub (`git push origin main`)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
3. Add all environment variables from `.env.local` in Vercel's **Environment Variables** settings
4. Click **Deploy**
5. After deploy, copy your Vercel URL and update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
6. Every `git push` to `main` will auto-deploy

---

## 🛡️ Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` only used in `app/api/` — never imported in components or pages
- [ ] `CLOUDINARY_API_SECRET` only used in `app/api/upload/sign/route.js`
- [ ] All Supabase tables have RLS enabled with correct policies
- [ ] `middleware.js` protects all admin routes both by auth and by role
- [ ] Admin role is also verified server-side in every `/api/admin/*` route (don't trust client alone)
- [ ] Cloudinary upload presets are **Signed** (not unsigned)
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys or secrets hardcoded anywhere in source code
- [ ] `NEXT_PUBLIC_*` variables contain no secrets (they are visible to browser)

---

## 🤖 Claude Agent Prompts

Use these prompts when working with Claude agent mode. Always share this README first.

```
"Read the README and set up the Supabase clients in lib/supabase/client.js,
lib/supabase/server.js, and lib/supabase/admin.js using the SSR package."
```

```
"Build the login page at app/(auth)/login/page.jsx using Supabase email/password auth.
On success redirect to /dashboard."
```

```
"Create middleware.js that protects routes based on the auth and role rules
defined in the README's middleware section."
```

```
"Build the /api/admin/create-user route using the Supabase admin client to
create a new user with full_name, username, email, password, and role from the request body."
```

```
"Build the /api/upload/sign route that generates a signed Cloudinary upload
signature using the folder and media_type from the request body."
```

```
"Build the UploadForm component with drag-and-drop support that calls
/api/upload/sign to get a signature, uploads directly to Cloudinary,
then calls /api/upload/save to store the metadata."
```

```
"Build the /albums/[id]/page.jsx that fetches all media for the album
from Supabase and renders them in a responsive grid using MediaGrid component."
```

```
"Build the Lightbox component that shows full-size photos with prev/next
navigation when a PhotoCard is clicked."
```

---

## 📚 Resources

| Resource | Link |
|---|---|
| Next.js App Router | https://nextjs.org/docs/app |
| Supabase + Next.js Guide | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Supabase RLS Guide | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Cloudinary Next.js SDK | https://next.cloudinary.dev |
| Cloudinary Signed Uploads | https://cloudinary.com/documentation/upload_images#signed_upload |
| Tailwind CSS Docs | https://tailwindcss.com/docs |
| Vercel Deployment | https://vercel.com/docs/deployments/overview |

---

## 📄 License

Private project — not open source. All memories belong to their respective owners. 🎓

---

*Built with ❤️ to preserve university memories forever — Mémoire entre Amis*
