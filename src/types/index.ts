import * as web3 from "@solana/web3.js";
import { Adapter } from "@solana/wallet-adapter-base";

export enum SolanaNetwork {
  Devnet = "devnet",
  Testnet = "testnet",
  Mainnet = "mainnet-beta",
}

export type RPC = {
  name: string;
  url: string;
};

export interface Config<T = unknown> {
  network: SolanaNetwork;
  RPC_List: RPC[];
  wallets?: Adapter[];
  custom?: T;
}

export interface TxSigners {
  tx: web3.Transaction;
  signers: web3.Signer[];
}

export * from "./nft";
export * from "./staking";
export * from "./StakingProgram";
