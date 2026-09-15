import React from 'react'

export const Toaster = () => <></>
export const toast = {
  error: (message: string) => console.error(message),
  success: (message: string) => console.log(message),
  info: (message: string) => console.info(message),
}
