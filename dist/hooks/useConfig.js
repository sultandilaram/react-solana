import React from 'react';
import { ConfigContext } from '../contexts/contexts';
import { useLocalStorage } from ".";
import { SolanaNetwork } from '../types';
export default function useConfig() {
  const config = React.useContext(ConfigContext);
  if (!config) throw new Error("useConfig must be used inside ConfigProvider");
  const [rpc, setRpcState] = useLocalStorage("rpc", config.network === SolanaNetwork.Devnet ? 'https://api.devnet.solana.com/' : config.RPC_List[0].url);
  const setRpc = React.useCallback(name => {
    if (config.network === SolanaNetwork.Devnet) return;
    const rpc = config.RPC_List.find(option => option.name === name);

    if (rpc) {
      setRpcState(rpc.url);
    } else {
      throw new Error("RPC not found");
    }
  }, [config, setRpcState]);
  const getRpcName = React.useCallback(() => {
    if (config.network === SolanaNetwork.Devnet) return "Devnet";

    const _rpc = config.RPC_List.find(option => option.url === rpc);

    if (_rpc) return _rpc.name;
    return "Unknown RPC";
  }, [config, rpc]);
  return {
    network: config.network,
    rpc_url: rpc,
    api_url: config.production ? config.prodUrl : config.localUrl,
    setRpc,
    getRpcName
  };
}