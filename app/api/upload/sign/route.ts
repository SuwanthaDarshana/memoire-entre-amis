import { createClient } from '@/lib/supabase/server'
import cloudinary from '@/lib/cloudinary'
import { NextResponse, type NextRequest } from 'next/server'

// Type for request body
type SignRequestBody = {
  folder: string
  media_type: 'photo' | 'video'   // ← union type, only these two values
}

export async function POST(request: NextRequest) {
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

  // Parse request body
  const { folder, media_type }: SignRequestBody = await request.json()

  // Generate a signature — proves to Cloudinary our server approved this upload
  const timestamp = Math.round(new Date().getTime() / 1000)
  const preset = media_type === 'video' ? 'memories_videos' : 'memories_photos'

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: preset, folder },
    process.env.CLOUDINARY_API_SECRET!       // ← ! added
  )

  return NextResponse.json({
    success: true,
    data: {
      signature,
      timestamp,
      upload_preset: preset,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,  // ← ! added
      api_key: process.env.CLOUDINARY_API_KEY!,                    // ← ! added
    },
  })
}