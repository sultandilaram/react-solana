import React from "react";
import { Config } from "../types";

export const ConfigContext = React.createContext<Config | undefined>();
// export const AuthProvider = React.createContext<

export { default as ConfigProvider } from "./ConfigProvider";
