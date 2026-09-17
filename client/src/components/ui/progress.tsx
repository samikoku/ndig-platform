import React from 'react'
export const Progress = ({ value }: { value: number }) => <div className="w-full bg-muted rounded h-2"><div className="bg-primary h-full rounded" style={{ width: `${value}%` }}></div></div>
