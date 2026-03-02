// app/api/admin/create-user/route.ts
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'
import { validateOrigin } from '@/lib/security'

// Type for the request body
type CreateUserBody = {
  full_name: string
  username: string
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = validateOrigin(request)
  if (csrfError) return csrfError

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

  // Input format & length validation
  if (full_name.length > 100) {
    return NextResponse.json(
      { success: false, error: 'Name must be under 100 characters' },
      { status: 400 }
    )
  }

  if (username.length > 50 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
    return NextResponse.json(
      { success: false, error: 'Username must be under 50 characters and contain only letters, numbers, hyphens, underscores' },
      { status: 400 }
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Invalid email format' },
      { status: 400 }
    )
  }

  // Password strength: min 8 chars, must include uppercase, lowercase, and number
  if (password.length < 8) {
    return NextResponse.json(
      { success: false, error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { success: false, error: 'Password must include uppercase, lowercase, and a number' },
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
    console.error('Failed to create user:', createError.message)
    return NextResponse.json(
      { success: false, error: 'Failed to create user. The email may already be in use.' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, data: { user: newUser } })
}