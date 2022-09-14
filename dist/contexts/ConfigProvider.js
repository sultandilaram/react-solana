import React from 'react';
import { ConfigContext } from './contexts';
export default function ConfigProvider({
  config,
  children
}) {
  return /*#__PURE__*/React.createElement(ConfigContext.Provider, {
    value: config
  }, children);
}