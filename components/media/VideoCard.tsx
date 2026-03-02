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
  isAdmin?: boolean
  onDelete?: (id: string) => void
}

export default function VideoCard({ video, isAdmin, onDelete }: VideoProps) {
  const [playing, setPlaying] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function formatDuration(seconds: number | null) {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="break-inside-avoid mb-4">
      <div className="rounded-2xl overflow-hidden bg-zinc-100 relative shadow-sm hover:shadow-md transition-all duration-300 group">
        {playing ? (
          <video
            src={video.cloudinary_url}
            controls
            autoPlay
            className="w-full h-auto"
          />
        ) : (
          <div
            className="relative cursor-pointer"
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
                <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
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

        {/* Admin delete button */}
        {isAdmin && onDelete && !playing && (
          confirmDelete ? (
            <div
              className="absolute top-2 left-2 right-2 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-xl p-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white text-xs flex-1">Delete?</p>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(video.id); }}
                className="px-2.5 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Yes
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                className="px-2.5 py-1 text-xs font-medium bg-zinc-600 hover:bg-zinc-500 text-white rounded-lg transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm z-10"
              title="Delete video"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )
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
