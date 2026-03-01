// app/api/media/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

type RouteParams = {
  params: Promise<{ id: string }>
}

// DELETE /api/media/[id] — delete a single media item (admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

  // Fetch the media item to get Cloudinary public_id
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('cloudinary_public_id, media_type')
    .eq('id', id)
    .single()

  if (fetchError || !media) {
    return NextResponse.json(
      { success: false, error: 'Media not found' },
      { status: 404 }
    )
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(media.cloudinary_public_id, {
      resource_type: media.media_type === 'video' ? 'video' : 'image',
    })
  } catch {
    // Log but don't fail — the DB record should still be deleted
    console.error('Failed to delete from Cloudinary:', media.cloudinary_public_id)
  }

  // Delete from database
  const { error } = await supabase.from('media').delete().eq('id', id)

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
