// components/admin/CreateUserModal.tsx
"use client"

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import toast from 'react-hot-toast'

// Type for the form state
type UserForm = {
  full_name: string
  username: string
  email: string
  password: string
}

// Type for the props
type CreateUserModalProps = {
  onUserCreated?: () => void    // ← optional function, no return value
}

export default function CreateUserModal({ onUserCreated }: CreateUserModalProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [form, setForm] = useState<UserForm>({
    full_name: '',
    username: '',
    email: '',
    password: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const result = await response.json()

    if (!result.success) {
      toast.error(result.error || 'Failed to create user')
      setLoading(false)
      return
    }

    toast.success(`Account created for ${form.full_name}!`)
    setOpen(false)
    setForm({ full_name: '', username: '', email: '', password: '' })
    onUserCreated?.()
    setLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-primary">+ Add Friend</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            Create Account
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="label">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input-field"
                placeholder="johndoe"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Temporary Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Dialog.Close asChild>
                <button type="button" className="btn-secondary">Cancel</button>
              </Dialog.Close>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}