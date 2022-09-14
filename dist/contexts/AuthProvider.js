import React from 'react';
import { AuthContext } from './contexts';
export default function AuthProvider({
  methods,
  children
}) {
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: methods
  }, children);
}