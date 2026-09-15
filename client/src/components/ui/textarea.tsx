import React from 'react'
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => <textarea ref={ref} className="px-3 py-2 border rounded w-full" {...props} />
)
Textarea.displayName = 'Textarea'
