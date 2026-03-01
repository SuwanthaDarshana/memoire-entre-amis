// components/media/MediaGrid.tsx
"use client"

import { useState } from 'react'
import PhotoCard from './PhotoCard'
import VideoCard from './VideoCard'
import Lightbox from './Lightbox'
import type { Media } from '@/app/(main)/albums/[id]/page'

export default function MediaGrid({ media }: { media: Media[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Separate photos for lightbox (videos open differently)
  const photos = media.filter(m => m.media_type === 'photo')

  if (media.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 mb-4">
          <span className="text-3xl">🖼️</span>
        </div>
        <p className="text-zinc-400 text-sm">
          No memories here yet. Ask the admin to upload some!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {media.map((item) => (
          item.media_type === 'photo' ? (
            <PhotoCard
              key={item.id}
              photo={item}
              onClick={() => setLightboxIndex(
                photos.findIndex(p => p.id === item.id)
              )}
            />
          ) : (
            <VideoCard key={item.id} video={item} />
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