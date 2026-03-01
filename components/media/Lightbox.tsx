// components/media/Lightbox.tsx
"use client"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  cloudinary_url: string
  caption?: string | null
  width?: number | null
  height?: number | null
}

interface LightboxProps {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex)
  const current = photos[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, photos.length - 1))
  }, [photos.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      {/* Close button */}
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/60 text-sm font-medium z-10">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Previous */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); goPrev() }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-screen p-8" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Image
          src={current.cloudinary_url}
          alt={current.caption || 'Memory'}
          width={current.width || 1200}
          height={current.height || 800}
          className="max-h-[85vh] w-auto mx-auto object-contain rounded-xl shadow-2xl"
        />
        {current.caption && (
          <p className="text-center text-white/70 text-sm mt-4 font-medium">{current.caption}</p>
        )}
      </div>

      {/* Next */}
      {currentIndex < photos.length - 1 && (
        <button
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); goNext() }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}