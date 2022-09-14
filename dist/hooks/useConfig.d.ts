import { SolanaNetwork } from '../types';
export default function useConfig(): {
    network: SolanaNetwork;
    rpc_url: string | String;
    api_url: String;
    setRpc: (name: string) => void;
    getRpcName: () => any;
};
