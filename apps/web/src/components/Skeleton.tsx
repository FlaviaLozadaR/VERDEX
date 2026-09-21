import type { CSSProperties } from "react"

export function Skeleton({
  className = "",
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return <div className={`skeleton rounded-lg ${className}`} style={style} aria-hidden="true" />
}

/** A few skeleton lines stacked — for cards/rows still waiting on data. */
export function SkeletonLines({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  )
}
