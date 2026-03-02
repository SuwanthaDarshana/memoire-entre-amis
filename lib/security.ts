// lib/security.ts — Shared security utilities

import { NextRequest, NextResponse } from 'next/server'

/**
 * UUID v4 format regex for parameter validation.
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Cloudinary URL format regex for stored URL validation.
 */
export const CLOUDINARY_URL_REGEX = /^https:\/\/res\.cloudinary\.com\/.+/

/**
 * Validate that a request comes from the same origin (CSRF protection).
 * Should be applied to all state-mutating (POST/PATCH/DELETE) API routes.
 *
 * Returns null if valid, or a NextResponse with 403 if invalid.
 */
export function validateOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // Allow requests without origin header (same-origin navigations, server-side calls)
  if (!origin) return null

  // Compare origin hostname to host header
  try {
    const originUrl = new URL(origin)
    if (originUrl.host === host) return null
  } catch {
    // Invalid origin URL
  }

  return NextResponse.json(
    { success: false, error: 'Forbidden' },
    { status: 403 }
  )
}

/**
 * Validate required environment variables at import time.
 * This will throw during build/startup if any are missing.
 */
const REQUIRED_SERVER_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const

const REQUIRED_PUBLIC_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const v of REQUIRED_SERVER_VARS) {
    if (!process.env[v]) missing.push(v)
  }
  for (const v of REQUIRED_PUBLIC_VARS) {
    if (!process.env[v]) missing.push(v)
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nCheck your .env.local file.`
    )
  }
}
