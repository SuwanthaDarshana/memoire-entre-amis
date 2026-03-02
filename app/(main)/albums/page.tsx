// app/(main)/albums/page.tsx
import { requireAuth, getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AlbumGrid from '@/components/albums/AlbumGrid'
import CreateAlbumModal from '@/components/albums/CreateAlbumModal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Albums',
  description: 'Browse all your shared photo and video albums.',
}

// Type for album row from Supabase
export type Album = {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  event_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  media: { count: number }[]
  preview: {
    id: string
    cloudinary_url: string
    thumbnail_url: string | null
    media_type: string
  }[]
}

export default async function AlbumsPage() {
  await requireAuth()

  const supabase = await createClient()    // ← await added
  const profile = await getProfile()

  const { data: albums } = await supabase
    .from('albums')
    .select(`
      *,
      media(count),
      preview:media(id, cloudinary_url, thumbnail_url, media_type)
    `)
    .order('event_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Albums</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {albums?.length || 0} album{(albums?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {profile?.role === 'admin' && <CreateAlbumModal />}
      </div>

      <AlbumGrid albums={(albums as Album[]) || []} />
    </div>
  )
}