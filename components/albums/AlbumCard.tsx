// components/albums/AlbumCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Album } from '@/app/(main)/albums/page'  // ← import Album type

export default function AlbumCard({ album }: { album: Album }) {
  const photoCount = album.media?.[0]?.count || 0

  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

        {/* Cover image */}
        <div className="aspect-16/10 bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
          {album.cover_url ? (
            <Image
              src={album.cover_url}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-4xl opacity-60" style={{ animation: 'float 5s ease-in-out infinite' }}>📸</span>
            </div>
          )}
          {/* Item count badge */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-zinc-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {photoCount} {photoCount === 1 ? 'item' : 'items'}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">{album.title}</h3>
          {album.description && (
            <p className="text-sm text-zinc-400 truncate mt-0.5">{album.description}</p>
          )}
          {album.event_date && (
            <p className="text-xs text-zinc-300 mt-2.5 font-medium">
              {format(new Date(album.event_date), 'MMM d, yyyy')}
            </p>
          )}
        </div>

      </div>
    </Link>
  )
}