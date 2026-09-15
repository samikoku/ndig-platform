import React from 'react'
export const Select = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <button className="px-3 py-2 border rounded">{children}</button>
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>
export const SelectContent = ({ children }: { children: React.ReactNode }) => <div className="absolute bg-white border rounded shadow-lg">{children}</div>
export const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-value={value}>{children}</div>
