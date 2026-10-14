import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn("px-3 py-2 border rounded w-full", className)} {...props} />
)
Input.displayName = 'Input'
