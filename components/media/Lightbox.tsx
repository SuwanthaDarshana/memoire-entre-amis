// components/media/Lightbox.tsx
"use client"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  cloudinary_url: string
  caption?: string
  width?: number
  height?: number
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
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
        onClick={onClose}
      >
        ✕
      </button>
      {currentIndex > 0 && (
        <button
          className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10 p-2"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); goPrev() }}
        >
          ‹
        </button>
      )}
      <div className="max-w-5xl max-h-screen p-8" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Image
          src={current.cloudinary_url}
          alt={current.caption || 'Memory'}
          width={current.width || 1200}
          height={current.height || 800}
          className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
        />
        {current.caption && (
          <p className="text-center text-gray-300 text-sm mt-3">{current.caption}</p>
        )}
        <p className="text-center text-gray-500 text-xs mt-1">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>
      {currentIndex < photos.length - 1 && (
        <button
          className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10 p-2"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); goNext() }}
        >
          ›
        </button>
      )}
    </div>
  )
}