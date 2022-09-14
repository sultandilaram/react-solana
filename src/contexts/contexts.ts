import React from "react";
import { Config } from "../types";

export const ConfigContext = React.createContext<Config | undefined>(undefined);

export interface IAuthContext {
  loginMethod: (...args: any) => Promise<string>;
  logoutCallback?: () => void;
}
export const AuthContext = React.createContext<IAuthContext | undefined>(
  undefined
);
