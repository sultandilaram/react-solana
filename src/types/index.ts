import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export enum SolanaNetwork {
  Devnet = "devnet",
  Testnet = "testnet",
  Mainnet = "mainnet-beta",
}

export type Network = SolanaNetwork;

export type Production = Boolean;

export type Url = String;

export type RPC = {
  name: String;
  url: Url;
};

export interface Config {
  network: Network;
  production: Production;
  localUrl: Url;
  prodUrl: Url;
  RPC_List: RPC[];
}
