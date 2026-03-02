// app/(main)/upload/page.tsx
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import UploadForm from '@/components/upload/UploadForm'
import BackButton from '@/components/ui/BackButton'

export default async function UploadPage() {
  await requireAuth()

  const supabase = await createClient()

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title')
    .order('title', { ascending: true })

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" label="Dashboard" />
      <div>
        <h1 className="page-title">Upload Media</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Add photos and videos to your albums
        </p>
      </div>

      <UploadForm albums={albums || []} />
    </div>
  )
}
