// app/(main)/admin/page.tsx
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CreateUserModal from '@/components/admin/CreateUserModal'
import UserTable from '@/components/admin/UserTable'

// Type for a profile row from Supabase
export type Profile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

// This is a Server Component — it fetches data directly
export default async function AdminPage() {
  // requireAdmin() checks role and redirects if not admin
  await requireAdmin()

  const supabase = await createClient()     // ← await added

  // Fetch all users with their profiles
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users?.length || 0} accounts total
          </p>
        </div>
        <CreateUserModal />
      </div>

      <UserTable users={(users as Profile[]) || []} />
    </div>
  )
}