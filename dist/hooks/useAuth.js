import React from 'react';
import { AuthContext } from '../contexts/contexts';
import useLocalStorage from "./useLocalStorage";
export default function useAuth() {
  const authContext = React.useContext(AuthContext);
  if (!authContext) throw new Error("useAuth must be used inside AuthProvider");
  const [authToken, setAuthToken] = useLocalStorage('auth_token', null);
  const isAuth = React.useMemo(() => authToken === null ? true : false, [authToken]);
  const login = React.useCallback(async (...args) => {
    const token = await authContext.loginMethod(...args);
    setAuthToken(token);
  }, [authContext, setAuthToken]);
  const logout = React.useCallback(() => {
    setAuthToken(null);
    authContext.logoutCallback && authContext.logoutCallback();
  }, [authContext, setAuthToken]);
  return {
    authToken,
    isAuth,
    login,
    logout
  };
}