# 🎓 Mémoire entre Amis — Complete Build Guide
### A Senior Engineer's Step-by-Step Walkthrough for Next.js Beginners

---

> **How to use this guide:**
> Read every explanation — don't just copy code. Each section explains *why* we do things a certain way, not just *what* to do. That's how you actually learn Next.js.

---

## 📋 Table of Contents

- [Phase 0 — Tools & Prerequisites](#phase-0--tools--prerequisites)
- [Phase 1 — Project Setup](#phase-1--project-setup)
- [Phase 2 — Supabase Setup](#phase-2--supabase-setup)
- [Phase 3 — Cloudinary Setup](#phase-3--cloudinary-setup)
- [Phase 4 — Project Config & Folder Structure](#phase-4--project-config--folder-structure)
- [Phase 5 — Supabase Client Setup](#phase-5--supabase-client-setup)
- [Phase 6 — Middleware & Route Protection](#phase-6--middleware--route-protection)
- [Phase 7 — Login Page & Auth](#phase-7--login-page--auth)
- [Phase 8 — Layouts & Navigation](#phase-8--layouts--navigation)
- [Phase 9 — Admin Panel (User Management)](#phase-9--admin-panel-user-management)
- [Phase 10 — Albums](#phase-10--albums)
- [Phase 11 — Media Upload](#phase-11--media-upload)
- [Phase 12 — Media Browsing](#phase-12--media-browsing)
- [Phase 13 — Settings (Change Password)](#phase-13--settings-change-password)
- [Phase 14 — Polish & UX](#phase-14--polish--ux)
- [Phase 15 — Deployment](#phase-15--deployment)

---

## Phase 0 — Tools & Prerequisites

### What you need installed

Before writing a single line of code, make sure these are installed on your computer.

**1. Node.js (v18 or higher)**
Node.js is the JavaScript runtime that runs Next.js on your computer.
```bash
# Check if you have it
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
```
Download from: https://nodejs.org (choose LTS version)

**2. Git**
Git tracks your code changes and connects to GitHub.
```bash
git --version   # Should show git version 2.x.x
```
Download from: https://git-scm.com

**3. VS Code (recommended editor)**
Download from: https://code.visualstudio.com

**VS Code Extensions to install:**
- **ES7+ React/Redux/React-Native snippets** — code shortcuts
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **Prettier** — auto-formats your code
- **ESLint** — catches code errors
- **GitLens** — better Git integration

**4. Accounts to create (all free)**
- GitHub: https://github.com
- Supabase: https://supabase.com
- Cloudinary: https://cloudinary.com
- Vercel: https://vercel.com (sign up with GitHub)

---

### 💡 Key Concepts Before We Start

**What is Next.js?**
Next.js is a React framework. React builds UI components. Next.js adds routing, server-side code, API routes, and deployment tools on top of React. Think of it as React + backend in one.

**What is the App Router?**
Next.js 13+ uses the "App Router" — a folder-based routing system. Every folder inside `app/` becomes a URL route. For example:
- `app/dashboard/page.jsx` → `yoursite.com/dashboard`
- `app/albums/[id]/page.jsx` → `yoursite.com/albums/123`

**What is a Server Component vs Client Component?**
This is the most important Next.js concept. By default, all components in the App Router run on the **server** — they fetch data, render HTML, and send it to the browser. No JavaScript runs on the client.

If a component needs interactivity (click handlers, forms, useState), you add `"use client"` at the top. Only then does it run in the browser.

```jsx
// Server Component (default) — runs on server, can fetch data directly
export default async function AlbumsPage() {
  const albums = await fetchAlbums() // direct DB call, safe
  return <div>{albums.map(...)}</div>
}

// Client Component — runs in browser, can use useState/onClick
"use client"
export default function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(true)}>Like</button>
}
```

**Rule of thumb:** Keep components as Server Components unless they need interactivity.

---

## Phase 1 — Project Setup

### Step 1.1 — Create the Next.js project

Open your terminal and run:

```bash
npx create-next-app@latest memoire-entre-amis \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-typescript
```

**What each flag means:**
- `--tailwind` — includes Tailwind CSS setup automatically
- `--app` — uses the App Router (not the old Pages Router)
- `--no-src-dir` — keeps files in root, not inside a `src/` folder
- `--import-alias "@/*"` — lets you write `@/components/Button` instead of `../../components/Button`
- `--no-typescript` — we use JavaScript (simpler for learning)

When it asks questions during setup, answer:
- Would you like to use ESLint? → **Yes**
- Would you like to customize the default import alias? → **No** (already set above)

```bash
# Move into the project folder
cd memoire-entre-amis

# Open in VS Code
code .
```

### Step 1.2 — Install all dependencies

```bash
# Supabase (auth + database)
npm install @supabase/supabase-js @supabase/ssr

# Cloudinary
npm install cloudinary next-cloudinary

# UI helpers
npm install react-hot-toast clsx date-fns

# Radix UI (accessible modal, dropdown components)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-alert-dialog
```

**Why these packages?**
- `@supabase/ssr` — special Supabase package for Next.js that handles cookies correctly
- `clsx` — utility to conditionally join CSS class names: `clsx('base', isActive && 'active')`
- `date-fns` — format dates cleanly: `format(date, 'MMM d, yyyy')`
- `@radix-ui/*` — unstyled, accessible UI components (modals, dropdowns) we style with Tailwind

### Step 1.3 — Initialize Git and push to GitHub

```bash
# Initialize git (already done by create-next-app, but let's verify)
git status

# Go to github.com, create a new repo called "memoire-entre-amis"
# Then connect your local project to it:

git remote add origin https://github.com/YOUR_USERNAME/memoire-entre-amis.git
git branch -M main
git push -u origin main
```

### Step 1.4 — Test that it works

```bash
npm run dev
```

Open http://localhost:3000 — you should see the default Next.js welcome page. 

---

## Phase 2 — Supabase Setup

Supabase is your database AND your auth system. Think of it as Firebase but open-source and built on Postgres.

### Step 2.1 — Create a Supabase project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Choose a name: `memoire-entre-amis`
4. Set a strong database password (save it somewhere safe)
5. Choose the region closest to you
6. Click **"Create new project"** and wait ~2 minutes

### Step 2.2 — Run the database schema

1. In Supabase, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the entire SQL from the README's Database Schema section
4. Click **"Run"** (or press Cmd+Enter / Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 2.3 — Get your API keys

1. In Supabase, click **"Project Settings"** (gear icon) → **"API"**
2. Copy these three values — you'll need them soon:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

### Step 2.4 — Create your admin account manually

1. In Supabase, go to **"Authentication"** → **"Users"**
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and a strong password
4. Click **"Create user"**
5. Copy the user's UUID (the long string like `a1b2c3d4-...`)
6. Go to **"SQL Editor"** and run this (replace the UUID and details):

```sql
-- Set yourself as admin
-- Replace 'your-uuid-here' with your actual user UUID from the Users tab
UPDATE public.profiles
SET role = 'admin', full_name = 'Your Name', username = 'admin'
WHERE id = 'your-uuid-here';
```

> 💡 **Why manually?** The trigger auto-creates a profile when a user signs up, but sets role to 'member'. We manually upgrade ourselves to admin since we can't create an admin via the normal flow.

### Step 2.5 — Configure Supabase Auth settings

1. Go to **"Authentication"** → **"URL Configuration"**
2. Set **Site URL** to: `http://localhost:3000`
3. Add to **Redirect URLs**: `http://localhost:3000/api/auth/callback`
4. Click **Save**

> You'll update these to your Vercel URL after deployment.

---

## Phase 3 — Cloudinary Setup

### Step 3.1 — Create a Cloudinary account

1. Go to https://cloudinary.com and sign up free
2. After signup, you land on the Dashboard
3. Note down your **Cloud Name**, **API Key**, and **API Secret**

### Step 3.2 — Create upload presets

Upload presets define rules for how files get uploaded (folder, format, etc.)

1. Click **"Settings"** (gear icon, top right) → **"Upload"**
2. Scroll to **"Upload presets"** → click **"Add upload preset"**

**Preset 1 — For photos:**
- Preset name: `memories_photos`
- Signing mode: **Signed**
- Folder: `memoire/photos`
- Allowed formats: `jpg, jpeg, png, webp, gif`
- Click Save

**Preset 2 — For videos:**
- Preset name: `memories_videos`
- Signing mode: **Signed**
- Folder: `memoire/videos`
- Allowed formats: `mp4, mov, webm`
- Click Save

> 💡 **Why Signed?** Unsigned presets let anyone upload to your account. Signed presets require your server's secret key — much more secure.

---

## Phase 4 — Project Config & Folder Structure

### Step 4.1 — Create the environment variables file

In the root of your project, create `.env.local`:

```bash
# In terminal
touch .env.local
```

Open it and paste (fill in your actual values):

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

**Important rules for env variables:**
- Variables starting with `NEXT_PUBLIC_` are visible in the browser — safe for public keys
- Variables WITHOUT `NEXT_PUBLIC_` are server-only — use for secrets
- Never commit `.env.local` to GitHub (it's already in `.gitignore` by default)

### Step 4.2 — Create the folder structure

Run these commands in your terminal to create all folders at once:

```bash
# Create all directories
mkdir -p app/\(auth\)/login
mkdir -p app/\(main\)/dashboard
mkdir -p app/\(main\)/albums/\[id\]
mkdir -p app/\(main\)/upload
mkdir -p app/\(main\)/admin
mkdir -p app/\(main\)/settings
mkdir -p app/api/auth/callback
mkdir -p app/api/admin/create-user
mkdir -p app/api/admin/delete-user
mkdir -p app/api/upload/sign
mkdir -p app/api/upload/save
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/albums
mkdir -p components/media
mkdir -p components/upload
mkdir -p components/admin
mkdir -p lib/supabase
mkdir -p hooks
mkdir -p public
```

> 💡 **What are route groups?** Folders wrapped in `()` like `(auth)` and `(main)` are **route groups**. They don't appear in the URL — they just let you share a layout with some pages but not others. Pages in `(auth)` get the auth layout (centered login card). Pages in `(main)` get the main layout (navbar + sidebar).

### Step 4.3 — Update next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // Allow Cloudinary images
      },
    ],
  },
}

module.exports = nextConfig
```

> 💡 **Why?** Next.js's `<Image>` component only allows images from approved domains for security. We need to whitelist Cloudinary.

### Step 4.4 — Update globals.css

Replace the contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #f8f7f4;
    --foreground: #1a1a1a;
  }

  body {
    @apply bg-[--background] text-[--foreground] antialiased;
  }

  * {
    @apply box-border;
  }
}

@layer components {
  /* Reusable component styles */
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-6;
  }

  .btn-primary {
    @apply bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors duration-200;
  }

  .btn-danger {
    @apply bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .input-field {
    @apply w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
  }

  .page-title {
    @apply text-2xl font-bold text-gray-900;
  }

  .section-title {
    @apply text-lg font-semibold text-gray-800;
  }
}
```

> 💡 **@layer components** lets you define reusable Tailwind class combos. Instead of typing 10 classes every time you make a button, you write `btn-primary`. This is the industry standard approach.

---

## Phase 5 — Supabase Client Setup

This is one of the most important phases. We need **three different Supabase clients** for different contexts:

| Client | File | Used in | Uses which key |
|---|---|---|---|
| Browser client | `lib/supabase/client.js` | Client components (`"use client"`) | `ANON_KEY` |
| Server client | `lib/supabase/server.js` | Server components, API routes | `ANON_KEY` + cookies |
| Admin client | `lib/supabase/admin.js` | API routes only | `SERVICE_ROLE_KEY` |

> 💡 **Why three clients?** The browser client stores the session in localStorage. The server client reads the session from HTTP cookies (so server components know who's logged in). The admin client bypasses all security rules — only for admin operations on the server.

### Step 5.1 — Browser client

```javascript
// lib/supabase/client.js
import { createBrowserClient } from '@supabase/ssr'

// This creates a client that works in the browser
// It handles auth state, session storage, etc.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

### Step 5.2 — Server client

```javascript
// lib/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This creates a client that reads cookies on the server
// Used in Server Components and API Route handlers
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
```

### Step 5.3 — Admin client

```javascript
// lib/supabase/admin.js
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client bypasses ALL Row Level Security rules
// ONLY use it inside app/api/ routes — never in components or pages
// The SERVICE_ROLE_KEY has full database access

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

### Step 5.4 — Auth helper functions

```javascript
// lib/auth.js
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Get the current logged-in user (server-side)
// Returns null if not logged in
export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get the current user's profile (with role)
// Returns null if not logged in
export async function getProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

// Protect a server component — redirect to login if not authenticated
// Usage: const user = await requireAuth()
export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

// Protect a server component — redirect if not admin
// Usage: const profile = await requireAdmin()
export async function requireAdmin() {
  const profile = await getProfile()
  if (!profile) redirect('/login')
  if (profile.role !== 'admin') redirect('/dashboard')
  return profile
}
```

---

## Phase 6 — Middleware & Route Protection

Middleware in Next.js runs before every request — before the page loads. It's where we check if someone is logged in and what their role is, then redirect them if they shouldn't be somewhere.

```javascript
// middleware.js (in the ROOT of the project, not inside app/)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a Supabase client that can read/write cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get the current user (refreshes session if needed)
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // --- RULE 1: If logged in and visiting /login, redirect to dashboard ---
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // --- RULE 2: If not logged in and visiting protected routes, redirect to login ---
  const protectedRoutes = ['/dashboard', '/albums', '/upload', '/admin', '/settings']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- RULE 3: For admin-only routes, check role ---
  const adminRoutes = ['/upload', '/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (user && isAdminRoute) {
    // Fetch the user's profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

// Tell Next.js which routes to run middleware on
// We skip static files and API routes (API routes do their own auth checks)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
```

> 💡 **Two layers of protection:** The middleware protects pages. Each API route also checks auth independently. Never trust only the frontend — always verify on the server. This is called "defense in depth."

---

## Phase 7 — Login Page & Auth

### Step 7.1 — Auth route callback

This route handles the redirect after Supabase confirms login:

```javascript
// app/api/auth/callback/route.js
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something went wrong, send back to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

### Step 7.2 — Auth layout

```jsx
// app/(auth)/layout.jsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Mémoire</h1>
          <p className="text-gray-500 text-sm mt-1">entre amis</p>
        </div>
        {children}
      </div>
    </div>
  )
}
```

### Step 7.3 — Login page

```jsx
// app/(auth)/login/page.jsx
"use client"  // This page has a form with event handlers — must be client component

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()         // Prevent default browser form submission
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message || 'Failed to sign in')
      setLoading(false)
      return
    }

    // On success, redirect to dashboard
    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()   // Important: refresh server components with new session
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input-field"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Don't have an account? Contact the admin.
      </p>
    </div>
  )
}
```

### Step 7.4 — Root layout with Toast provider

```jsx
// app/layout.jsx
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mémoire entre Amis',
  description: 'Our university memories, together.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Toast notifications — shown globally */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#1a1a1a',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
```

---

## Phase 8 — Layouts & Navigation

### Step 8.1 — Navbar component

```jsx
// components/layout/Navbar.jsx
"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Navbar({ profile }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
        Mémoire <span className="text-gray-400 font-normal text-sm">entre amis</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Show admin badge if admin */}
        {profile?.role === 'admin' && (
          <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            Admin
          </span>
        )}

        {/* User info */}
        <span className="text-sm text-gray-600 hidden sm:block">
          {profile?.full_name}
        </span>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
```

### Step 8.2 — Sidebar component

```jsx
// components/layout/Sidebar.jsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// Navigation items — isAdminOnly means only shown to admins
const navItems = [
  { label: 'Dashboard',   href: '/dashboard', icon: '🏠', isAdminOnly: false },
  { label: 'Albums',      href: '/albums',    icon: '📸', isAdminOnly: false },
  { label: 'Upload',      href: '/upload',    icon: '⬆️',  isAdminOnly: true  },
  { label: 'Admin Panel', href: '/admin',     icon: '👥', isAdminOnly: true  },
  { label: 'Settings',    href: '/settings',  icon: '⚙️',  isAdminOnly: false },
]

export default function Sidebar({ isAdmin }) {
  const pathname = usePathname()

  // Filter items based on role
  const visibleItems = navItems.filter(item => !item.isAdminOnly || isAdmin)

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 p-4 hidden md:block">
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### Step 8.3 — Main layout

This layout wraps all pages inside `(main)/`. It's a **Server Component** so it can fetch the profile directly.

```jsx
// app/(main)/layout.jsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default async function MainLayout({ children }) {
  const supabase = createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, middleware should have redirected — but double-check
  if (!user) redirect('/login')

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-[--background]">
      <Navbar profile={profile} />

      <div className="flex">
        <Sidebar isAdmin={isAdmin} />

        {/* Main content area */}
        <main className="flex-1 p-6 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## Phase 9 — Admin Panel (User Management)

### Step 9.1 — API: Create user

```javascript
// app/api/admin/create-user/route.js
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  // Step 1: Verify the requester is an admin
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // Step 2: Parse the request body
  const { full_name, username, email, password } = await request.json()

  if (!full_name || !username || !email || !password) {
    return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
  }

  // Step 3: Create the user using admin client (bypasses email confirmation)
  const adminClient = createAdminClient()

  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,  // Auto-confirm email so they can log in immediately
    user_metadata: {
      full_name,
      username,
      role: 'member',
    },
  })

  if (createError) {
    return NextResponse.json({ success: false, error: createError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, data: { user: newUser } })
}
```

### Step 9.2 — API: Delete user

```javascript
// app/api/admin/delete-user/route.js
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
  // Verify admin
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // Get user_id from request
  const { user_id } = await request.json()

  if (!user_id) {
    return NextResponse.json({ success: false, error: 'user_id is required' }, { status: 400 })
  }

  // Prevent admin from deleting themselves
  if (user_id === user.id) {
    return NextResponse.json({ success: false, error: 'You cannot delete your own account' }, { status: 400 })
  }

  // Delete user from auth (cascade deletes the profile too, due to our FK)
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user_id)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
```

### Step 9.3 — Create User Modal component

```jsx
// components/admin/CreateUserModal.jsx
"use client"

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import toast from 'react-hot-toast'

export default function CreateUserModal({ onUserCreated }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const result = await response.json()

    if (!result.success) {
      toast.error(result.error || 'Failed to create user')
      setLoading(false)
      return
    }

    toast.success(`Account created for ${form.full_name}!`)
    setOpen(false)
    setForm({ full_name: '', username: '', email: '', password: '' })
    onUserCreated?.()   // Refresh parent list
    setLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-primary">+ Add Friend</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            Create Account
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                className="input-field" placeholder="John Doe" required />
            </div>
            <div>
              <label className="label">Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                className="input-field" placeholder="johndoe" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="john@example.com" required />
            </div>
            <div>
              <label className="label">Temporary Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="Minimum 6 characters" required minLength={6} />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary">Cancel</button>
              </Dialog.Close>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

### Step 9.4 — Admin page

```jsx
// app/(main)/admin/page.jsx
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CreateUserModal from '@/components/admin/CreateUserModal'
import UserTable from '@/components/admin/UserTable'

// This is a Server Component — it fetches data directly
export default async function AdminPage() {
  // requireAdmin() checks role and redirects if not admin
  await requireAdmin()

  const supabase = createClient()

  // Fetch all users with their profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users?.length || 0} accounts total</p>
        </div>
        <CreateUserModal />
      </div>

      <UserTable users={users || []} />
    </div>
  )
}
```

### Step 9.5 — User Table component

```jsx
// components/admin/UserTable.jsx
"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

function DeleteUserButton({ userId, userName, onDeleted }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const response = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })

    const result = await response.json()

    if (!result.success) {
      toast.error(result.error || 'Failed to delete user')
      setLoading(false)
      return
    }

    toast.success(`${userName}'s account deleted`)
    onDeleted?.()
    setLoading(false)
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-sm z-50 shadow-xl">
          <AlertDialog.Title className="font-semibold text-gray-900">Delete Account</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete <strong>{userName}</strong>'s account? This cannot be undone.
          </AlertDialog.Description>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialog.Cancel asChild>
              <button className="btn-secondary">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={handleDelete} disabled={loading} className="btn-danger">
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default function UserTable({ users }) {
  const [userList, setUserList] = useState(users)

  function handleDeleted(userId) {
    setUserList(prev => prev.filter(u => u.id !== userId))
  }

  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Name</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Username</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Role</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Joined</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {userList.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.full_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">@{user.username}</td>
              <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(user.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">
                {user.role !== 'admin' && (
                  <DeleteUserButton
                    userId={user.id}
                    userName={user.full_name}
                    onDeleted={() => handleDeleted(user.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="text-center py-12 text-gray-400">No users yet.</div>
      )}
    </div>
  )
}
```

---

## Phase 10 — Albums

### Step 10.1 — Albums list page

```jsx
// app/(main)/albums/page.jsx
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import AlbumGrid from '@/components/albums/AlbumGrid'
import CreateAlbumModal from '@/components/albums/CreateAlbumModal'

export default async function AlbumsPage() {
  await requireAuth()

  const supabase = createClient()
  const profile = await getProfile()

  const { data: albums } = await supabase
    .from('albums')
    .select(`
      *,
      media(count)
    `)
    .order('event_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Albums</h1>
          <p className="text-gray-500 text-sm mt-1">{albums?.length || 0} albums</p>
        </div>
        {profile?.role === 'admin' && <CreateAlbumModal />}
      </div>

      <AlbumGrid albums={albums || []} />
    </div>
  )
}
```

### Step 10.2 — Album Card component

```jsx
// components/albums/AlbumCard.jsx
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

export default function AlbumCard({ album }) {
  const photoCount = album.media?.[0]?.count || 0

  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Cover image */}
        <div className="aspect-video bg-linear-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
          {album.cover_url ? (
            <Image
              src={album.cover_url}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">📸</div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{album.title}</h3>
          {album.description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{album.description}</p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>{photoCount} items</span>
            {album.event_date && (
              <span>{format(new Date(album.event_date), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### Step 10.3 — Album Grid component

```jsx
// components/albums/AlbumGrid.jsx
import AlbumCard from './AlbumCard'

export default function AlbumGrid({ albums }) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📸</p>
        <p className="text-gray-500">No albums yet. Ask the admin to create one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}
```

### Step 10.4 — Single album page

```jsx
// app/(main)/albums/[id]/page.jsx
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MediaGrid from '@/components/media/MediaGrid'
import { format } from 'date-fns'

// `params` contains the dynamic [id] from the URL
export default async function AlbumPage({ params }) {
  await requireAuth()

  const supabase = createClient()

  // Fetch the album
  const { data: album } = await supabase
    .from('albums')
    .select('*')
    .eq('id', params.id)
    .single()

  // If album doesn't exist, show 404
  if (!album) notFound()

  // Fetch all media in this album
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('album_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Album header */}
      <div>
        <h1 className="page-title">{album.title}</h1>
        {album.description && (
          <p className="text-gray-500 mt-1">{album.description}</p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          {album.event_date && (
            <span>📅 {format(new Date(album.event_date), 'MMMM d, yyyy')}</span>
          )}
          <span>🖼️ {media?.length || 0} items</span>
        </div>
      </div>

      {/* Media grid */}
      <MediaGrid media={media || []} />
    </div>
  )
}
```

---

## Phase 11 — Media Upload

### Step 11.1 — API: Sign Cloudinary upload

```javascript
// app/api/upload/sign/route.js
import { createClient } from '@/lib/supabase/server'
import cloudinary from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request) {
  // Verify admin
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { folder, media_type } = await request.json()

  // Generate a signature — this proves to Cloudinary that our server approved this upload
  const timestamp = Math.round(new Date().getTime() / 1000)
  const preset = media_type === 'video' ? 'memories_videos' : 'memories_photos'

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: preset, folder },
    process.env.CLOUDINARY_API_SECRET
  )

  return NextResponse.json({
    success: true,
    data: {
      signature,
      timestamp,
      upload_preset: preset,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    }
  })
}
```

### Step 11.2 — API: Save media metadata

```javascript
// app/api/upload/save/route.js
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const {
    album_id,
    cloudinary_url,
    cloudinary_public_id,
    thumbnail_url,
    media_type,
    caption,
    width,
    height,
    duration_seconds,
    file_size_bytes,
  } = await request.json()

  const { data, error } = await supabase
    .from('media')
    .insert({
      album_id,
      uploader_id: user.id,
      cloudinary_url,
      cloudinary_public_id,
      thumbnail_url,
      media_type,
      caption,
      width,
      height,
      duration_seconds,
      file_size_bytes,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, data })
}
```

### Step 11.3 — Cloudinary config

```javascript
// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary
```

### Step 11.4 — Upload Form component

```jsx
// components/upload/UploadForm.jsx
"use client"

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

export default function UploadForm({ albums, onUploadComplete }) {
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState([])
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setProgress(selected.map(() => 0))
  }

  async function uploadFileToCloudinary(file, index) {
    const isVideo = file.type.startsWith('video/')
    const media_type = isVideo ? 'video' : 'photo'
    const folder = `memoire/${isVideo ? 'videos' : 'photos'}/${selectedAlbum}`

    // Step 1: Get signature from our server
    const signResponse = await fetch('/api/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder, media_type }),
    })
    const { data: signData } = await signResponse.json()

    // Step 2: Upload directly to Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signData.api_key)
    formData.append('timestamp', signData.timestamp)
    formData.append('signature', signData.signature)
    formData.append('upload_preset', signData.upload_preset)
    formData.append('folder', folder)

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${media_type === 'video' ? 'video' : 'image'}/upload`,
      { method: 'POST', body: formData }
    )
    const uploadData = await uploadResponse.json()

    // Step 3: Save metadata to Supabase
    await fetch('/api/upload/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        album_id: selectedAlbum,
        cloudinary_url: uploadData.secure_url,
        cloudinary_public_id: uploadData.public_id,
        thumbnail_url: isVideo ? uploadData.thumbnail_url : uploadData.secure_url,
        media_type,
        caption,
        width: uploadData.width,
        height: uploadData.height,
        duration_seconds: uploadData.duration ? Math.round(uploadData.duration) : null,
        file_size_bytes: uploadData.bytes,
      }),
    })

    // Update progress
    setProgress(prev => {
      const updated = [...prev]
      updated[index] = 100
      return updated
    })
  }

  async function handleUpload() {
    if (!selectedAlbum) return toast.error('Please select an album')
    if (files.length === 0) return toast.error('Please select files to upload')

    setUploading(true)

    try {
      // Upload all files (in parallel for speed)
      await Promise.all(files.map((file, i) => uploadFileToCloudinary(file, i)))
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded!`)
      setFiles([])
      setCaption('')
      setProgress([])
      fileInputRef.current.value = ''
      onUploadComplete?.()
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      console.error(err)
    }

    setUploading(false)
  }

  return (
    <div className="card space-y-5">
      <h2 className="section-title">Upload Media</h2>

      {/* Album selector */}
      <div>
        <label className="label">Select Album</label>
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="input-field"
        >
          <option value="">Choose an album...</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>{album.title}</option>
          ))}
        </select>
      </div>

      {/* File input */}
      <div>
        <label className="label">Photos & Videos</label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-4xl mb-2">📁</p>
          <p className="text-gray-500 text-sm">Click to select files, or drag and drop</p>
          <p className="text-gray-400 text-xs mt-1">Photos: JPG, PNG, WebP • Videos: MP4, MOV, WebM</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="truncate text-gray-700">{file.name}</span>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="text-gray-400">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                  {progress[i] === 100 && <span className="text-green-500">✓</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      <div>
        <label className="label">Caption (optional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="input-field"
          placeholder="Add a caption for these memories..."
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0 || !selectedAlbum}
        className="btn-primary w-full"
      >
        {uploading ? `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...` : 'Upload'}
      </button>
    </div>
  )
}
```

---

## Phase 12 — Media Browsing

### Step 12.1 — Media Grid component

```jsx
// components/media/MediaGrid.jsx
"use client"

import { useState } from 'react'
import PhotoCard from './PhotoCard'
import VideoCard from './VideoCard'
import Lightbox from './Lightbox'

export default function MediaGrid({ media }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Separate photos for lightbox (videos open differently)
  const photos = media.filter(m => m.media_type === 'photo')

  if (media.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🖼️</p>
        <p className="text-gray-500">No memories here yet. Ask the admin to upload some!</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {media.map((item, index) => (
          item.media_type === 'photo' ? (
            <PhotoCard
              key={item.id}
              photo={item}
              onClick={() => setLightboxIndex(photos.findIndex(p => p.id === item.id))}
            />
          ) : (
            <VideoCard key={item.id} video={item} />
          )
        ))}
      </div>

      {/* Lightbox for photos */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
```

### Step 12.2 — Photo Card component

```jsx
// components/media/PhotoCard.jsx
import Image from 'next/image'

export default function PhotoCard({ photo, onClick }) {
  return (
    <div
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={onClick}
    >
      <div className="rounded-xl overflow-hidden bg-gray-100 relative">
        <Image
          src={photo.cloudinary_url}
          alt={photo.caption || 'Memory'}
          width={photo.width || 600}
          height={photo.height || 400}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        />
        {photo.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-sm">{photo.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Step 12.3 — Lightbox component

```jsx
// components/media/Lightbox.jsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function Lightbox({ photos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const current = photos[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, photos.length - 1))
  }, [photos.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>

      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10 p-2"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-screen p-8" onClick={e => e.stopPropagation()}>
        <Image
          src={current.cloudinary_url}
          alt={current.caption || 'Memory'}
          width={current.width || 1200}
          height={current.height || 800}
          className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
        />
        {current.caption && (
          <p className="text-center text-gray-300 text-sm mt-3">{current.caption}</p>
        )}
        <p className="text-center text-gray-500 text-xs mt-1">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10 p-2"
          onClick={(e) => { e.stopPropagation(); goNext() }}
        >
          ›
        </button>
      )}
    </div>
  )
}
```

---

## Phase 13 — Settings (Change Password)

```jsx
// app/(main)/settings/page.jsx
"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword(e) {
    e.preventDefault()

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message || 'Failed to update password')
    } else {
      toast.success('Password updated successfully!')
      setPassword('')
      setConfirm('')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="card">
        <h2 className="section-title mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="input-field"
              placeholder="Repeat your new password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## Phase 14 — Polish & UX

### Step 14.1 — Dashboard page

```jsx
// app/(main)/dashboard/page.jsx
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import AlbumCard from '@/components/albums/AlbumCard'
import Link from 'next/link'

export default async function DashboardPage() {
  await requireAuth()

  const supabase = createClient()
  const profile = await getProfile()

  // Get recent albums
  const { data: recentAlbums } = await supabase
    .from('albums')
    .select('*, media(count)')
    .order('created_at', { ascending: false })
    .limit(6)

  // Get total counts
  const { count: totalMedia } = await supabase
    .from('media')
    .select('*', { count: 'exact', head: true })

  const { count: totalAlbums } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="page-title">
          Welcome back, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here are your latest university memories</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-indigo-600">{totalAlbums || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Albums</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-indigo-600">{totalMedia || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Memories</p>
        </div>
      </div>

      {/* Recent albums */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Albums</h2>
          <Link href="/albums" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentAlbums?.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
        {recentAlbums?.length === 0 && (
          <div className="text-center py-12 text-gray-400">No albums yet.</div>
        )}
      </div>
    </div>
  )
}
```

### Step 14.2 — Loading skeleton

```jsx
// components/ui/Skeleton.jsx
import clsx from 'clsx'

export default function Skeleton({ className }) {
  return (
    <div className={clsx('bg-gray-200 rounded-lg animate-pulse', className)} />
  )
}

// Usage in a page's loading.jsx:
// export default function Loading() {
//   return <div className="grid grid-cols-3 gap-4">
//     {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
//   </div>
// }
```

Add loading states to pages by creating a `loading.jsx` file next to any `page.jsx`:

```jsx
// app/(main)/albums/loading.jsx
import Skeleton from '@/components/ui/Skeleton'

export default function AlbumsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

> 💡 **loading.jsx is magic.** Next.js automatically shows it while the page's async data loads. Users see a skeleton instead of a blank screen.

---

## Phase 15 — Deployment

### Step 15.1 — Prepare for production

Before deploying, double-check:

```bash
# Test production build locally
npm run build
npm run start

# Fix any build errors before deploying
```

Common issues:
- Missing `"use client"` on components that use hooks
- Images without explicit `width` and `height`
- Env variables used server-side without the `NEXT_PUBLIC_` prefix

### Step 15.2 — Deploy to Vercel

```bash
# Push your latest code
git add .
git commit -m "feat: complete app build"
git push origin main
```

Then:
1. Go to https://vercel.com → **Add New Project**
2. Import your `memoire-entre-amis` GitHub repo
3. In **Environment Variables**, add all your `.env.local` values
4. Click **Deploy** — wait ~2 minutes

### Step 15.3 — Update URLs after deploy

After your first deploy, you'll get a URL like `https://memoire-entre-amis.vercel.app`

**Update Supabase:**
1. Go to Supabase → Authentication → URL Configuration
2. Set **Site URL** to your Vercel URL
3. Add to **Redirect URLs**: `https://memoire-entre-amis.vercel.app/api/auth/callback`

**Update Vercel env vars:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
3. Redeploy (Settings → Deployments → Redeploy)

---

## 🎓 What You've Learned

By completing this project, you now understand:

- **Next.js App Router** — file-based routing, route groups, dynamic routes
- **Server vs Client Components** — when to use each and why
- **API Routes** — building a backend inside Next.js
- **Supabase Auth** — login, session management, server-side auth
- **Row Level Security** — database-level access control
- **Middleware** — protecting routes before they load
- **Cloudinary** — secure media upload with signed requests
- **Tailwind CSS** — utility-first styling with reusable component classes
- **Industry patterns** — defense in depth, separation of concerns, clean folder structure

---

## 🐛 Troubleshooting Common Issues

**"Cannot read properties of null (reading 'user')"**
→ You're accessing user before the auth session loads. Make sure you're using `await supabase.auth.getUser()` not `.getSession()`.

**"Hydration error"**
→ Your server and client are rendering different HTML. Usually caused by `Math.random()` or `Date.now()` in a Server Component, or conditional rendering based on window size.

**Images not loading from Cloudinary**
→ Check that `res.cloudinary.com` is in your `next.config.js` remotePatterns.

**"RLS policy violation"**
→ Check your Supabase Row Level Security policies. Use the Supabase SQL Editor to test: `SELECT * FROM media WHERE auth.uid() = '...'`

**Admin routes accessible to non-admins**
→ Double-check middleware AND server-side role check in API routes. Never rely on frontend alone.

---

*Good luck building Mémoire entre Amis! 🎓✨*
