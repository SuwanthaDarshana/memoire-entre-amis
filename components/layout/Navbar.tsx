"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Define the shape of the profile object
type Profile = {
  full_name: string
  role: string
  username: string
}

export default function Navbar({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.refresh()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-100/80 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 sm:gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0">
          <span className="text-white text-xs font-bold">M</span>
        </div>
        <span className="font-bold text-zinc-900 tracking-tight text-sm sm:text-base">
          Mémoire <span className="text-zinc-300 font-normal text-xs ml-0.5 hidden sm:inline">entre amis</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Show admin badge if admin */}
        {profile?.role === 'admin' && (
          <span className="badge badge-accent">
            Admin
          </span>
        )}

        {/* User info */}
        <span className="text-sm font-medium text-zinc-600 hidden sm:block">
          {profile?.full_name}
        </span>

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200 hidden sm:block" />

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="btn-ghost text-xs"
        >
          <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </nav>
  )
}