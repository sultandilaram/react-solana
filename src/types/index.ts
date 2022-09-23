export enum SolanaNetwork {
  Devnet = "devnet",
  Testnet = "testnet",
  Mainnet = "mainnet-beta",
}

export type RPC = {
  name: string;
  url: string;
};
export interface Config {
  network: SolanaNetwork;
  RPC_List: RPC[];
}
