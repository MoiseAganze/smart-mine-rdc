import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
