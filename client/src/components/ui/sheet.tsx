import React from 'react'
export const Sheet = ({ open, children }: { open: boolean; children: React.ReactNode }) => open ? <div className="fixed inset-0">{children}</div> : null
export const SheetTrigger = React.forwardRef<HTMLButtonElement, { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>
)
SheetTrigger.displayName = 'SheetTrigger'
export const SheetContent = ({ children }: { children: React.ReactNode }) => <div className="bg-white p-4">{children}</div>
export const SheetHeader = ({ children }: { children: React.ReactNode }) => <div className="pb-4">{children}</div>
export const SheetTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-bold">{children}</h2>
export const SheetClose = ({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) => <button onClick={onClick}>✕</button>
