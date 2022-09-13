import React from 'react'
import { ConfigContext } from '../contexts';
import { useLocalStorage } from ".";
import { Config, SolanaNetwork } from '../types';

export default function useConfig() {
  const config: Config | undefined = React.useContext(ConfigContext);

  if (!config) throw new Error("useConfig must be used inside ConfigProvider");

  const [rpc, setRpcState] = useLocalStorage("rpc", config.RPC_List[0].url);

  const setRpc = (name: string) => {
    if (config.network === SolanaNetwork.Devnet) return;

    const rpc = config.RPC_List.find((option) => option.name === name);
    if (rpc) {
      setRpcState(rpc.url);
    } else {
      throw new Error("RPC not found");
    }
  };

  const getRpcName = () => {
    if (config.network === SolanaNetwork.Devnet) return "Devnet";

    const rpc: any = config.RPC_List.find((option) => option.url === rpc);
    if (rpc) return rpc.name;
    return "Unknown RPC";
  };

  return {
    network: config.network,
    rpc_url: rpc,
    api_url: config.production ? config.prodUrl : config.localUrl,
    setRpc,
    getRpcName,
  };
}
