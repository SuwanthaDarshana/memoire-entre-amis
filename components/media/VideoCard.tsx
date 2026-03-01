// components/media/VideoCard.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'

type VideoProps = {
  video: {
    id: string
    cloudinary_url: string
    thumbnail_url: string | null
    caption: string | null
    width: number | null
    height: number | null
    duration_seconds: number | null
  }
}

export default function VideoCard({ video }: VideoProps) {
  const [playing, setPlaying] = useState(false)

  function formatDuration(seconds: number | null) {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="break-inside-avoid mb-4">
      <div className="rounded-2xl overflow-hidden bg-zinc-100 relative shadow-sm hover:shadow-md transition-all duration-300">
        {playing ? (
          <video
            src={video.cloudinary_url}
            controls
            autoPlay
            className="w-full h-auto"
          />
        ) : (
          <div
            className="relative cursor-pointer group"
            onClick={() => setPlaying(true)}
          >
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={video.caption || 'Video'}
                width={video.width || 600}
                height={video.height || 400}
                className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <div className="aspect-video bg-linear-to-br from-zinc-200 to-zinc-100 flex items-center justify-center">
                <span className="text-4xl opacity-60">🎬</span>
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-zinc-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            {/* Duration badge */}
            {video.duration_seconds && (
              <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                {formatDuration(video.duration_seconds)}
              </span>
            )}
          </div>
        )}

        {video.caption && !playing && (
          <div className="p-3.5">
            <p className="text-sm text-zinc-500 font-medium">{video.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}
