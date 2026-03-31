import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, icon: Icon, iconColor = 'text-primary-400', children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4 mb-6', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60">
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        )}
        <div>
          <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  )
}
