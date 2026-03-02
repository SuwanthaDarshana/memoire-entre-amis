// app/api/albums/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { validateOrigin } from '@/lib/security'

type RouteParams = {
  params: Promise<{ id: string }>
}

// PATCH /api/albums/[id] — update album details (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

  const { id } = await params

  // Validate UUID format
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid album ID' },
      { status: 400 }
    )
  }

  const body = await request.json()

  // Only allow updating specific fields
  const updates: Record<string, unknown> = {}
  if (body.title !== undefined) updates.title = body.title.trim()
  if (body.description !== undefined) updates.description = body.description?.trim() || null
  if (body.event_date !== undefined) updates.event_date = body.event_date || null
  if (body.cover_url !== undefined) {
    // Validate cover_url is a Cloudinary URL or null
    if (body.cover_url && !/^https:\/\/res\.cloudinary\.com\//.test(body.cover_url)) {
      return NextResponse.json(
        { success: false, error: 'cover_url must be a Cloudinary URL' },
        { status: 400 }
      )
    }
    updates.cover_url = body.cover_url || null
  }

  const { data, error } = await supabase
    .from('albums')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update album:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to update album. Please try again.' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, album: data })
}

// DELETE /api/albums/[id] — delete album and all its media (admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // CSRF protection
  const csrfError = validateOrigin(_request)
  if (csrfError) return csrfError

  const supabase = await createClient()
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

  const { id } = await params

  // Validate UUID format
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid album ID' },
      { status: 400 }
    )
  }

  // Fetch all media in this album to clean up Cloudinary
  const { data: mediaItems } = await supabase
    .from('media')
    .select('cloudinary_public_id, media_type')
    .eq('album_id', id)

  // Delete from Cloudinary in parallel
  if (mediaItems && mediaItems.length > 0) {
    const deletePromises = mediaItems.map((item) =>
      cloudinary.uploader.destroy(item.cloudinary_public_id, {
        resource_type: item.media_type === 'video' ? 'video' : 'image',
      }).catch(() => null) // Don't fail if Cloudinary delete fails
    )
    await Promise.all(deletePromises)
  }

  // Delete all media rows (cascade should handle this, but explicit is safer)
  await supabase.from('media').delete().eq('album_id', id)

  // Delete the album
  const { error } = await supabase.from('albums').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete album:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to delete album. Please try again.' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
