import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  /** Number of placeholder blocks to show (default: 3) */
  blocks?: number
}

export default function LoadingSkeleton({ className, blocks = 3 }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-5xl px-4 py-8 space-y-4',
        className
      )}
    >
      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] animate-pulse"
          style={{
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  )
}
