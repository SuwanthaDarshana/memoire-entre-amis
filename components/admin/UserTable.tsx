// components/admin/UserTable.tsx
"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import type { Profile } from '@/app/(main)/admin/page'  // ← import the type we exported

// Types for DeleteUserButton props
type DeleteUserButtonProps = {
  userId: string
  userName: string
  onDeleted?: () => void
}

function DeleteUserButton({ userId, userName, onDeleted }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)

  async function handleDelete() {
    setLoading(true)

    const response = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })

    const result = await response.json()

    if (!result.success) {
      toast.error(result.error || 'Failed to delete user')
      setLoading(false)
      return
    }

    toast.success(`${userName}'s account deleted`)
    onDeleted?.()
    setLoading(false)
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-sm text-red-500 hover:text-red-700 font-medium">
          Delete
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay" />
        <AlertDialog.Content className="dialog-content max-w-sm">
          <AlertDialog.Title className="font-bold text-zinc-900">
            Delete Account
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Are you sure you want to delete <strong>{userName}</strong>&apos;s account?
            This cannot be undone.
          </AlertDialog.Description>
          <div className="flex gap-3 justify-end mt-6">
            <AlertDialog.Cancel asChild>
              <button className="btn-secondary">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="btn-danger"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

// Types for UserTable props
type UserTableProps = {
  users: Profile[]
}

export default function UserTable({ users }: UserTableProps) {
  const [userList, setUserList] = useState<Profile[]>(users)

  function handleDeleted(userId: string) {
    setUserList(prev => prev.filter(u => u.id !== userId))
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-50/80 border-b border-zinc-100">
          <tr>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Name</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Username</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Role</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Joined</th>
            <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {userList.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-zinc-900">
                {user.full_name}
              </td>
              <td className="px-6 py-4 text-sm text-zinc-400 font-mono">
                @{user.username}
              </td>
              <td className="px-6 py-4">
                <span className={`badge ${
                  user.role === 'admin'
                    ? 'badge-accent'
                    : 'badge-muted'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(user.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">
                {user.role !== 'admin' && (
                  <DeleteUserButton
                    userId={user.id}
                    userName={user.full_name}
                    onDeleted={() => handleDeleted(user.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="text-center py-12 text-gray-400">No users yet.</div>
      )}
    </div>
  )
}