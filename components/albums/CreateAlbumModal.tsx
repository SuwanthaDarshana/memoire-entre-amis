// components/albums/CreateAlbumModal.tsx
"use client"

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CreateAlbumModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const result = await response.json()

    if (!result.success) {
      toast.error(result.error || 'Failed to create album')
      setLoading(false)
      return
    }

    toast.success(`Album "${form.title}" created!`)
    setOpen(false)
    setForm({ title: '', description: '', event_date: '' })
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-primary">+ New Album</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="text-lg font-bold text-zinc-900 mb-1">
            Create Album
          </Dialog.Title>
          <p className="text-sm text-zinc-400 mb-5">Organize a new collection of memories</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Graduation Day"
                required
              />
            </div>
            <div>
              <label className="label">Description (optional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input-field"
                placeholder="What was this event about?"
                rows={3}
              />
            </div>
            <div>
              <label className="label">Event Date (optional)</label>
              <input
                name="event_date"
                type="date"
                value={form.event_date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary">Cancel</button>
              </Dialog.Close>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
