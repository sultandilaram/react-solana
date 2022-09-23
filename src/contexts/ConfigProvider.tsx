import React from 'react'
import { ConfigContext } from './contexts'
import { Config, SolanaNetwork } from '../types'
import { useLocalStorage } from 'react-base-kit'

type Props = { config: Config, children: React.ReactNode }
export default function ConfigProvider({ config, children }: Props) {

  React.useEffect(() => {
    if (getRpcName() === 'Unknown RPC') {
      setRpc(config.RPC_List[0].name);
    }
  }, [])

  const [rpc, setRpcState] = useLocalStorage("rpc", config.network === SolanaNetwork.Devnet ? 'https://api.devnet.solana.com/' : config.RPC_List[0].url);

  const setRpc = React.useCallback((name: string | String) => {
    if (config.network === SolanaNetwork.Devnet) return setRpcState("https://api.devnet.solana.com/");

    const rpc = config.RPC_List.find((option) => option.name === name);
    if (rpc) {
      setRpcState(rpc.url);
    } else {
      throw new Error("RPC not found");
    }
  }, [config, setRpcState]);

  const getRpcName = React.useCallback(() => {
    if (config.network === SolanaNetwork.Devnet) return "Devnet";

    const _rpc: any = config.RPC_List.find((option) => option.url === rpc);
    if (_rpc) return _rpc.name;
    return "Unknown RPC";
  }, [config, rpc]);

  return (
    <ConfigContext.Provider value={{
      network: config.network,
      rpc_url: rpc,
      setRpc,
      getRpcName,
    }} >
      {children}
    </ConfigContext.Provider>
  )
}
