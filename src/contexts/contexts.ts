import React from "react";
import { SolanaNetwork } from "../types";

export interface IConfigContext<T = unknown> {
  network: SolanaNetwork;
  rpc_url: string;
  custom?: T;
  setRpc: (name: string | String) => void;
  getRpcName: () => string;
  setCustom: React.Dispatch<T>;
}
export const ConfigContext = React.createContext<IConfigContext | undefined>(
  undefined
);

export interface IStakingContext {}
