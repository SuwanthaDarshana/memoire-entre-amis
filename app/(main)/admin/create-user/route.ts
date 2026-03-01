// app/api/admin/create-user/route.ts
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

// Type for the request body
type CreateUserBody = {
  full_name: string
  username: string
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  // Step 1: Verify the requester is an admin
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

  // Step 2: Parse the request body
  const { full_name, username, email, password }: CreateUserBody =
    await request.json()

  if (!full_name || !username || !email || !password) {
    return NextResponse.json(
      { success: false, error: 'All fields are required' },
      { status: 400 }
    )
  }

  // Step 3: Create the user using admin client (bypasses email confirmation)
  const adminClient = createAdminClient()

  const { data: newUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // Auto-confirm so they can log in immediately
      user_metadata: {
        full_name,
        username,
        role: 'member',
      },
    })

  if (createError) {
    return NextResponse.json(
      { success: false, error: createError.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, data: { user: newUser } })
}