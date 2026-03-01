import AlbumCard from './AlbumCard'
import type { Album } from '@/app/(main)/albums/page'  // ← import Album type

export default function AlbumGrid({ albums }: { albums: Album[] }) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📸</p>
        <p className="text-gray-500">No albums yet. Ask the admin to create one!</p>
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