// components/media/PhotoCard.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  cloudinary_url: string
  caption?: string | null
  width?: number | null
  height?: number | null
}

interface PhotoCardProps {
  photo: Photo
  onClick: () => void
  isAdmin?: boolean
  onDelete?: (id: string) => void
}

export default function PhotoCard({ photo, onClick, isAdmin, onDelete }: PhotoCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={onClick}
    >
      <div className="rounded-2xl overflow-hidden bg-zinc-100 relative shadow-sm hover:shadow-md transition-all duration-300">
        <Image
          src={photo.cloudinary_url}
          alt={photo.caption || 'Memory'}
          width={photo.width || 600}
          height={photo.height || 400}
          className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-500"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {photo.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium drop-shadow-lg">{photo.caption}</p>
          </div>
        )}

        {/* Admin delete button */}
        {isAdmin && onDelete && (
          confirmDelete ? (
            <div
              className="absolute top-2 left-2 right-2 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-xl p-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white text-xs flex-1">Delete?</p>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
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
              title="Delete photo"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )
        )}

        {/* Zoom indicator */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
          <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
    </div>
  )
}