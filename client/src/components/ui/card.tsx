import React from 'react'
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={`p-4 border rounded shadow-sm ${className || ''}`}>{children}</div>
export const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="pb-4">{children}</div>
export const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-bold">{children}</h2>
export const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
