// components/layout/Sidebar.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// SVG icon components — clean, consistent, pixel-perfect
function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

function IconAlbums({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12.75c0 1.243 1.007 2.25 2.25 2.25z" />
    </svg>
  )
}

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function IconAdmin({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// Icon map
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  albums: IconAlbums,
  upload: IconUpload,
  admin: IconAdmin,
  settings: IconSettings,
}

// Type for each nav item
type NavItem = {
  label: string
  href: string
  iconKey: string
  isAdminOnly: boolean
}

// Navigation items
const navItems: NavItem[] = [
  { label: 'Dashboard',   href: '/dashboard', iconKey: 'dashboard', isAdminOnly: false },
  { label: 'Albums',      href: '/albums',    iconKey: 'albums',    isAdminOnly: false },
  { label: 'Upload',      href: '/upload',    iconKey: 'upload',    isAdminOnly: false },
  { label: 'Admin Panel', href: '/admin',     iconKey: 'admin',     isAdminOnly: true  },
  { label: 'Settings',    href: '/settings',  iconKey: 'settings',  isAdminOnly: false },
]

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  // Filter items based on role
  const visibleItems = navItems.filter(item => !item.isAdminOnly || isAdmin)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-48 lg:w-52 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] bg-white/60 backdrop-blur-sm border-r border-zinc-100 p-3 hidden md:block overflow-y-auto">
        <nav className="space-y-0.5 mt-1">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = iconMap[item.iconKey]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs shadow-indigo-100'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                )}
              >
                <Icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-indigo-600' : 'text-zinc-400')} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-zinc-100 px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex items-center justify-around py-1.5">
          {visibleItems.slice(0, 5).map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = iconMap[item.iconKey]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[3.5rem] transition-all duration-150',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-zinc-400 active:text-zinc-600'
                )}
              >
                <Icon className={clsx('w-5 h-5', isActive && 'text-indigo-600')} />
                <span className={clsx('text-[10px] font-medium leading-tight', isActive ? 'text-indigo-600' : 'text-zinc-400')}>
                  {item.label === 'Admin Panel' ? 'Admin' : item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-0.5" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}