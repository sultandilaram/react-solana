import React from 'react';
import { ConfigContext } from '../contexts/contexts';
export default function useConfig() {
  const config = React.useContext(ConfigContext);
  if (!config) throw new Error("useConfig must be used inside ConfigProvider");
  return config;
}