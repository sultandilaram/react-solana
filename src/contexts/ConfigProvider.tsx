import React from 'react'
import { ConfigContext } from './contexts'
import { Config } from '../types'

export default function ConfigProvider({ config, children }: { config: Config, children: React.ReactNode }) {
  return (
    <ConfigContext.Provider value={config} >
      {children}
    </ConfigContext.Provider>
  )
}
