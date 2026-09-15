import React from 'react'
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ children, ...props }, ref) => <label ref={ref} className="block text-sm font-medium text-gray-700" {...props}>{children}</label>
)
Label.displayName = 'Label'
