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

  // Get current user & check if admin
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

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
          <p className="text-zinc-400 mt-1">{album.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-300">
          {album.event_date && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {format(new Date(album.event_date), 'MMMM d, yyyy')}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12.75c0 1.243 1.007 2.25 2.25 2.25z" />
            </svg>
            {media?.length || 0} items
          </span>
        </div>
      </div>

      {/* Media grid */}
      <MediaGrid media={(media as Media[]) || []} isAdmin={isAdmin} />
    </div>
  )
}