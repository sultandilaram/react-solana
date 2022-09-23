import React from 'react';
import { ConfigContext } from './contexts';
import { SolanaNetwork } from '../types';
import { useLocalStorage } from 'react-base-kit';
export default function ConfigProvider({
  config,
  children
}) {
  React.useEffect(() => {
    console.log('rpc', getRpcName());

    if (config.network == SolanaNetwork.Mainnet && getRpcName() === 'Unknown RPC') {
      setRpc(config.RPC_List[0].name);
    } else {
      setRpc(getRpcName());
    }
  }, []);
  const [rpc, setRpcState] = useLocalStorage("rpc", config.network === SolanaNetwork.Devnet ? 'https://api.devnet.solana.com/' : config.RPC_List[0].url);
  const setRpc = React.useCallback(name => {
    if (config.network === SolanaNetwork.Devnet) return setRpcState("https://api.devnet.solana.com/");
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
  return /*#__PURE__*/React.createElement(ConfigContext.Provider, {
    value: {
      network: config.network,
      rpc_url: rpc,
      setRpc,
      getRpcName
    }
  }, children);
}