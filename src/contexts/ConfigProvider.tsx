import React from 'react'
import { ConfigContext } from './contexts'
import { Config, SolanaNetwork } from '../types'
import { useLocalStorage } from 'react-base-kit'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';

type Props = { config: Config, children: React.ReactNode }
export default function ConfigProvider({ config, children }: Props) {

  const [rpc, setRpcState] = useLocalStorage("rpc", config.network === SolanaNetwork.Devnet ? 'https://api.devnet.solana.com/' : config.RPC_List[0].url);

  const [custom, setCustom] = React.useState(config.custom);

  const network = React.useMemo(() => {
    switch (config.network) {
      case SolanaNetwork.Mainnet:
        return WalletAdapterNetwork.Mainnet
      default:
        return WalletAdapterNetwork.Devnet;
    }
  }, [config.network])

  const wallets = React.useMemo(
    () => (config.wallets && config.wallets.length) ? config.wallets : [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  React.useEffect(() => {
    if (config.network == SolanaNetwork.Mainnet && getRpcName() === 'Unknown RPC') {
      setRpc(config.RPC_List[0].name);
    } else {
      setRpc(getRpcName());
    }
  }, [])


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
      custom,
      setRpc,
      getRpcName,
      setCustom
    }} >
      <ConnectionProvider endpoint={rpc}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </ConfigContext.Provider>
  )
}
