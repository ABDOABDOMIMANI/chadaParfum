export function LoadingSpinner({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-primary`}></div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-pulse">
      <div className="h-48 bg-secondary"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4"></div>
        <div className="h-4 bg-secondary rounded w-1/2"></div>
        <div className="h-6 bg-secondary rounded w-1/3"></div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

