// components/media/PhotoCard.tsx
import Image from 'next/image'

interface Photo {
  cloudinary_url: string
  caption?: string
  width?: number
  height?: number
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
      <div className="rounded-xl overflow-hidden bg-gray-100 relative">
        <Image
          src={photo.cloudinary_url}
          alt={photo.caption || 'Memory'}
          width={photo.width || 600}
          height={photo.height || 400}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        />
        {photo.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-sm">{photo.caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}