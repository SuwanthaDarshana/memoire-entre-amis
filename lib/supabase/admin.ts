// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client bypasses ALL Row Level Security rules
// ONLY use it inside app/api/ routes — never in components or pages
// The SERVICE_ROLE_KEY has full database access

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}