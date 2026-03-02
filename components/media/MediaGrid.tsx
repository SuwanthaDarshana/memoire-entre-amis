// components/media/MediaGrid.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PhotoCard from './PhotoCard'
import VideoCard from './VideoCard'
import Lightbox from './Lightbox'
import type { Media } from '@/app/(main)/albums/[id]/page'

interface MediaGridProps {
  media: Media[]
  isAdmin?: boolean
}

export default function MediaGrid({ media, isAdmin }: MediaGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Separate photos for lightbox (videos open differently)
  const photos = media.filter(m => m.media_type === 'photo')

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete')
        return
      }
      toast.success('Deleted successfully')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeleting(null)
    }
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12.75c0 1.243 1.007 2.25 2.25 2.25Z" />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">
          No memories here yet. Ask the admin to upload some!
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Deleting overlay */}
      {deleting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-zinc-700">Deleting...</p>
          </div>
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {media.map((item) => (
          item.media_type === 'photo' ? (
            <PhotoCard
              key={item.id}
              photo={item}
              onClick={() => setLightboxIndex(
                photos.findIndex(p => p.id === item.id)
              )}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ) : (
            <VideoCard
              key={item.id}
              video={item}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
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