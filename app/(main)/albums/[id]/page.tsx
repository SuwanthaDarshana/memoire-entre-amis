// app/(main)/albums/[id]/page.tsx
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MediaGrid from '@/components/media/MediaGrid'
import { format } from 'date-fns'

// Type for media row from Supabase
export type Media = {
  id: string
  album_id: string
  uploader_id: string | null
  cloudinary_url: string
  cloudinary_public_id: string
  thumbnail_url: string | null
  media_type: 'photo' | 'video'   // ← union type, only these two values allowed
  caption: string | null
  width: number | null
  height: number | null
  duration_seconds: number | null
  file_size_bytes: number | null
  created_at: string
}

// Type for the page params — [id] from the URL
type AlbumPageProps = {
  params: Promise<{ id: string }>   // ← Promise in Next.js 15+
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  await requireAuth()

  const { id } = await params       // ← await params in Next.js 15+
  const supabase = await createClient()

  // Fetch the album
  const { data: album } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .single()

  // If album doesn't exist, show 404
  if (!album) notFound()

  // Fetch all media in this album
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('album_id', id)
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
      <MediaGrid media={(media as Media[]) || []} />
    </div>
  )
}