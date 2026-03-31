import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
  separator?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className={cn(
          'absolute top-full z-50 mt-1.5 min-w-[180px] rounded-lg border border-slate-700/80 bg-slate-800/95 shadow-xl backdrop-blur-sm py-1',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 h-px bg-slate-700/60" />
            ) : (
              <button
                key={i}
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
                  item.variant === 'danger'
                    ? 'text-danger-400 hover:bg-danger-600/10'
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-slate-100'
                )}
              >
                {item.icon && <span className="h-4 w-4 flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
