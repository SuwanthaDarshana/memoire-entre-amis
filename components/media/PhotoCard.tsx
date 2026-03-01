// components/media/PhotoCard.tsx
import Image from 'next/image'

interface Photo {
  cloudinary_url: string
  caption?: string | null
  width?: number | null
  height?: number | null
}

interface PhotoCardProps {
  photo: Photo
  onClick: () => void
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
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