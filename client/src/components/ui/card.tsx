import React from 'react'
import { cn } from '@/lib/utils'

type DivProps = React.HTMLAttributes<HTMLDivElement>
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>

export const Card = ({ className, ...props }: DivProps) => (
  <div className={cn('p-4 border rounded shadow-sm', className)} {...props} />
)
export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cn('pb-4', className)} {...props} />
)
export const CardTitle = ({ className, ...props }: HeadingProps) => (
  <h2 className={cn('text-lg font-bold', className)} {...props} />
)
export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cn(className)} {...props} />
)
