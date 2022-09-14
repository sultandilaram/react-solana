import React from "react";
import { Config } from "../types";
export declare const ConfigContext: React.Context<Config | undefined>;
export interface IAuthContext {
    loginMethod: (...args: any) => Promise<string>;
    logoutCallback?: () => void;
}
export declare const AuthContext: React.Context<IAuthContext | undefined>;
