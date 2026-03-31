import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-900/30',
        secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600 border border-slate-600',
        ghost: 'text-slate-300 hover:bg-slate-700/60 hover:text-white',
        danger: 'bg-danger-600 text-white hover:bg-danger-500',
        success: 'bg-success-600 text-white hover:bg-success-500',
        outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white',
        link: 'text-primary-400 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
