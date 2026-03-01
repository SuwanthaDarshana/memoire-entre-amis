// lib/auth.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Get the current logged-in user (server-side)
// Returns null if not logged in
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get the current user's profile (with role)
// Returns null if not logged in
export async function getProfile() {
  const supabase = await createClient()
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