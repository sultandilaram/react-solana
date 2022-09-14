import React from 'react'
import { AuthContext, IAuthContext } from './contexts'

export default function AuthProvider({ methods, children }: { methods: IAuthContext, children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={methods} >
      {children}
    </AuthContext.Provider>
  )
}
