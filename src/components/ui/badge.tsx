import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-600/20 text-primary-300 border border-primary-600/30',
        success: 'bg-success-600/20 text-success-500 border border-success-600/30',
        warning: 'bg-warning-600/20 text-warning-500 border border-warning-600/30',
        danger: 'bg-danger-600/20 text-danger-500 border border-danger-600/30',
        neutral: 'bg-slate-700/60 text-slate-300 border border-slate-600/40',
        outline: 'border border-slate-600 text-slate-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
