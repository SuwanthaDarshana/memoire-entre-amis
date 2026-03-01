import AlbumCard from './AlbumCard'
import type { Album } from '@/app/(main)/albums/page'  // ← import Album type

export default function AlbumGrid({ albums }: { albums: Album[] }) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 mb-4">
          <span className="text-3xl">📸</span>
        </div>
        <p className="text-zinc-400 text-sm">No albums yet. Ask the admin to create one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}