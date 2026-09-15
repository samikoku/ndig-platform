import React, { createContext } from 'react'

interface DemoModeContextType {
  isDemoMode: boolean
}

export const DemoModeContext = createContext<DemoModeContextType>({ isDemoMode: false })

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DemoModeContext.Provider value={{ isDemoMode: false }}>
      {children}
    </DemoModeContext.Provider>
  )
}

export const useDemoMode = () => {
  const context = React.useContext(DemoModeContext)
  if (!context) {
    return { isDemoMode: false }
  }
  return context
}
