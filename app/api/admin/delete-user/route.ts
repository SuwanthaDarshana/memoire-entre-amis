// app/api/admin/delete-user/route.ts
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

// Type for the request body
type DeleteUserBody = {
  user_id: string
}

export async function DELETE(request: NextRequest) {
  // Verify admin
  const supabase = await createClient()       // ← await added
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    )
  }

  // Get user_id from request body
  const { user_id }: DeleteUserBody = await request.json()

  if (!user_id) {
    return NextResponse.json(
      { success: false, error: 'user_id is required' },
      { status: 400 }
    )
  }

  // Prevent admin from deleting themselves
  if (user_id === user.id) {
    return NextResponse.json(
      { success: false, error: 'You cannot delete your own account' },
      { status: 400 }
    )
  }

  // Delete user from auth (cascade deletes the profile too, due to our FK)
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user_id)

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}