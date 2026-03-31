import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subValue?: string
  trend?: number
  icon: LucideIcon
  iconColor?: string
  loading?: boolean
  className?: string
  pulse?: boolean
}

export function KpiCard({ title, value, subValue, trend, icon: Icon, iconColor = 'text-primary-400', loading, className, pulse }: KpiCardProps) {
  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  const trendPositive = trend !== undefined && trend > 0
  const trendNegative = trend !== undefined && trend < 0

  return (
    <Card className={cn('overflow-hidden hover:border-slate-600/80 transition-colors group', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/60 group-hover:bg-slate-700 transition-colors', iconColor.replace('text-', 'ring-') + '/20')}>
            <Icon className={cn('h-4 w-4', iconColor)} />
            {pulse && <span className="absolute h-2 w-2 rounded-full bg-success-500 pulse-dot" />}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-0.5 text-xs font-medium mb-0.5',
              trendPositive ? 'text-success-500' : trendNegative ? 'text-danger-500' : 'text-slate-400'
            )}>
              {trendPositive ? <TrendingUp className="h-3 w-3" /> : trendNegative ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        {subValue && <p className="mt-1 text-xs text-slate-400">{subValue}</p>}
      </CardContent>
    </Card>
  )
}
