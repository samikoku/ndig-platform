import React from 'react'
import { cn } from '@/lib/utils'
export const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn('w-full bg-muted rounded overflow-hidden', className)}>
    <div className="bg-primary h-full rounded" style={{ width: `${value}%` }}></div>
  </div>
)
