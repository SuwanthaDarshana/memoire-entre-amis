// components/ui/Skeleton.tsx
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx('bg-zinc-100 rounded-xl animate-pulse', className)} />
  )
}

// Usage in a page's loading.tsx:
// export default function Loading() {
//   return <div className="grid grid-cols-3 gap-4">
//     {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
//   </div>
// }