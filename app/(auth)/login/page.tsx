// app/(auth)/login/page.tsx
"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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

    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">
        Welcome back
      </h2>
      <p className="text-sm text-zinc-400 mb-6">Sign in to access your memories</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field bg-white/60"
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
            className="input-field bg-white/60"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 py-3 rounded-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Signing in...
            </span>
          ) : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-zinc-100">
        <p className="text-center text-xs text-zinc-400">
          Don&apos;t have an account? Contact the admin.
        </p>
      </div>
    </div>
  )
}
