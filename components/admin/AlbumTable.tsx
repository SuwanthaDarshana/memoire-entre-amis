// components/admin/AlbumTable.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import EditAlbumModal from '@/components/albums/EditAlbumModal'
import Link from 'next/link'

type AdminAlbum = {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  event_date: string | null
  created_at: string
  media_count: number
}

function DeleteAlbumButton({ album, onDeleted }: { album: AdminAlbum; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/albums/${album.id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to delete album')
        return
      }

      toast.success(`"${album.title}" deleted`)
      onDeleted()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          Delete
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay" />
        <AlertDialog.Content className="dialog-content max-w-sm">
          <AlertDialog.Title className="font-bold text-zinc-900">
            Delete Album
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Are you sure you want to delete <strong>&ldquo;{album.title}&rdquo;</strong>?
            {album.media_count > 0 && (
              <span className="block mt-1 text-red-500 font-medium">
                This will also delete {album.media_count} media {album.media_count === 1 ? 'item' : 'items'} from Cloudinary.
              </span>
            )}
            This cannot be undone.
          </AlertDialog.Description>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialog.Cancel asChild>
              <button className="btn-secondary">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={handleDelete} disabled={loading} className="btn-danger">
                {loading ? 'Deleting...' : 'Delete Album'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default function AlbumTable({ albums }: { albums: AdminAlbum[] }) {
  const [albumList, setAlbumList] = useState(albums)
  const router = useRouter()

  function handleDeleted(albumId: string) {
    setAlbumList(prev => prev.filter(a => a.id !== albumId))
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-50/80 border-b border-zinc-100">
          <tr>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Album</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Event Date</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Media</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Created</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {albumList.map((album) => (
            <tr key={album.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="px-6 py-4">
                <Link href={`/albums/${album.id}`} className="hover:text-indigo-600 transition-colors">
                  <p className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600">{album.title}</p>
                  {album.description && (
                    <p className="text-xs text-zinc-400 truncate max-w-50 mt-0.5">{album.description}</p>
                  )}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-500">
                {album.event_date
                  ? format(new Date(album.event_date), 'MMM d, yyyy')
                  : <span className="text-zinc-300">—</span>
                }
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 text-sm text-zinc-600">
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12.75c0 1.243 1.007 2.25 2.25 2.25Z" />
                  </svg>
                  {album.media_count}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-400">
                {format(new Date(album.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <EditAlbumModal album={album} />
                  <DeleteAlbumButton album={album} onDeleted={() => handleDeleted(album.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {albumList.length === 0 && (
        <div className="text-center py-12 text-zinc-400 text-sm">No albums yet.</div>
      )}
    </div>
  )
}
