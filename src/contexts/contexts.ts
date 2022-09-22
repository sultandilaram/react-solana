import React from "react";
import { SolanaNetwork } from "../types";

export interface IConfigContext {
  network: SolanaNetwork;
  rpc_url: string;
  setRpc: (name: string | String) => void;
  getRpcName: () => string;
}
export const ConfigContext = React.createContext<IConfigContext | undefined>(
  undefined
);

export interface IAuthContext {
  loginMethod: (...args: any) => Promise<string>;
  logoutCallback?: () => void;
}
export const AuthContext = React.createContext<IAuthContext | undefined>(
  undefined
);
