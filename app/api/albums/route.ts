// app/api/albums/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { validateOrigin } from '@/lib/security'

// POST /api/albums — create a new album (admin only)
export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = validateOrigin(request)
  if (csrfError) return csrfError

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check admin role
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

  const { title, description, event_date } = await request.json()

  if (!title || typeof title !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Title is required' },
      { status: 400 }
    )
  }

  if (title.trim().length > 200) {
    return NextResponse.json(
      { success: false, error: 'Title must be under 200 characters' },
      { status: 400 }
    )
  }

  if (description && typeof description === 'string' && description.length > 2000) {
    return NextResponse.json(
      { success: false, error: 'Description must be under 2000 characters' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('albums')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      event_date: event_date || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create album:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to create album. Please try again.' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, album: data })
}
