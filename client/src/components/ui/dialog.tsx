import React from 'react'
export const Dialog = ({ open, children }: { open: boolean; children: React.ReactNode }) => open ? <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">{children}</div> : null
export const DialogContent = ({ children }: { children: React.ReactNode }) => <div className="bg-white p-8 rounded">{children}</div>
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="pb-4">{children}</div>
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>
export const DialogClose = ({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) => <button onClick={onClick} className="text-gray-600 hover:text-black">✕</button>
export const DialogTrigger = React.forwardRef<HTMLButtonElement, { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>
)
DialogTrigger.displayName = 'DialogTrigger'
