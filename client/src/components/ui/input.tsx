import React from 'react'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} className="px-3 py-2 border rounded w-full" {...props} />
)
Input.displayName = 'Input'
