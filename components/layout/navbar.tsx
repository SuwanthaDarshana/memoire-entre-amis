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