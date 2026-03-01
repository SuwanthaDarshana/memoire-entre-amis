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
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-sm z-50 shadow-xl">
          <AlertDialog.Title className="font-semibold text-gray-900">
            Delete Account
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-500 mt-2">
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
    <div className="card p-0 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Name</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Username</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Role</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Joined</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {userList.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.full_name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                @{user.username}
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
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