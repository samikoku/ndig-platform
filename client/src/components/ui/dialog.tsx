import React from 'react'
export const Dialog = ({ open, onOpenChange, children }: any) => open ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => onOpenChange?.(false)}><div onClick={(e) => e.stopPropagation()}>{children}</div></div> : null
export const DialogContent = ({ children, className }: any) => <div className={`bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto ${className || ''}`}>{children}</div>
export const DialogHeader = ({ children }: any) => <div className="p-6 border-b">{children}</div>
export const DialogTitle = ({ children, className }: any) => <h2 className={`text-2xl font-bold ${className || ''}`}>{children}</h2>
export const DialogDescription = ({ children }: any) => <p className="text-sm text-gray-600 mt-2">{children}</p>
export const DialogFooter = ({ children }: any) => <div className="p-6 border-t flex gap-3 justify-end">{children}</div>
export const DialogClose = ({ children, onClick }: any) => <button onClick={onClick} className="text-gray-600 hover:text-black">✕</button>
export const DialogTrigger = React.forwardRef<HTMLButtonElement, { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>
)
DialogTrigger.displayName = 'DialogTrigger'
