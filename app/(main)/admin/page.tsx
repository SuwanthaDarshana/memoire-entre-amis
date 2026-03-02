// app/(main)/admin/page.tsx
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CreateUserModal from '@/components/admin/CreateUserModal'
import UserTable from '@/components/admin/UserTable'
import AlbumTable from '@/components/admin/AlbumTable'
import CreateAlbumModal from '@/components/albums/CreateAlbumModal'
import BackButton from '@/components/ui/BackButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage users and albums.',
}

// Type for a profile row from Supabase
export type Profile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

// This is a Server Component — it fetches data directly
export default async function AdminPage() {
  // requireAdmin() checks role and redirects if not admin
  await requireAdmin()

  const supabase = await createClient()

  // Fetch all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch all albums with media count
  const { data: albums } = await supabase
    .from('albums')
    .select('*, media(count)')
    .order('created_at', { ascending: false })

  // Transform albums with media_count for the table
  const albumsWithCount = (albums || []).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    cover_url: a.cover_url,
    event_date: a.event_date,
    created_at: a.created_at,
    media_count: a.media?.[0]?.count || 0,
  }))

  return (
    <div className="space-y-10">
      <BackButton href="/dashboard" label="Dashboard" />

      {/* Users Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {users?.length || 0} account{(users?.length || 0) !== 1 ? 's' : ''} total
            </p>
          </div>
          <CreateUserModal />
        </div>

        <UserTable users={(users as Profile[]) || []} />
      </section>

      {/* Albums Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Album Management</h2>
            <p className="text-zinc-400 text-sm mt-1">
              {albumsWithCount.length} album{albumsWithCount.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <CreateAlbumModal />
        </div>

        <AlbumTable albums={albumsWithCount} />
      </section>
    </div>
  )
}