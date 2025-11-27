import React from "react"
import { Skeleton } from "./ui/skeleton"

interface ProductSkeletonProps {
    title?: string
    description?: string
    icon?: React.ReactNode
    count?: number
    cols?: {
        base?: number
        sm?: number
        lg?: number
        xl?: number
    }
    className?: string
}

export default function ProductSkeleton({
    title = "Loading...",
    description = "Please wait while we fetch data...",
    icon,
    count = 8,
    cols = { base: 1, sm: 2, lg: 3, xl: 4 },
    className = "",
}: ProductSkeletonProps) {
    return (
        <section className={`py-12 lg:py-16 ${className}`}>
            <div className="container mx-auto px-4">

                {/* Dynamic Header */}
                <div className="flex items-center gap-3 mb-8">
                    {icon && (
                        <div className="bg-slate-100 p-3 rounded-lg">
                            {icon}
                        </div>
                    )}

                    <div>
                        {title && <h2 className="text-3xl font-bold text-slate-900">{title}</h2>}
                        {description && <p className="text-slate-600">{description}</p>}
                    </div>
                </div>

                {/* Dynamic Skeleton Grid */}
                <div
                    className={`grid grid-cols-${cols.base} 
          sm:grid-cols-${cols.sm} 
          lg:grid-cols-${cols.lg} 
          xl:grid-cols-${cols.xl} 
          gap-6`}
                >
                    {Array.from({ length: count }).map((_, i) => (
                        <Skeleton key={i} className="h-[450px] rounded-lg" />
                    ))}
                </div>
            </div>
        </section>
    )
}
