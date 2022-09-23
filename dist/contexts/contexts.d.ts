import React from "react";
import { SolanaNetwork } from "../types";
export interface IConfigContext {
    network: SolanaNetwork;
    rpc_url: string;
    setRpc: (name: string | String) => void;
    getRpcName: () => string;
}
export declare const ConfigContext: React.Context<IConfigContext | undefined>;
export interface IAuthContext {
    loginMethod: (...args: any) => Promise<string>;
    logoutCallback?: () => void;
}
export declare const AuthContext: React.Context<IAuthContext | undefined>;
