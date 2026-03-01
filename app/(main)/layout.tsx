// app/(main)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'


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

      <div className="flex min-h-[calc(100vh-57px)]">
        <Sidebar isAdmin={isAdmin} />

        {/* Main content area — pb-20 on mobile for bottom nav clearance */}
        {/* <main className="flex-1 min-w-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 max-w-6xl mx-auto w-full"> */}
            <main className="flex-1 min-w-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}