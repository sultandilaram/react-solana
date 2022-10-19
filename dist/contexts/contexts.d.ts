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
export declare const ConfigContext: React.Context<IConfigContext<unknown> | undefined>;
export interface IStakingContext {
}
