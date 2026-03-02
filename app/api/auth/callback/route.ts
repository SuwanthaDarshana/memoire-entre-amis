// app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Prevent open redirect — only allow relative paths, block protocol-relative URLs
  const safePath = (next.startsWith('/') && !next.startsWith('//')) ? next : '/dashboard'

  if (code) {
    const supabase = await createClient()        // ← await added
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${safePath}`)
    }
  }

  // If something went wrong, send back to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}