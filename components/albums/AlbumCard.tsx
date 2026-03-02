// components/albums/AlbumCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Album } from '@/app/(main)/albums/page'

function getThumbUrl(item: Album['preview'][number]) {
  // For videos, use thumbnail_url if available
  if (item.media_type === 'video' && item.thumbnail_url) return item.thumbnail_url
  // For Cloudinary images, insert a resize transformation for faster loading
  const url = item.cloudinary_url
  return url.replace('/upload/', '/upload/c_fill,w_400,h_300,q_auto,f_auto/')
}

export default function AlbumCard({ album }: { album: Album }) {
  const photoCount = album.media?.[0]?.count || 0
  const previews = (album.preview || []).slice(0, 4)

  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

        {/* Cover / Preview grid */}
        <div className="aspect-16/10 relative overflow-hidden">
          {album.cover_url ? (
            // Explicit cover image
            <Image
              src={album.cover_url}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : previews.length >= 4 ? (
            // 2×2 grid
            <div className="grid grid-cols-2 grid-rows-2 h-full">
              {previews.slice(0, 4).map((item, i) => (
                <div key={item.id} className="relative overflow-hidden">
                  <Image
                    src={getThumbUrl(item)}
                    alt=""
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                      i === 0 ? 'delay-0' : i === 1 ? 'delay-75' : i === 2 ? 'delay-100' : 'delay-150'
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : previews.length === 3 ? (
            // 1 large left + 2 stacked right
            <div className="grid grid-cols-2 h-full">
              <div className="relative overflow-hidden">
                <Image src={getThumbUrl(previews[0])} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="grid grid-rows-2">
                {previews.slice(1, 3).map((item) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <Image src={getThumbUrl(item)} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          ) : previews.length === 2 ? (
            // Side by side
            <div className="grid grid-cols-2 h-full">
              {previews.map((item) => (
                <div key={item.id} className="relative overflow-hidden">
                  <Image src={getThumbUrl(item)} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          ) : previews.length === 1 ? (
            // Single full cover
            <Image
              src={getThumbUrl(previews[0])}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            // Empty fallback
            <div className="bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center h-full">
              <svg className="w-10 h-10 text-indigo-300 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ animation: 'float 5s ease-in-out infinite' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
          )}

          {/* Item count badge */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-zinc-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {photoCount} {photoCount === 1 ? 'item' : 'items'}
          </div>

          {/* Hover gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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