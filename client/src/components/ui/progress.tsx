import React from 'react'
export const Progress = ({ value }: { value: number }) => <div className="w-full bg-gray-200 rounded h-2"><div className="bg-blue-600 h-full rounded" style={{ width: `${value}%` }}></div></div>
