// app/api/albums/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// POST /api/albums — create a new album (admin only)
export async function POST(request: NextRequest) {
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, album: data })
}
