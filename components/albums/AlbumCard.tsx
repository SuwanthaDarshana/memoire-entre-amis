// components/albums/AlbumCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Album } from '@/app/(main)/albums/page'  // ← import Album type

export default function AlbumCard({ album }: { album: Album }) {
  const photoCount = album.media?.[0]?.count || 0

  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">

        {/* Cover image */}
        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
          {album.cover_url ? (
            <Image
              src={album.cover_url}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">📸</div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{album.title}</h3>
          {album.description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{album.description}</p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>{photoCount} items</span>
            {album.event_date && (
              <span>{format(new Date(album.event_date), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}