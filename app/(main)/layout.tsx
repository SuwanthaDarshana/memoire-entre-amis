// app/(main)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sidebar'


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()    // ← await added

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, middleware should have redirected — but double-check
  if (!user) redirect('/login')

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-(--color-background)">
      <Navbar profile={profile} />

      <div className="flex">
        <Sidebar isAdmin={isAdmin} />

        {/* Main content area */}
        <main className="flex-1 p-6 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  )
}