// components/layout/Sidebar.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// Type for each nav item
type NavItem = {
  label: string
  href: string
  icon: string
  isAdminOnly: boolean
}

// Navigation items — isAdminOnly means only shown to admins
const navItems: NavItem[] = [
  { label: 'Dashboard',   href: '/dashboard', icon: '🏠', isAdminOnly: false },
  { label: 'Albums',      href: '/albums',    icon: '📸', isAdminOnly: false },
  { label: 'Upload',      href: '/upload',    icon: '⬆️',  isAdminOnly: true  },
  { label: 'Admin Panel', href: '/admin',     icon: '👥', isAdminOnly: true  },
  { label: 'Settings',    href: '/settings',  icon: '⚙️',  isAdminOnly: false },
]

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  // Filter items based on role
  const visibleItems = navItems.filter(item => !item.isAdminOnly || isAdmin)

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 p-4 hidden md:block">
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}