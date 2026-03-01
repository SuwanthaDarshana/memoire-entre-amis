// app/(main)/albums/page.tsx
import { requireAuth, getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AlbumGrid from '@/components/albums/AlbumGrid'
import CreateAlbumModal from '@/components/albums/CreateAlbumModal'

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
  media: { count: number }[]   // ← from the media(count) join
}

export default async function AlbumsPage() {
  await requireAuth()

  const supabase = await createClient()    // ← await added
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
          <p className="text-gray-500 text-sm mt-1">
            {albums?.length || 0} albums
          </p>
        </div>
        {profile?.role === 'admin' && <CreateAlbumModal />}
      </div>

      <AlbumGrid albums={(albums as Album[]) || []} />
    </div>
  )
}