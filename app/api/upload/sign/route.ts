import { createClient } from '@/lib/supabase/server'
import cloudinary from '@/lib/cloudinary'
import { NextResponse, type NextRequest } from 'next/server'
import { validateOrigin } from '@/lib/security'

// Type for request body
type SignRequestBody = {
  folder: string
  media_type: 'photo' | 'video'   // ← union type, only these two values
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = validateOrigin(request)
  if (csrfError) return csrfError

  // Verify authenticated user (any role can upload)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Parse request body
  const { folder, media_type }: SignRequestBody = await request.json()

  // ── Input validation ──
  if (media_type !== 'photo' && media_type !== 'video') {
    return NextResponse.json(
      { success: false, error: 'Invalid media type' },
      { status: 400 }
    )
  }

  // Only allow uploads to expected folder paths: memoire/(photos|videos)/{uuid}
  const VALID_FOLDER_REGEX = /^memoire\/(photos|videos)\/[a-zA-Z0-9-]+$/
  if (!folder || !VALID_FOLDER_REGEX.test(folder)) {
    return NextResponse.json(
      { success: false, error: 'Invalid upload folder' },
      { status: 400 }
    )
  }

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